// var APP_KEY = "8445b85126f7794b9d532fb8d317138bf4866ebf";
var APP_KEY = "09a764c6158bb633c508748e5ae636a45bc04b0d";

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ngStorage'])
.constant('appName', 'News Reader App')
.constant('APP_KEY', '8445b85126f7794b9d532fb8d317138bf4866ebf')
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
		controller: 'SettingsCtrl'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })
  
  .state('app.page404', {
    url: '/page404',
    views: {
      'menuContent': {
        templateUrl: 'templates/page404.html',
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
})
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

.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (input[i].id == id) {
        return input[i];
      }
    }
    return null;
  }
});
