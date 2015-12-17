"use strict";

var React = require("react-native");
var {
  Image,
  StyleSheet,
  TouchableOpacity,
	TouchableHighlight,
  Text,
  View,
	AsyncStorage,
	ListView,
	ScrollView,
} = React;


var _navigator;
var STORAGE_KEY_FAVS = "@Favs:key";


var FavouritesPage = React.createClass({


	componentDidMount: function() {
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
				<View style={{flex:1}}>
					{this._renderToolbar()}
					<ScrollView
					automaticallyAdjustContentInsets={false}
					scrollEventThrottle={200}

					>

						<ListView
							dataSource={this.state.favs}
							renderRow={this._renderRowFavList}
						/>
					</ScrollView>
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
		var price = rowData.price_formatted.split(' ')[0];
		return(
			<TouchableHighlight onPress={() => this._onClickList(rowData)}
						underlayColor='#dddddd'>
				<View>
					<View style={styles.rowContainer}>
						<Image style={styles.thumb} source={{ uri: rowData.img_url }} />
						<View  style={styles.textContainer}>
							<Text style={styles.price}>£{price}</Text>
							<Text style={styles.title}
										numberOfLines={1}>{rowData.title}</Text>
						</View>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

	FavView: {
		flexDirection: 'column',
		paddingTop: 5,
		paddingLeft: 5,
		paddingRight: 5,
	},

	text: {
		fontSize: 19,
	},

	FavListRow: {
		padding: 10,
		marginTop: 1,
		marginBottom: 1,
		borderColor: '#81c04d',
		borderWidth: 1,
	},

	thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: '#656565'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
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
