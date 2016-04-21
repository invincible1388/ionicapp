angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $ionicLoading, $timeout, StorageService, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.settings = StorageService.getAll();
  if(typeof $scope.settings === "undefined"){
	$scope.settings.defaultTheme = "stable";
  }
  $scope.search = {text: $scope.settings.defaultSearchText};
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
  
  $scope.searchlist = new Array();
  $scope.doSearch = function(){
	
	$state.go('app.searchlist', {searchKeyword: $scope.search.text});
  };
  
   $scope.clearSearchText = function(){
			$scope.search.text = '';
	  };
})


.controller('PlaylistsCtrl', function($scope, $http, $ionicModal, $ionicPopup, StorageService, LoadNewsService, BasicOperationService, $rootScope, $timeout, $stateParams) {
	
	$scope.playlists = $rootScope.playlists;
	$scope.category = $stateParams.category;
	
	if(!$scope.category){
		$scope.category = "home";
	}
	$scope.screenTitle = BasicOperationService.ucfirst($scope.category);
	$scope.settings = StorageService.getAll();
	$scope.nextSearckKey = null;
	
	
	
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
	  
	  $scope.fetchTopStories = function(){
		 var data = LoadNewsService.getTopNews($scope.category, function(data){
			
			 if(data.status == "OK" && data.num_results > 0){
				for(var i = 0; i< data.results.length; i++){
							try{
								if(typeof  $scope.playlists[$scope.category] === "undefined" ){
									$scope.playlists[$scope.category] = new Array();
								 } 
								data.results[i].id = BasicOperationService.generateUuid();
								$scope.playlists[$scope.category].push(data.results[i]);
							} catch(e){
								console.log(e);
							}
							
						}	
			 } else {
				$scope.showPopup("Server returned no results");
			 }
		 
		 });
	  };
	  
	
		
		$scope.doRefresh = function() {
    
			console.log('Refreshing!');
			$timeout( function() {
			  //simulate async response
			  $scope.fetchTopStories();

			  //Stop the ion-refresher from spinning
			  $scope.$broadcast('scroll.refreshComplete');
			
			}, 1000);
		};
		$scope.loadMoreNewsItems = function(){
			//$scope.doSearch();
		};
		 $scope.$on('$stateChangeSuccess', function() {
			//$scope.loadMoreNewsItems();
		  });
		  
		$scope.fetchTopStories();
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
	$scope.category = $stateParams.category;
	
	 $scope.showdetails = function($id){
		
		if(typeof $rootScope.playlists[$scope.category] !== "undefined" && $rootScope.playlists[$scope.category]!= null){
			 var item = $filter('getById')($rootScope.playlists[$scope.category], $id);
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
})

.controller('SearchListCtrl', function($scope, $ionicPopup, StorageService, LoadNewsService, BasicOperationService, $rootScope, $timeout, $stateParams) {
	
	$scope.searchlists = new Array();
	$scope.page = 0;
	$scope.settings = StorageService.getAll();
	$scope.nextSearckKey = null;
	
	
	
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
	 
	  
	  $scope.doSearchNews = function(index){
	  
		var data = LoadNewsService.searchNews($scope.search.text, index, function(data){
	
				
				
				 if(data.status == "OK" && data.response.docs.length > 0){
					data = data.response;
					for(var i = 0; i< data.docs.length; i++){
								try{
									data.docs[i].id = data.docs[i]._id;
									data.docs[i].baseUrl = BasicOperationService.getBaseUrl(data.docs[i].web_url);
									for(var j=0; j< data.docs[i].multimedia.length; j++){
										data.docs[i].multimedia[j].url = data.docs[i].baseUrl+"/"+data.docs[i].multimedia[j].url;
										if(data.docs[i].multimedia[j].subtype=="xlarge"){
											data.docs[i].xlargeimage = data.docs[i].multimedia[j].url;
										} else if(data.docs[i].multimedia[j].subtype=="thumbnail"){
											data.docs[i].thumbimage = data.docs[i].multimedia[j].url;
										}
									}
									$scope.searchlists.push(data.docs[i]);
								} catch(e){
									console.log(e);
								}
								
							}	
				 } else {
					$scope.showPopup("Server returned no results");
				 }
			 
			 });
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
		 $scope.$on('$stateChangeSuccess', function() {
			$scope.loadMoreNewsItems();
		  });
		$scope.loadMoreNewsItems = function(){
			
			$scope.doSearchNews($scope.page++);
		}		
		
		$scope.doSearchNews($scope.page);
		$rootScope.searchlists = $scope.searchlists;
		
		
	
})
.controller('SearchItemCtrl', function($scope, $stateParams, $rootScope, $filter, $state) {

	//this 
	console.log($stateParams);
	console.log($rootScope.searchlists);
	$scope.newsItem = {};
	
	var id = $stateParams.searchlistId;
	$scope.category = $stateParams.category;
	
	 $scope.showdetails = function($id){
		
		if(typeof $rootScope.searchlists !== "undefined" && $rootScope.searchlists != null){
			 var item = $filter('getById')($rootScope.searchlists, $id);
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
});

