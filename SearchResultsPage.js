'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} = React;


var MOCKED_MOVIES_DATA = [
  {title: 'Title', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
];

var SearchResultsPage = React.createClass({
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

module.exports = SearchResultsPage;