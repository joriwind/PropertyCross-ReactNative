'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  TouchableOpacity,
	BackAndroid,
  Text,
  View,
	AsyncStorage,
} = React;

var STORAGE_KEY_FAVS = '@Favs:key';
var _navigator;

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var PropertyListingPage = React.createClass({
	
	componentDidMount() {
		this._setIsFav(this.props.property);
  },
	
	getInitialState: function() {
		// this._removeStorageFavs();
		return {
			isFavourite: false,
		};
	},
	
	render: function(){
		console.log('Navigated to PropertyListingPage');
		_navigator = this.props.navigator;
		var property = this.props.property;
    var stats = property.bedroom_number + ' bed ' + property.property_type;
    if (property.bathroom_number) {
      stats += ', ' + property.bathroom_number + ' ' + (property.bathroom_number > 1
        ? 'bathrooms' : 'bathroom');
    }
 
    var price = property.price_formatted.split(' ')[0];
 
    return (
			<View style={{flex:1}}>
				{this._renderToolbar()}
				<View style={styles.container}>
					<Image style={styles.image} 
							source={{uri: property.img_url}} />
					<View style={styles.heading}>
						<Text style={styles.price}>£{price}</Text>
						<Text style={styles.title}>{property.title}</Text>
						<View style={styles.separator}/>
					</View>
					<Text style={styles.description}>{stats}</Text>
					<Text style={styles.description}>{property.summary}</Text>
				</View>
			</View>
    );
	},
	
	_renderToolbar: function(){
		return(
			<View style={styles.toolbar}>
				<Text style={styles.toolbarButton}>{''}</Text>
				<Text style={styles.toolbarTitle}>{'Property Details'}</Text>
				<TouchableOpacity onPress = {this._onClickAddFav}>
					<Text style={styles.toolbarButton}>{this._getFavButton()}</Text>
				</TouchableOpacity>
			</View>
		);
	},
	
	_getFavButton(){
		if(this.state.isFavourite){
			return '-';
		}else{
			return '+';
		}
		
	},
	
	_onClickAddFav(){
		this._toggleFav(this.props.property);
	},
		
	async _toggleFav(value) {
    
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
					await AsyncStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(jsonArray));
					console.log('Deleted Favs to: ' + JSON.stringify(value));
				}
			}else{
				await AsyncStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify([value]));
			}
			this.setState({isFavourite: !this.state.isFavourite});
			
    } catch (error) {
      console.log('PropertyListingPage: AsyncStorage ADD error: ' + error.message);
    }
  },
	
	async _setIsFav(property) {
    try {
			console.log("Get Items from db, key: " + STORAGE_KEY_FAVS);
      var value = await AsyncStorage.getItem(STORAGE_KEY_FAVS);
      if (value !== null){
				var jsonArray = JSON.parse(value);
				var filterObject = jsonArray.filter(prop => prop.guid === property.guid)[0];
				if(filterObject !== undefined){
					console.log("Is a fav!");
					this.setState({isFavourite: true});
					return;
				}
					console.log("Is not a fav!");
					this.setState({isFavourite: false});
					return;
      } else {
					console.log("Is not a fav!");
					this.setState({isFavourite: false});
					return;
      }
    } catch (error) {
			console.log("PropertyListingPage: AsyncStorage GET error: " + error);
    }
  },
	
	
});

var styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  heading: {
    backgroundColor: '#F8F8F8',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDDDDD'
  },
  image: {
    width: 400,
    height: 300
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 5,
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    margin: 5,
    color: '#656565'
  },
  description: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
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

module.exports = PropertyListingPage;