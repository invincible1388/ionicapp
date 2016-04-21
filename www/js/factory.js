angular.module('starter.factory', ['ngStorage'])
// create a new factory
.factory ('StorageService', function ($localStorage) {
	$localStorage = $localStorage.$default({
					  settings: []
					});
	var _getAll = function () {
	  return $localStorage.settings;
	};
	var _add = function (thing) {
	  $localStorage.settings= thing;
	}
	var _remove = function (thing) {
	  $localStorage.settings.splice($localStorage.settings.indexOf(thing), 1);
	}
	return {
		getAll: _getAll,
		add: _add,
		remove: _remove
	  };
})
.factory ('LoadNewsService', function ($http) {
	var TOPSTORYAPIKEY = "cacb3538ce5b2ee5749dcc94c4ae3a09:0:75027017";
	var ARTICLESEARCHAPIKEY = "017eecab0d21abf7757124e8aaa2fbc6:17:75027017";
	var _getTopNews = function ($category, callback) {
	  if(!$category){
		$category = "home";
	  }
	  var url = "http://api.nytimes.com/svc/topstories/v1/"+$category+".json?api-key="+TOPSTORYAPIKEY;
	  $http.get(url)
			.then(function(response) {
				callback(response.data);
			},
			function(error) {
				callback (null);
			});
		
	};
	
	var _searchNews = function ($keyword, page, callback) {
	  
	  var url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q="+$keyword+"&sort=newest&page="+page+"&h1=true&api-key="+ARTICLESEARCHAPIKEY;
	  console.log(url);
	  $http.get(url)
			.then(function(response) {
				callback(response.data);
			},
			function(error) {
				callback (null);
			});
		
	};
	
	return {
		getTopNews: _getTopNews,
		searchNews: _searchNews,
	  };
})
.factory ('BasicOperationService', function () {
	 var _generateUuid = function() {
	  var result, i, j;
	  result = '';
	  for(j=0; j<32; j++) {
		if( j == 8 || j == 12|| j == 16|| j == 20) 
		  result = result + '-';
		i = Math.floor(Math.random()*16).toString(16).toUpperCase();
		result = result + i;
	  }
	  return result;
	};
	var _ucfirst = function (text) {
		return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
	};
	var _getBaseUrl = function (url) {
		return "http://"+url.split('/')[2];
	};
	return {
		generateUuid: _generateUuid,
		ucfirst: _ucfirst,
		getBaseUrl: _getBaseUrl,
	  };
});