'use strict';

var React = require('react-native');
var GiftedSpinner = require('react-native-gifted-spinner');
var greetings = require('./greetings.js');
var NestoriaAPI = require('./nestoriaAPI.js');


var {
  Image,
  StyleSheet,
  TouchableOpacity,
	Navigator,
  Text,
	TextInput,
  View,
	ListView,
	TouchableHighlight,
	AsyncStorage,
} = React;

var SearchUI;
var ResultUI;
var Toolbar;
var _toolbarTitle;
var _navigator;

var STORAGE_KEY_RECENT : '@RecentSearches:key';

var MESSAGE_ZERO_ERROR = "There were no properties found for the given location.";
var MESSAGE_LOCATION_MATCH_ERROR = "The location given was not recognised.";
var MESSAGE_NETWORK_CONNECTION_ERROR = "An error occurred while searching. Please check your network connection and try again.";
var MESSAGE_LOCATION_ENABLE_ERROR = "The use of location is currently disabled.";
var MESSAGE_LOCATION_NF_ERROR = "Unable to detect current location. Please ensure location is turned on in your phone settings and try again.";


var PropertySearchPage = React.createClass({
	componentDidMount() {
		if(this.state.state == 'Initial'){
			console.log("Retrieving db!");
			this._loadInitialStateRecentSearches().done();
		}
  },
	
	async _loadInitialStateRecentSearches() {
    try {
			console.log("Get Item from db, key: " + STORAGE_KEY_RECENT);
      var value = await AsyncStorage.getItem(STORAGE_KEY_RECENT);
      if (value !== null){
				//console.log("STRING:::::: " + value);
				var jsonObject = JSON.parse(value);
				console.log("PropertySearch: objects retrieved from DB: " + jsonObject);
        this.setState({recentSearches: this.state.recentSearches.cloneWithRows(jsonObject)});
      } else {
        this.setState({recentSearches: this.state.recentSearches.cloneWithRows([{resultsInfo: {location:{long_title: 'No recent searches'}, total_results:0}}])});
      }
    } catch (error) {
			console.log("AsyncStorage GET error: " + error);
      this.setState({state: 'Error', errorMessage: "Serious error!"});
    }
  },
	
	async _addValueRecentSearches(value) {
    
    try {
			var storedValue = await AsyncStorage.getItem(STORAGE_KEY_RECENT);
						
			if(storedValue !== null){
				var jsonArray = JSON.parse(storedValue);
				var filterObject = jsonArray.filter(prop => prop.resultsInfo.location.place_name === value.resultsInfo.location.place_name)[0];
				console.log("Filtered object: " + filterObject);
				
				if(filterObject === undefined){
					var array = ([value]).concat(jsonArray);
					await AsyncStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(array));
					console.log('Added search to recentSearches: ' + JSON.stringify(value.resultsInfo));
					
				}else{
					jsonArray.forEach(function(result, index) {
						if(result.resultsInfo.location.place_name === filterObject.resultsInfo.location.place_name) {
							//Set to above new element
							jsonArray.splice(index, 1);
						}    
					});
					var array = ([value]).concat(jsonArray);
					await AsyncStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(array));
					console.log('Changed search of recentSearches to: ' + JSON.stringify(value.resultsInfo));
				}
			}else{
				await AsyncStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify([value]));
			}
			this._loadInitialStateRecentSearches().done();
    } catch (error) {
      console.log('AsyncStorage ADD error: ' + error.message);
    }
  },

  async _removeStorageRecentSearches() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_RECENT);
      console.log('Selection removed from disk.');
    } catch (error) {
      console.log('AsyncStorage REMOVE error: ' + error.message);
    }
  },
	
	render: function(){
		_toolbarTitle = 'PropertyCross';
		_navigator = this.props.navigator;
		
		SearchUI = this._renderSearchUI();
		ResultUI = this._renderResultUI();
		Toolbar = this._renderToolbar();
		return (
		
			<View style = {styles.container}>
				{Toolbar}
				{SearchUI}
				{ResultUI}
			</View>
		);
	
	},
	
	getInitialState: function() {
		STORAGE_KEY_RECENT = '@RecentSearches:key';
		this._removeStorageRecentSearches();
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1!== r2});
		var dsLocations = new ListView.DataSource({rowHasChanged: (r1, r2) => r1!== r2});
		return {
			state: 'Initial',
		  searchString: '',
			recentSearches: ds.cloneWithRows([{resultsInfo: {location:{long_title: 'No recent searches'}, total_results:0}}]),
			locations: dsLocations.cloneWithRows([{long_title: "No locations found"}]),
		};
	},
	
	_onClickGo: function(){
		this.setState({ state: 'Loading' });
		console.log("Searching for: " + this.state.searchString);
		try{
		NestoriaAPI.getProperties('place_name', this.state.searchString, 1)
			.done(res => this._handleResponse(res));
		}catch(error){
			console.log("PropertySearchPage: Error in executeQuery: " + error);
			this.setState({
				state: 'Error',
				errorMessage: MESSAGE_NETWORK_CONNECTION_ERROR,
			});
		}
		// var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    // this._executeQuery(query);
		
	},
	/*
	_executeQuery: function(query){
		
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json.response))
      .catch(error => {
				console.log("PropertySearchPage: Error in executeQuery: " + error);
        this.setState({
          state: 'Error',
					errorMessage: MESSAGE_NETWORK_CONNECTION_ERROR,
        });
      });
	},*/
	
	_handleResponse(response) {
		console.log("PropertySearchPage: Response code of nestoria request: " + response.application_response_code);
		var nextState = 'Error';
		//Check apllication response code:
		if(response.application_response_code <200){
			//Request was valid
			console.log("PropertySearchPage: Request from nestoria is valid");
			nextState = 'Initial';
		}else if(response.application_response_code < 300){
			//Listings not returned, bad location
			if(response.application_response_code == 200){
				console.log("PropertySearchPage: Request from nestoria has suggested locations");
				nextState = 'ListedLocations'
				
			}else if(response.application_response_code == 202){
				console.log("PropertySearchPage: Request from nestoria has suggested locations");
				nextState = 'ListedLocations'
				
			}else{
				console.log("PropertySearchPage: The request to nestoria was not valid(Bad location): " + response.application_response_code);
				nextState = 'Error';
				this.setState({state: 'Error', errorMessage: MESSAGE_LOCATION_MATCH_ERROR,});
				return;
			}
		}else{
			console.log("PropertySearchPage: The request to nestoria was not valid: " + response.application_response_code);
			nextState = 'Error';
			this.setState({state: 'Error', errorMessage: MESSAGE_LOCATION_MATCH_ERROR});
			return;
		}
		
		if(nextState == 'Initial'){
			//Response was valid with a good location!
			if(response.listings.length == 0){
				console.log("PropertySearchPage: listings is empty!");
				nextState = 'Error';
				this.setState({state: 'Error', errorMessage: MESSAGE_ZERO_ERROR});
				
			}else{
				
				var resultsInfo = {
					location: response.locations[0], 
					lengthSearchResults: response.listings.length, 
					total_results: response.total_results,
					pageSearchResults: response.page,
					total_pages: response.total_pages
					};
						
				//Add search to asyncstorage.
				var storageValue = {resultsInfo: resultsInfo};
				this._addValueRecentSearches(storageValue);
				
				if (response.application_response_code.substr(0, 1) === '1') {
					this.props.navigator.push({
						id: 'SearchResults',
						searchResults:  response.listings,
						resultsInfo: resultsInfo,
					});
					if(this.state.state = 'Loading'){
						this.state.state = 'Initial';
					}
				} else {
					this.setState({state: 'Error', errorMessage: 'Serious error!'});
				}
			}
		}else{
			//Bad location but with possibilities
			var locations = response.locations;
			this.setState({
				state: nextState,	//ListedLocations
				locations: this.state.locations.cloneWithRows(locations),
			});
			
		}
  },
	
	_onClickMyLocation: function(){
		console.log("Searching for position!");
		this.setState({state: 'Loading'});
		navigator.geolocation.getCurrentPosition(
      (position) => {
				console.log("Searching...");
        this.setState({state: 'Loading'});
				console.log("Searching with geolocation: " + JSON.stringify(position));
				//centre_point=51.684183,-3.431481
				try{
					NestoriaAPI.getProperties('centre_point', position.coords.longitude + ',' + position.coords.latitude, 1)
						.done(res => this._handleResponse(res));
				}catch(error){
					console.log("PropertySearchPage: Error in executeQuery: " + error);
					this.setState({
						state: 'Error',
						errorMessage: MESSAGE_NETWORK_CONNECTION_ERROR,
					});
				}
					
				// var query = urlForQueryAndPage('centre_point', position.coords.longitude + ',' + position.coords.latitude, 1);
				// this._executeQuery(query);
        
      },
      (error) => {
			console.log("PropertySearchPage: error in geolocation:" + JSON.stringify(error));
			this.setState({state:'Error', errorMessage: MESSAGE_LOCATION_NF_ERROR});
						
			},
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000}
    );
	},
	
	_navigateToFaves: function(){
		this.props.navigator.push({id: 'Favourites'})
	},
	
	_renderToolbar: function(){
		return(
			<View style={styles.toolbar}>
				<Text style={styles.toolbarButton}>{''}</Text>
				<Text style={styles.toolbarTitle}>{_toolbarTitle}</Text>
				<TouchableOpacity onPress = {this._navigateToFaves}>
					<Text style={styles.toolbarButton}>{'Faves'}</Text>
				</TouchableOpacity>
			</View>
		);
	},
	
	_renderSearchUI: function(){
		
		return(
			<View style={styles.SearchUI}>
				<Text style = {styles.text}>
					<Text>Use the form below to search for houses to </Text>
					<Text>buy. You can search by place-name, postcode, or</Text>
					<Text> click 'My location', to search in your current location</Text>
				</Text>
				<TextInput 
					style={styles.textInput}
					onChangeText={(searchString) => this.setState({searchString})}
					onSubmitEditing={this._onClickGo}
					value={this.state.searchString}
				/>
				<View style = {{ flexDirection: 'row'}}>
					<TouchableOpacity 
						style = {styles.button} 
						onPress = {this._onClickGo}>
						<Text style= {styles.buttonText}>Go</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style = {styles.button} 
						onPress = {this._onClickMyLocation}>
						<Text style= {styles.buttonText}>My location</Text>
					</TouchableOpacity>
					
				</View>
			</View>
		);
	},
	
	_renderResultUI: function(){
		
		switch(this.state.state){
			case 'Initial':
				return(
					<View style={styles.recentSearches}>
						<Text>Recent searches:</Text>
						<View style={styles.recentSearchesList}>
						<ListView
							style= {styles.recentSearchesList}
							dataSource={this.state.recentSearches}
							renderRow={this._renderRowRecentSearch}
						/>
						</View>
						
					</View>
				);
			case 'ListedLocations':
				return(
					<View style={styles.recentSearches}>
						<Text>Please select a location below:</Text>
						<View style={styles.recentSearchesList}>
						<ListView
							style= {styles.recentSearchesList}
							dataSource={this.state.locations}
							renderRow={this._renderRowLocations}
						/>
						</View>
						
					</View>
				);
			case 'Loading':
				return(
				<View style = {styles.ResultUI_loading}>
					<GiftedSpinner/>
				</View>
				);
			default: //Error state
				return(
					<View style = {styles.ResultUI}>
						<Text style = {styles.text}>{this.state.errorMessage}</Text>
						
					</View>
				);
		}
	},
	
	_renderRowRecentSearch: function(rowData){
		return (
      <TouchableHighlight onPress={() => this._onClickList(rowData.resultsInfo.location)}
					underlayColor='#dddddd'>
				<View>
					<View style={styles.rowRecentSearch}>
						<Text>{rowData.resultsInfo.location.long_title} </Text>
						<Text>({rowData.resultsInfo.total_results})</Text>
						
					</View>
					<View style={styles.separator}/>
				</View>
			</TouchableHighlight>
    );
		
	},
	
	_renderRowLocations: function(rowData){
		return (
      <TouchableHighlight onPress={() => this._onClickList(rowData)}
					underlayColor='#dddddd'>
				<View>
					<View style={styles.rowRecentSearch}>
						<Text>{rowData.long_title}</Text>
						
					</View>
					<View style={styles.separator}/>
				</View>
			</TouchableHighlight>
    );
		
	},
	
	_onClickList: function(location){
		if(location.place_name !== undefined){
			this.setState({state: 'Loading'});
			console.log("Searching for properties near: " + location.long_title);
			// var query = urlForQueryAndPage('place_name', location.place_name, 1);
			// this._executeQuery(query);
			try{
			NestoriaAPI.getProperties('place_name', location.place_name, 1)
				.done(res => this._handleResponse(res));
			}catch(error){
				console.log("PropertySearchPage: Error in executeQuery: " + error);
				this.setState({
					state: 'Error',
					errorMessage: MESSAGE_NETWORK_CONNECTION_ERROR,
				});
			}
			
		}
	},
	
	
	
});

