/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  BackAndroid,
  ToolbarAndroid,
  Platform,
  Navigator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,

} = React;

var PropertySearchPage = require('./PropertySearchPage');
var SearchResultsPage = require('./SearchResultsPage');
var PropertyListingPage = require('./PropertyListingPage');
var FavouritesPage = require('./FavouritesPage');

var _toolbarTitle;

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});
var RouteMapper = function(route, navigationOperations, onComponentRef){
	_navigator = navigationOperations;
	console.log('rendering..... what?: ' + JSON.stringify(route));
	switch(route.name){
		case 'PropertySearch':
			_toolbarTitle = 'PropertyCross';
			console.log('PropertySearch');
			return (
				<View style={{flex: 1}}>
					<Toolbar/>
					<PropertySearchPage navigator={navigationOperations}/>
				</View>
			);
			
		case 'SearchResults':
			_toolbarTitle = 'Search results';
			console.log('SearchResults');
			return (
				<View style={{flex: 1}}>
					<Toolbar/>
					<SearchResultsPage navigator={navigationOperations} searchResults={route.searchResults}/>
				</View>
			);
			
		case 'PropertyListing':
			_toolbarTitle = 'Listing';
			console.log('PropertyListing');
			return (
				<View style={{flex: 1}}>
					<Toolbar/>
					<PropertyListingPage navigator={navigationOperations}/>
				</View>
			);
			
		case 'Favourites':
			_toolbarTitle = 'Favourites';
			console.log('Favourites');
			return (
				<View style={{flex: 1}}>
					<Toolbar/>
					<FavouritesPage navigator={navigationOperations}/>
				</View>
			);
			
		default:
			_toolbarTitle = 'Error';
			console.log('default');
			return (
				<View style={{flex: 1}}>
					<Toolbar/>
					
					<Text>{'Something went wrong!'}</Text>
				</View>
				
			);
			
	}
	
		
};

var PropertyCrossReactNative = React.createClass({
  render: function() {
			var initialRoute = {name: 'PropertySearch'};
    return (
			<Navigator
				style={styles.container}
				initialRoute={initialRoute}
				configureScene={() => Navigator.SceneConfigs.fadeAndroid}
				renderScene={RouteMapper}
			/>
    );
  },
});

var Toolbar = React.createClass({
	
	_onClick: function(){
		_navigator.replace({name: 'Favourites'})
	},
	
	render: function(){
		return(
			// <View>
				<View style={styles.toolbar}>
					<Text style={styles.toolbarButton}>{''}</Text>
					<Text style={styles.toolbarTitle}>{_toolbarTitle}</Text>
					<TouchableOpacity onPress = {this._onClick}>
						<View style = {styles.box}>
						<Text style={styles.toolbarButton}>{'Faves'}</Text>
						</View>
					</TouchableOpacity>
				</View>
				// <ToolbarAndroid
					// actions={[{title: 'Faves', show: 'always', showWithText: true}]}
					// style={styles.toolbar}
					// titleColor = "white"
					// title={"PropertyCross"}
				// />
			// </View>
		);
	}
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
	toolbar: {
    backgroundColor: '#81c04d',
		paddingTop:10,
		paddingBottom:10,
		paddingRight:5,
		flexDirection: 'row'
  },
	box: {
    backgroundColor: '#707070',
    borderColor: '#717171',
    borderWidth: 1,
  },
	toolbarButton:{
		fontSize:20,
		width: 70,
		color: '#fff',
		textAlign: 'center',
		// borderStyle: 'dashed',
		// borderWidth: 5,
		// backgroundColor: '#527FE4',
		// borderColor: '#fff'
		
	},
	toolbarTitle:{
		fontSize:20,
		color: '#fff',
		textAlign: 'center',
		fontWeight: 'bold',
		flex: 1
	}
  
});

AppRegistry.registerComponent('PropertyCrossReactNative', () => PropertyCrossReactNative);
