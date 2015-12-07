'use strict';

var React = require('react-native');
var GiftedSpinner = require('react-native-gifted-spinner');


var {
  Image,
  StyleSheet,
  TouchableOpacity,
	Navigator,
  Text,
	TextInput,
  View,
	SwitchAndroid,
} = React;

var SearchUI;
var ResultUI;
var Toolbar;
var _toolbarTitle;


var PropertySearchPage = React.createClass({
	render: function(){
		_toolbarTitle = 'PropertyCross';
		
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
		return {
			state: 'Initial',
		  searchString: '',
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
		try{
		var resultsInfo = {
			lengthSearchResults: response.listings.length, 
			total_results: response.total_results,
			pageSearchResults: response.page,
			total_pages: response.total_pages
			};
		}catch(err){
			console.log("Error: " + err);
		}
		console.log("Total results: " + resultsInfo.total_results);
		console.log("Given results: " + resultsInfo.lengthSearchResults);
		
    if (response.application_response_code.substr(0, 1) === '1') {
      this.props.navigator.push({
        id: 'SearchResults',
        searchResults:  response.listings,
				resultsInfo: resultsInfo,
      });
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
					<View>
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
	},
	
  SearchUI: {
    flex: 1,
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
	
});

module.exports = PropertySearchPage;