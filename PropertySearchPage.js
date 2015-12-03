'use strict';

var React = require('react-native');
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

var _state;

var MOCKED_MOVIES_DATA = [
  {title: 'Title', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
];

var PropertySearchPage = React.createClass({
	render: function(){
		return (
			<View style = {styles.container}>
				<SearchUI/>
				<ResultUI/>
			</View>
		);
	
	},
	
	
});

var ResultUI = React.createClass({
	render: function(){
		switch(_state){
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
			default: //Error state
				return(
					<View style = {styles.ResultUI}>
						<Text style = {styles.text}>There was a problem with your search</Text>
					</View>
				);
		}
	}
})

var SearchUI = React.createClass({
	_onClickGo: function(){
		
	},
	
	_onClickMyLocation: function(){
		
	},
	
	render: function(){
		return(
			<View style={styles.SearchUI}>
				<Text style = {styles.text}>
					<Text>Use the form below to search for houses to </Text>
					<Text>buy. You can search by place-name, postcode, or</Text>
					<Text> click 'My location', to search in your current location</Text>
				</Text>
				<TextInput 
					style={{height: 40, borderColor: 'gray', borderWidth: 1}}
					//onChangeText={} 
					//value={}
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
	}
});

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
	
	text:{
		fontSize: 15,
	}
	
});

module.exports = PropertySearchPage;