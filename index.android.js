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
	console.log('rendering..... what?: ' + route.name);
	
	switch(route.name){
		case 'PropertySearch':
			console.log('PropertySearch');
			return (
				<View style={{flex: 1}}>
					<PropertySearchPage navigator={navigationOperations}/>
				</View>
			);
			
		case 'SearchResults':
			console.log('SearchResults');
			return (
				<View style={{flex: 1}}>
					<SearchResultsPage navigator={navigationOperations} searchResults={route.searchResults} resultsInfo = {route.resultsInfo}/>
				</View>
			);
			
		case 'PropertyListing':
			console.log('PropertyListing');
			return (
				<View style={{flex: 1}}>
					<PropertyListingPage navigator={navigationOperations} property={route.property}/>
				</View>
			);
			
		case 'Favourites':
			console.log('Favourites');
			return (
				<View style={{flex: 1}}>
					<FavouritesPage navigator={navigationOperations}/>
				</View>
			);
			
		default:
			console.log('default');
			return (
				<View style={{flex: 1}}>
					<View style={styles.toolbar}>
						<Text style={styles.toolbarButton}>{''}</Text>
						<Text style={styles.toolbarTitle}>{'Error'}</Text>
						<Text style={styles.toolbarButton}>{''}</Text>
					</View>
					
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

AppRegistry.registerComponent('PropertyCrossReactNative', () => PropertyCrossReactNative);
