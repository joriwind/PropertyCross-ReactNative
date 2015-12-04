'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
	ListView,
	BackAndroid,
} = React;

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator ) {
    _navigator.replace({name: 'PropertySearch', state: 'Initial'});
    return true;
	}else{
		return false;
	}
});

var _navigator;

var SearchResultsPage = React.createClass({
	
	getInitialState: function() {
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1!== r2});
		
		if(this.props.searchResults){
			return {
				dataSource: ds.cloneWithRows(this.props.searchResults),
			};
		}else{
			return {
				dataSource: ds.cloneWithRows(['An error occured']),
			};
		}
		
	},
	
	render: function(){
		_navigator = this.props.navigator;
		console.log('Render search results');
		return(
			<ListView
				dataSource={this.state.dataSource}
				renderRow={this._renderRow}
			/>
		);
	
	},
	
	_renderRow(rowData) {
		var price = rowData.price_formatted.split(' ')[0];
    return (
      <TouchableHighlight onPress={() => this._onRowPressed(rowData.guid)}
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
	
	_onRowPressed(propertyGuid){
		var property = this.props.searchResults.filter(prop => prop.guid === propertyGuid)[0];
		console.log(JSON.stringify(property));
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
  }
});

module.exports = SearchResultsPage;