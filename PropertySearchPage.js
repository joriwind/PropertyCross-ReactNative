'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  TouchableOpacity,
	Navigator,
  Text,
  View,
} = React;


var MOCKED_MOVIES_DATA = [
  {title: 'Title', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
];

var PropertySearchPage = React.createClass({
	render: function(){
		return this.renderMovie();
	
	},
	
	renderMovie: function() {
		//var TouchableElement = TouchableNativeFeedback;
		var movie = MOCKED_MOVIES_DATA[0];
		return (
		
		<View style={styles.container}>
			
			<TouchableOpacity onPress = {this.selectTwo}>
				<Image
				  source={{uri: movie.posters.thumbnail}}
				  style={styles.thumbnail}
				/>
			</TouchableOpacity>
			<View style={styles.rightContainer}>
			  <Text style={styles.title}>{movie.title}</Text>
			  <Text style={styles.year}>{movie.year}</Text>
			</View>
		</View>
		);
	},
	
	selectTwo: function(){
		this.props.navigator.push({name: 'Favourites',index:2,});
		
	},
	
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0FCFF',
  },
	rightContainer: {
    flex: 1,
    //backgroundColor: '#00FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  
  listView: {
    //paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
});

module.exports = PropertySearchPage;