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

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var _navigator;


var MOCKED_MOVIES_DATA = [
  {title: 'Title', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
];

var FavouritesPage = React.createClass({
	render: function(){
		_navigator = this.props.navigator;
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
				  //onSelect={() => this.selectTwo()}
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
		this.props.navigator.push({title: 'PropertySearchPage',
		name: 'PropertySearchPage', state: 'Initial',});
		
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
});

module.exports = FavouritesPage;