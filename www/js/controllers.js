angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $ionicLoading, $timeout, StorageService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.settings = StorageService.getAll();
	
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
  };
  $scope.hideLoading = function(){
    $ionicLoading.hide();
  };
  $scope.showPopup = function(msg){
	var alertPopup = $ionicPopup.alert({
      title: 'Login Error!',
      template: msg
    });
    alertPopup.then(function(res) {
      console.log('popup closed.');
    });
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
	$scope.showLoading();
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
	if($scope.loginData.username == "test" && $scope.loginData.password == "test123" ){
		$timeout(function() {
		  $scope.closeLogin();
		}, 1000);
	} else {
		$scope.showPopup("Incorrect username/password.");
	}
	$scope.hideLoading();
  };
})

.controller('PlaylistsCtrl', function($scope, $http, $ionicModal, $ionicPopup, StorageService, $rootScope, $timeout) {
	$scope.settings = StorageService.getAll();
	console.log(APP_KEY);
	$scope.nextSearckKey = null;
	$scope.search = {text: $scope.settings.defaultSearchText};
	
	
		$scope.showPopup = function(msg){
			var alertPopup = $ionicPopup.alert({
			  title: 'Error!',
			  template: msg
			});
			alertPopup.then(function(res) {
			  console.log('popup closed.');
			});
		  };
	  
	  $scope.playlists = new Array();
	  $scope.clearSearchText = function(){
			console.log("clicked");
			$scope.search.text = '';
	  }
	  
	  
	  $scope.doSearch = function($clearFlag = false){
		 // $scope.showLoading();
		  
		  console.log("search keyword: "+$scope.search.text);
		  var url = "https://gateway-a.watsonplatform.net/calls/data/GetNews?apikey="+APP_KEY
						+"&start=now-7d&end=now&return=enriched.url.url,enriched.url.title,enriched.url.image,enriched.url.text,"
						+"enriched.url.author&q.enriched.url.title="+$scope.search.text+"&outputMode=json&count="+
						$scope.settings.defaultNewsItemCount;
		
		  if($scope.nextSearckKey != null){
			url += "next="+$scope.nextSearckKey;
		  }
		  if($clearFlag){
			$scope.playlists.splice(0, $scope.playlists.length);
		  }
		  $http.get(url)
			.then(function(response) {
		
				  console.log(response);
				 if(response.data.status == "OK"){
					
					for(var i = 0; i< response.data.result.docs.length; i++){
						try{
						$scope.playlists.push({title: response.data.result.docs[i].source.enriched.url.title, 
												id: response.data.result.docs[i].id,
												url: response.data.result.docs[i].source.enriched.url.url,
												imgURL: response.data.result.docs[i].source.enriched.url.image,
												description: response.data.result.docs[i].source.enriched.url.text,
												author: response.data.result.docs[i].source.enriched.url.author,
												keywords: response.data.result.docs[i].source.enriched.url.keywords,
												timestamp: response.data.result.docs[i].timestamp});
						} catch(e){
							console.log(e);
						}
						
					}	
					$scope.nextSearckKey = response.data.result.next;
				}
				else if(response.data.status == "ERROR"){
					$scope.showPopup("Server returned no results");
				}
			 // $scope.hideLoading();
			});
		}
		$scope.doSearchNewsItems = function(){
			$scope.doSearch(true);
		};
		$scope.doRefresh = function() {
    
			console.log('Refreshing!');
			$timeout( function() {
			  //simulate async response
			  $scope.doSearch(true);

			  //Stop the ion-refresher from spinning
			  $scope.$broadcast('scroll.refreshComplete');
			
			}, 1000);
		};
		$scope.loadMoreNewsItems = function(){
			$scope.doSearch();
		};
		 $scope.$on('$stateChangeSuccess', function() {
			$scope.loadMoreNewsItems();
		  });
		  
		$scope.doSearch();
		$rootScope.playlists = $scope.playlists;
		
		
		// Create the login modal that we will use later
		  $ionicModal.fromTemplateUrl('templates/login.html', {
			scope: $scope
		  }).then(function(modal) {
			$scope.filterModal = modal;
		  });
		$scope.showNewsFetchOptions = function(){
			$scope.filterModal.show();
			
		};
		$scope.hideNewsFetchOptions = function(){
			
			$scope.filterModal.hide();
			
		};
})

.controller('PlaylistCtrl', function($scope, $stateParams, $rootScope, $filter, $state) {

	//this 
	console.log($stateParams);
	console.log($rootScope.playlists);
	$scope.newsItem = {};
	
	var id = $stateParams.playlistId;
	 $scope.showdetails = function($id){
		
		if(typeof $rootScope.playlists !== "undefined" && $rootScope.playlists!= null){
			 var item = $filter('getById')($rootScope.playlists, $id);
			 if(typeof  item !== "undefined" && item != null){
				$scope.newsItem = item;
			 } else {
				$state.go('app.page404');
			 }
		 } else {
			$state.go('app.page404');
		 }
		}
	
	$scope.showdetails(id);
})
.controller('SettingsCtrl', function($scope, $stateParams, StorageService, $ionicPopup) {
	//this 
	$scope.settings = StorageService.getAll();
	console.log($scope.settings);
	$scope.add = function (newThing) {
		StorageService.add(newThing);
	  };
	  $scope.remove = function (thing) {
		StorageService.remove(thing);
	  };
	$scope.saveSettings = function(){
		$scope.add({defaultSearchText: $scope.settings.defaultSearchText,
					defaultNewsItemCount: $scope.settings.defaultNewsItemCount,
					defaultTheme: $scope.settings.defaultTheme});
		
		var alertPopup = $ionicPopup.alert({
			  title: 'Success',
			  template: 'The settings have been saved successfully.'
			});
			alertPopup.then(function(res) {
			  console.log('popup closed.');
			});

	}
});
