'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} = React;


var PropertyListingPage = React.createClass({
	render: function(){
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
				<Text style={styles.toolbarButton}>{'+'}</Text>
			</View>
		);
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