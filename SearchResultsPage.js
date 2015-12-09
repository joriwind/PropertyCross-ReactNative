'use strict';

var React = require('react-native');
var {
  Image,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
	ListView,
	ScrollView,
} = React;


var _navigator;
var _toolbarTitle;

var MESSAGE_LOADMORE = 'Load more ...';
var MESSAGE_LOADING = 'Loading ...';

var SearchResultsPage = React.createClass({
	
	componentDidMount() {
		this._loadSearchResults(this.props.searchResults);
  },
	
	getInitialState: function() {
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1!== r2});
		
		return {
			dataSource: ds.cloneWithRows([]),
			messageEOL: MESSAGE_LOADMORE,
		};
		
	},
	
	async _loadSearchResults(searchResults){
		this.setState({dataSource: this.state.dataSource.cloneWithRows(searchResults),});
	},
	
	render: function(){
		console.log('Navigated to resultspage');
		if(this.props.resultsInfo){
			_toolbarTitle = this.props.resultsInfo.lengthSearchResults
											 + " of " + this.props.resultsInfo.total_results + " matches";
		}else{
			_toolbarTitle = 'Search results';
		}
		_navigator = this.props.navigator;
		
		console.log('Render search results'); //{Toolbar}
		return(
		<View style={{flex: 1}}>
			{this._renderToolbar()}
			{this._renderList()}
			</View>
		);
	
	},
	
	_renderList: function(){
		return(
		<ScrollView
        automaticallyAdjustContentInsets={false}
        scrollEventThrottle={200}>
			<ListView
				dataSource={this.state.dataSource}
				renderRow={this._renderRow}
			/>
			<TouchableHighlight onPress={this._onClickLoadMore}
					underlayColor='#dddddd'>
				<View style={styles.rowContainerMessageEOL}>
					<Text style={styles.messageEOL}>{this.state.messageEOL}</Text>
				</View>
			</TouchableHighlight>
		</ScrollView>
				);
	},
	
	_renderToolbar: function(){
		return(
			<View style={styles.toolbar}>
				<Text style={styles.toolbarButton}>{''}</Text>
				<Text style={styles.toolbarTitle}>{_toolbarTitle}</Text>
				<Text style={styles.toolbarButton}>{''}</Text>
			</View>
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
		
		this.props.navigator.push({
        id: 'PropertyListing',
        property:  property,
      });
				
	},
	
	_onClickLoadMore(){
		this.setState({messageEOL: MESSAGE_LOADING});
		
		
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
  },
	
	rowContainerMessageEOL:{
		
    alignItems: 'center',
    padding: 10,
		
	},
	
	messageEOL: {
		fontSize: 20,
		
    color: '#656565',
		textAlign: 'center',
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

module.exports = SearchResultsPage;