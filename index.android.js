/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  ToolbarAndroid,
  Navigator,
  StyleSheet,
  Text,
  View,

} = React;

var PropertySearchPage = require('./PropertySearchPage');
var SearchResultsPage = require('./SearchResultsPage');
var PropertyListingPage = require('./PropertyListingPage');
var PropertyFavouritesPage = require('./PropertyFavouritesPage');

var _navigator;
var RouteMapper = function(route, navigationOperations, onComponentRef){
	_navigator = navigationOperations;
	switch(route.name){
		case 'PropertySearch':
			return (
				<View style={{flex: 1}}>
					<Toolbar/>
					<PropertySearchPage navigator={navigationOperations}/>
				</View>
			);
			
		case 'SearchResults':
			return (
				<View style={{flex: 1}}>
					<Toolbar/>
					<SearchResultsPage navigator={navigationOperations}/>
				</View>
			);
			
		case 'PropertyListing':
			return (
				<View style={{flex: 1}}>
					<Toolbar/>
					<PropertyListingPage navigator={navigationOperations}/>
				</View>
			);
			
		case 'Favourites':
			return (
				<View style={{flex: 1}}>
					<Toolbar/>
					<PropertyFavouritesPage navigator={navigationOperations}/>
				</View>
			);
			
		default:
			return (
				<View style={{flex: 1}}>
					<Toolbar/>
					<Text>
					{'Something went wrong!'}
					
					</Text>
				</View>
				
			);
			
	}
	
		
};

var PropertyCrossReactNative = React.createClass({
  render: function() {
			var initialRoute = {name: 'PropertySearch',state: 'Initial'}
    return (
			<Navigator
				style={styles.container}
				initialRoute={initialRoute}
				configureScene={() => Navigator.SceneConfigs.fadeAndroid}
				renderScene={RouteMapper}
    );
  }
});

var Toolbar = React.createClass({
	render: function(){
		return(
			<View>
				<ToolbarAndroid
					actions={[]}
					style={styles.toolbar}
					titleColor = "white"
					title={"PropertyCross"}
				/>
			</View>
		);
	}
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
	toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
  
});

AppRegistry.registerComponent('PropertyCrossReactNative', () => PropertyCrossReactNative);
