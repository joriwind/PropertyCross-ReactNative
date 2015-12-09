function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
      country: 'uk',
      pretty: '1',
      encoding: 'json',
      listing_type: 'buy',
      action: 'search_listings',
      page: pageNumber
  };
  data[key] = value;

  var querystring = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'http://api.nestoria.co.uk/api?' + querystring;
};

module.exports = {
	getProperties: function(key, value, page){
		return new Promise(function(fulfill, reject){
			var url = urlForQueryAndPage(key, value, page);
			try{
				fetch(url)
				.then(response => response.json())
				.then(json => fulfill(json.response))
				
			}catch(ex){
				reject(ex);
			}
			});
		
	},
};
