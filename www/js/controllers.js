angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $ionicLoading, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

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

.controller('PlaylistsCtrl', function($scope, $http, $ionicLoading) {
	
	 $scope.showLoading = function() {
		$ionicLoading.show({
		  template: 'Loading...'
		});
	  };
	  $scope.hideLoading = function(){
		$ionicLoading.hide();
	  };
	  
	  $scope.showLoading();
	  $scope.playlists = new Array();
	  $http.get("https://whispering-woodland-9020.herokuapp.com/getAllBooks")
		.then(function(response) {
		  //$scope.data = response.data;
		    // $scope.playlists = [
				// { title: 'Reggae', id: 1 },
				// { title: 'Chill', id: 2 },
				// { title: 'Dubstep', id: 3 },
				// { title: 'Indie', id: 4 },
				// { title: 'Rap', id: 5 },
				// { title: 'Cowbell', id: 6 }
			  // ];
			  
			for(var i = 0; i< response.data.books.length; i++){
				console.log({title: response.data.books[i].name, id: response.data.books[i].id,});
				$scope.playlists.push({title: response.data.books[i].name, 
										id: response.data.books[i].id,
										url: response.data.books[i].url,
										price: response.data.books[i].price,
										author: response.data.books[i].author,
										more: response.data.books[i].more});
				
			}
		  $scope.hideLoading();
		});

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
	
});
