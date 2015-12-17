/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  ToolbarAndroid,
  Platform,
  Navigator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
	BackAndroid,

} = React;

var PropertySearchPage = require('./PropertySearchPage');
var SearchResultsPage = require('./SearchResultsPage');
var PropertyListingPage = require('./PropertyListingPage');
var FavouritesPage = require('./FavouritesPage');

var _navigator;

BackAndroid.addEventListener('hardwareBackPress', () => {
	console.log("Current routes(Home): " + _navigator.getCurrentRoutes());
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});


var PropertyCrossReactNative = React.createClass({
  render: function() {
			var initialRoute = {id: 'PropertySearch'};
    return (
			<Navigator
				ref={this._setNavigatorRef}
				style={styles.container}
				initialRoute={initialRoute}
				renderScene={this.routeMapper}

			/>
    );
  },

	routeMapper: function(route, nav){
		_navigator = nav;
		console.log('rendering..... what?: ' + route.id);

		switch(route.id){
			case 'PropertySearch':
				console.log('PropertySearch');
				return (
					<PropertySearchPage navigator={nav}/>

				);

			case 'SearchResults':
				console.log('SearchResults');
				return (

						<SearchResultsPage navigator={nav} searchResults={route.searchResults} resultsInfo = {route.resultsInfo}/>

				);

			case 'PropertyListing':
				console.log('PropertyListing');
				return (

						<PropertyListingPage navigator={nav} property={route.property}/>

				);

			case 'Favourites':
				console.log('Favourites');
				return (

						<FavouritesPage navigator={nav}/>

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
	},

	_setNavigatorRef: function(navigator) {
    if (navigator !== this._navigator) {
      this._navigator = navigator;

      // if (navigator) {
        // var callback = (event) => {
          // console.log(
            // `TabBarExample: event ${event.type}`,
            // {
              // route: JSON.stringify(event.data.route),
              // target: event.target,
              // type: event.type,
            // }
          // );
        // };
        // Observe focus change events from the owner.
        // this._listeners = [
          // navigator.navigationContext.addListener('willfocus', callback),
          // navigator.navigationContext.addListener('didfocus', callback),
        // ];
      // }
    }
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
