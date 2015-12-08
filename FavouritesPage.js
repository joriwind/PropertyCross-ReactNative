'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  TouchableOpacity,
	BackAndroid,
  Text,
  View,
} = React;


var _navigator;
var STORAGE_KEY_FAVS = '@Favs:key';

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var FavouritesPage = React.createClass({
	
	
	componentDidMount() {
		console.log("Retrieving favs from storage!");
		this._loadFavs().done();
  },
	
	getInitialState: function() {
		STORAGE_KEY_RECENT = '@RecentSearches:key';
		//this._removeStorageRecentSearches();
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1!== r2});
		return {
			favs: ds.cloneWithRows([]),
		};
	},
	
	async _loadFavs() {
    try {
			console.log("Get Items from db, key: " + STORAGE_KEY_FAVS);
      var value = await AsyncStorage.getItem(STORAGE_KEY_FAVS);
      if (value !== null){
				var jsonObject = JSON.parse(value);
        this.setState({favs: this.state.recentSearches.cloneWithRows(jsonObject)});
      } else {
        this.setState({favs: this.state.recentSearches.cloneWithRows([])});
      }
    } catch (error) {
			console.log("FavouritesPage: AsyncStorage GET error: " + error);
    }
  },
	
	async _addFav(value) {
    
    try {
			var storedValue = await AsyncStorage.getItem(STORAGE_KEY_FAVS);
						
			if(storedValue !== null){
				var jsonArray = JSON.parse(storedValue);
				var filterObject = jsonArray.filter(prop => prop === value)[0];
				
				if(filterObject === undefined){
					var array = ([value]).concat(jsonArray);
					await AsyncStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(array));
					console.log('Added search to favs: ' + JSON.stringify(value));
					
				}else{
					jsonArray.forEach(function(result, index) {
						if(result.resultsInfo.location.place_name === filterObject.resultsInfo.location.place_name) {
							//Set to above new element
							jsonArray.splice(index, 1);
						}    
					});
					var array = ([value]).concat(jsonArray);
					await AsyncStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(array));
					console.log('Changed search of Favs to: ' + JSON.stringify(value));
				}
			}else{
				await AsyncStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify([value]));
			}
			this._loadFavs().done();
    } catch (error) {
      console.log('FavouritesPage: AsyncStorage ADD error: ' + error.message);
    }
  },

  async _removeStorageFavs() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_FAVS);
      console.log('FavouritesPage: Storage removed from disk.');
    } catch (error) {
      console.log('FavouritesPage: AsyncStorage REMOVE error: ' + error.message);
    }
  },
	
	
	render: function(){
		_navigator = this.props.navigator;
		if(this.state.favs.lenght == 0){
			return(
				<View style={styles.FavView}>
					<Text style={styles.text}>You have not added any properties to your favourites</Text>
				</View>
			
			);
		}else{
			<View style={styles.FavView}>
				<ListView
					style= {styles.FavList}
					dataSource={this.state.favs}
					renderRow={this._renderRowFavList}
				/>
			</View>
		}
	},
	
	_renderRowFavList: function(rowData){
		return(
			<TouchableHighlight onPress={() => this._onClickList(rowData)}
						underlayColor='#dddddd'>
				<View style={styles.FavListRow}>
					<Text>Test</View>
				</View>
			</TouchableHighlight>
		);
	}
	
	_onClickList: function(property){
		
	}
	
	
	
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
	
	FavView: {
		flex:1,
		flexDirection: 'column',
		paddingTop: 5,
		paddingLeft: 5,
		paddingRight: 5,
	},
	
	text: {
		fontSize: 15,
		flex: 1,
	},
	
	FavListRow: {
		
	},
});

module.exports = FavouritesPage;