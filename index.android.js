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
				//<View style={{flex: 1}}>
					//<Toolbar/>
					<PropertySearchPage navigator={navigationOperations}/>
				// </View>
			);
			
		case 'SearchResults':
			console.log('SearchResults');
			return (
				<View style={{flex: 1}}>
					<Toolbar/>
					<SearchResultsPage navigator={navigationOperations}/>
				</View>
			);
			
		case 'PropertyListing':
			console.log('PropertyListing');
			return (
				<View style={{flex: 1}}>
					<Toolbar/>
					<PropertyListingPage navigator={navigationOperations}/>
				</View>
			);
			
		case 'Favourites':
			console.log('Favourites');
			return (
				// <View style={{flex: 1}}>
					// <Toolbar/>
					<FavouritesPage navigator={navigationOperations}/>
				// </View>
			);
			
		default:
			console.log('default');
			return (
				// <View style={{flex: 1}}>
					// <Toolbar/>
					<ToolbarAndroid
					actions={[]}
					style={styles.toolbar}
					titleColor = "white"
					title={"PropertyCross"}
				/>
					// <Text>{'Something went wrong!'}</Text>
				// </View>
				
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

// var Toolbar = React.createClass({
	// render: function(){
		// return(
			// <View style={{flex: 1}}>
				// <ToolbarAndroid
					// actions={[]}
					// style={styles.toolbar}
					// titleColor = "white"
					// title={"PropertyCross"}
				// />
			// </View>
		// );
	// }
// });

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
	toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
  
});

AppRegistry.registerComponent('PropertyCrossReactNative', () => PropertyCrossReactNative);
