'use strict';

var React = require('react-native');
var GiftedSpinner = require('react-native-gifted-spinner');


var {
  Image,
  StyleSheet,
  TouchableOpacity,
	Navigator,
	BackAndroid,
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

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});


var PropertySearchPage = React.createClass({
	componentDidMount() {
		if(this.state.state = 'Initial'){
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
				console.log("JSON:::::::: " + jsonObject);
				console.log("First object retrieved from DB: " + jsonObject[0].resultsInfo.title);
        this.setState({recentSearches: this.state.recentSearches.cloneWithRows(jsonObject)});
      } else {
        this.setState({recentSearches: this.state.recentSearches.cloneWithRows([{resultsInfo: {title: 'No recent searches', total_results:0}}])});
      }
    } catch (error) {
			console.log("AsyncStorage GET error: " + error);
      this.setState({state: 'Error'});
    }
  },
	
	async _addValueRecentSearches(value) {
    
    try {
			var storedValue = await AsyncStorage.getItem(STORAGE_KEY_RECENT);
						
			if(storedValue !== null){
				var jsonArray = JSON.parse(storedValue);
				var filterObject = jsonArray.filter(prop => prop.resultsInfo.title === value.resultsInfo.title)[0];
				console.log("Filtered object: " + filterObject);
				
				if(filterObject === undefined){
					var array = ([value]).concat(jsonArray);
					await AsyncStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(array));
					console.log('Added search to recentSearches: ' + JSON.stringify(value.resultsInfo));
					
				}else{
					jsonArray.forEach(function(result, index) {
						if(result.resultsInfo.title === filterObject.resultsInfo.title) {
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
		// this._removeStorageRecentSearches();
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1!== r2});
		return {
			state: 'Initial',
		  searchString: '',
			recentSearches: ds.cloneWithRows([{resultsInfo: {title: 'No recent searches', total_results:0}}]),
		};
	},
	
	_onClickGo: function(){
		this.setState({ state: 'Loading' });
		console.log("Searching for: " + this.state.searchString);
		var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query);
		
	},
	
	_executeQuery: function(query){
		
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json.response))
      .catch(error => {
        this.setState({
          state: 'Error'
        });
      });
	},
	
	_handleResponse(response) {
		console.log("Response!" + response.listings);//JSON.stringify(response.listings)
		
		var resultsInfo = {
			title: response.locations[0].title,
			lengthSearchResults: response.listings.length, 
			total_results: response.total_results,
			pageSearchResults: response.page,
			total_pages: response.total_pages
			};
		
		console.log("Title of location: " + resultsInfo.title);
		console.log("Total results: " + resultsInfo.total_results);
		console.log("Given results: " + resultsInfo.lengthSearchResults);
				
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
      this.setState({state: 'Error'});
    }
  },
	
	_onClickMyLocation: function(){
		
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
					<View style = {styles.toolbarBox}>
					<Text style={styles.toolbarButton}>{'Faves'}</Text>
					</View>
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
					style={{height: 40, borderColor: 'gray', borderWidth: 1}}
					onChangeText={(searchString) => this.setState({searchString})}
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
		if(this.props.state){
			this.state.state = this.props.state;
			console.log("PropertySearchPage changed state: " + this.props.state);
		}
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
			case 'Listed location':
				return(
					<View>
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
						<Text style = {styles.text}>There was a problem with your search</Text>
						
					</View>
				);
		}
	},
	
	_renderRowRecentSearch: function(rowData){
		return (
      <TouchableHighlight onPress={() => this._onClickRecentSearch(rowData.resultsInfo.title)}
					underlayColor='#dddddd'>
				<View>
					<View style={styles.rowRecentSearch}>
						<Text>{rowData.resultsInfo.title} </Text>
						<Text>({rowData.resultsInfo.total_results})</Text>
						
					</View>
					<View style={styles.separator}/>
				</View>
			</TouchableHighlight>
    );
		
	},
	
	_onClickRecentSearch: function(title){
		//var value = this.state.recentSearches.filter(prop => prop.resultsInfo.title === title)[0];
		this.setState({ state: 'Loading' });
		console.log("Searching again for: " + title);
		var query = urlForQueryAndPage('place_name', title, 1);
    this._executeQuery(query);
		
			
	},
	
	
});


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
};

var styles = StyleSheet.create({
	container:{
    //backgroundColor: '#F0FCFF',
		flex: 1,
		flexDirection: 'column',
	},
	
  SearchUI: {
    
		paddingTop: 5,
    flexDirection: 'column',
    //justifyContent: 'left',
    alignItems: 'flex-start',
    //backgroundColor: '#F0FCFF',
  },
	button: {
    backgroundColor: '#707070',
    //borderColor: '#717171',
    //borderWidth: 5,
		//borderRadius:5,
		paddingLeft: 5,
		paddingRight: 5,
		paddingTop: 1,
		paddingBottom: 1,
		marginLeft:5,
		marginRight:5,
  },
	
	buttonText: {
		fontSize:17,
		
	},
	
	ResultUI: {
		paddingTop: 5,
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
	},
	
	toolbar: {
    backgroundColor: '#81c04d',
		paddingTop:10,
		paddingBottom:10,
		paddingRight:5,
		flexDirection: 'row'
  },
	toolbarBox: {
    backgroundColor: '#707070',
    borderColor: '#717171',
    borderWidth: 1,
  },
	toolbarButton:{
		fontSize:20,
		width: 70,
		color: '#fff',
		textAlign: 'center',		
	},
	toolbarTitle:{
		fontSize:20,
		color: '#fff',
		textAlign: 'center',
		fontWeight: 'bold',
		flex: 1
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