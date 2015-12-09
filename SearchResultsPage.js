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

var NestoriaAPI = require('./nestoriaAPI.js');

var _navigator;
var _currentPage = 1;
var _propertyList;
var _lengthList;
var _totalLength;

var MESSAGE_LOADMORE = 'Load more ...';
var MESSAGE_LOADING = 'Loading ...';

var SearchResultsPage = React.createClass({
	
	componentDidMount() {
		_propertyList = this.props.searchResults;
		_currentPage = parseInt(this.props.resultsInfo.pageSearchResults);
		
		if(this.props.resultsInfo){
			_lengthList = this.props.resultsInfo.lengthSearchResults;
			_totalLength = this.props.resultsInfo.total_results;
		}else{
			_lengthList = 0;
			_totalLength = 0;
		}
		
		this._loadSearchResults(_propertyList);
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
				<Text style={styles.toolbarTitle}>{_lengthList + " of " + _totalLength + " matches"}</Text>
				<Text style={styles.toolbarButton}>{''}</Text>
			</View>
		);
	},
	
	_renderRow(rowData) {
		var price = rowData.price_formatted.split(' ')[0];
    return (
      <TouchableHighlight onPress={() => this._onRowPressed(rowData)}
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
	
	_onRowPressed(property){
		console.log(property);
		
		this.props.navigator.push({
        id: 'PropertyListing',
        property:  property,
      });
				
	},
	
	_onClickLoadMore(){
		this.setState({messageEOL: MESSAGE_LOADING});
		_currentPage = _currentPage + 1;
		console.log("Retrieving data from nestoria on page: " + _currentPage);
		try{
		NestoriaAPI.getProperties('place_name', this.props.resultsInfo.location.place_name, _currentPage)
			.done(res => this._handleResponse(res));
		}catch(error) {
				console.log("PropertySearchPage: Error in executeQuery: " + error);
				this.setState({
					state: 'Error',
					errorMessage: MESSAGE_NETWORK_CONNECTION_ERROR,
				});
		}
		
	},
	
	_handleResponse(response){
		console.log("SearchResultsPage: Response code of nestoria request: " + response.application_response_code);
				
		if(response.application_response_code <200){
			//Response was valid with a good location!
			console.log("SearchResultsPage: Request from nestoria is valid");
			if(response.listings.length == 0){
				console.log("SearchResultsPage: listings is empty!");
				
			}else{
				
				var resultsInfo = {
					location: response.locations[0], 
					lengthSearchResults: response.listings.length, 
					total_results: response.total_results,
					pageSearchResults: response.page,
					total_pages: response.total_pages
					};
					
				_propertyList = _propertyList.concat(response.listings);
				_lengthList = _lengthList + resultsInfo.lengthSearchResults;
				_totalLength = resultsInfo.total_results;
				this.setState({dataSource: this.state.dataSource.cloneWithRows(_propertyList),});
			}
		}else{
			console.log("SearchResultsPage: The request to nestoria was not valid: " + response.application_response_code);
		}
		this.setState({messageEOL: MESSAGE_LOADMORE});
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