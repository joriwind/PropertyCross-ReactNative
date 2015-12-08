'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  TouchableOpacity,
	TouchableHighlight,
	BackAndroid,
  Text,
  View,
	AsyncStorage,
	ListView,
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
		// this._removeStorageFavs();
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
        this.setState({favs: this.state.favs.cloneWithRows(jsonObject)});
      } else {
        this.setState({favs: this.state.favs.cloneWithRows([])});
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
				var filterObject = jsonArray.filter(prop => prop.guid === value.guid)[0];
				
				if(filterObject === undefined){
					var array = ([value]).concat(jsonArray);
					await AsyncStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(array));
					console.log('Added search to favs: ' + JSON.stringify(value));
					
				}else{
					jsonArray.forEach(function(result, index) {
						if(result.guid === filterObject.guid) {
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
		console.log("Favourites length: " + this.state.favs._cachedRowCount);
		if(this.state.favs._cachedRowCount == 0){
			return(
				<View>
					{this._renderToolbar()}
					<View style={styles.FavView}>
						<Text style={styles.text}>You have not added any properties to your favourites</Text>
					</View>
				</View>
			
			);
		}else{
			return(
				<View>
					{this._renderToolbar()}
					<View style={styles.FavView}>
						<ListView
							style= {styles.FavList}
							dataSource={this.state.favs}
							renderRow={this._renderRowFavList}
						/>
					</View>
				</View>
			);
		}
	},
	
	_renderToolbar: function(){
		return(
			<View style={styles.toolbar}>
				<Text style={styles.toolbarButton}>{''}</Text>
				<Text style={styles.toolbarTitle}>{'Favourites'}</Text>
				<Text style={styles.toolbarButton}>{''}</Text>
			</View>
		);
	},
	
	_renderRowFavList: function(rowData){
		return(
			<TouchableHighlight onPress={() => this._onClickList(rowData)}
						underlayColor='#dddddd'>
				<View>
					<View style={styles.FavListRow}>
						<Text style={styles.text}>{rowData.title}</Text>
					</View>
					<View style={styles.separator}/>
				</View>
			</TouchableHighlight>
		);
	},
	
	_onClickList: function(property){
		this.props.navigator.push({
        id: 'PropertyListing',
        property:  property,
      });
	},
	
	
	
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
		fontSize: 19,
		flex: 1,
	},
	
	FavListRow: {
		padding: 10,
		marginTop: 1,
		marginBottom: 1,
		borderColor: '#81c04d',
		borderWidth: 1,
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

module.exports = FavouritesPage;