/*
function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
      country: 'uk',
      pretty: '1',
      encoding: 'json',
      listing_type: 'buy',
      action: 'search_listings',
      page: pageNumber
  };
  data[key] = value;

  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'http://api.nestoria.co.uk/api?' + querystring;
};*/

var styles = StyleSheet.create({
	container:{
    //backgroundColor: '#F0FCFF',
		flex: 1,
		flexDirection: 'column',
	},
	
  SearchUI: {
    paddingLeft: 5,
		paddingRight: 5,
		paddingTop: 5,
    flexDirection: 'column',
    //justifyContent: 'left',
    alignItems: 'flex-start',
    //backgroundColor: '#F0FCFF',
  },
	button: {
    borderColor: '#111',
		borderWidth: 3,
		
		padding:10,
		marginLeft:5,
		marginRight:5,
  },
	
	buttonText: {
		//fontSize:20,
		//backgroundColor: 'transparent',
		color: '#111',
		
	},
	
	textInput: {
		height: 40,
		fontSize: 16, 
		borderColor: 'gray', 
		borderWidth: 1
	},
	
	
	ResultUI: {
		paddingTop: 10,
		paddingLeft: 5,
		paddingRight: 5,
		flex: 1,
		flexDirection: 'column',

	},
	
	ResultUI_loading: {
		paddingTop: 5,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	
	
	text:{
		fontSize: 15,
		flex: 1,
	},
	
	toolbar:{
			backgroundColor:'#81c04d',
			paddingTop:8,
			paddingBottom:8,
			paddingLeft: 5,
			paddingRight: 5,
			flexDirection:'row'    //Step 1
	},
	toolbarButton:{
			width: 60,            //Step 2
			fontSize: 20,
			color:'#fff',
			textAlign:'center'
	},
	toolbarTitle:{
			color:'#fff',
			fontSize: 20,
			textAlign:'center',
			fontWeight:'bold',
			flex:1                //Step 3
	},
	
	
	recentSearches:{
		flexDirection: 'column',
		paddingTop: 10,
		paddingBottom:15,
		paddingLeft: 5,
		paddingRight: 5,
		flex:1,
		
	},
	recentSearchesList:{
		borderColor: '#000',
		borderWidth: 1,
		flex:1,
		
	},
	rowRecentSearch:{
		flexDirection: 'row',
		padding: 10,
	},
	
});

module.exports = PropertySearchPage;