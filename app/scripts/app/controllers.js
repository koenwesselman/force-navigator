'use strict';

angular.module('forceNavigator')
  .controller('MainCtrl', function ($injector, siteSvc, $window, $scope, $rootScope, chromeStorage, $filter, $http, $cookies) {

  	angular.bootstrap(document.getElementById('sfnav-wrapper'), ['chieffancypants.loadingBar']);
  	$scope.isDisplayed = true;
  	$scope.isSettings = false;
  	$scope.actionReturnData = {};


  	chromeStorage.init().then(function(data) {
  		siteSvc.init();
	  	$scope.items = siteSvc.items;
	  	$scope.stats = siteSvc.stats;
	  	$scope.shortcut = chromeStorage.data.shortcut;
	  	$scope.newShortcut = angular.copy($scope.shortcut.main);
  	});


	$scope.selectedIndex = -1;

 	$scope.pressedEnter = function($event) {
 		if($scope.selectedIndex >= 0) $scope.go($scope.selectedIndex);
 	}
 	$scope.pressedUp = function($event) {
 		$scope.selectedIndex--;
 		if($scope.selectedIndex < 0) $scope.selectedIndex = $scope.filteredItems.length - 1;
 	}
 	$scope.pressedDown = function($event) {
 		$scope.selectedIndex++;
 		if($scope.selectedIndex > $scope.filteredItems.length - 1) $scope.selectedIndex = 0;
 	}

 	$scope.sortByMostHits = function(item)
 	{
 		if($scope.stats[item.name] !== undefined)
 			return $scope.stats[item.name].totalHits === undefined ? 0 : -1 * $scope.stats[item.name].totalHits;

 		return 0;
 	}

 	$scope.kill = function() {
 		$window.sfnav.hide();
 	}

 	$scope.resetEverything = function() {
 		chrome.storage.local.clear();
 		$window.sfnav.destroy();
 	}

 	$scope.go = function(index) {
 		// $scope.stats = $scope.stats || {};
 		$scope.stats[$scope.filteredItems[index].name] = $scope.stats[$scope.filteredItems[index].name] || {};

 		var keyStat = $scope.stats[$scope.filteredItems[index].name];
 		if(keyStat.totalHits === undefined) keyStat.totalHits = 1;
 		else	keyStat.totalHits++;

 		var now = new Date();
 		keyStat.lastHit = now.getTime();
 		// $scope.stats[$scope.filteredItems[index].name] = angular.copy(keyStat);
 		//using this to make sure we get the callback when it's saved.
 		// chromeStorage.set(chromeStorage.data, function() {
 			$scope.isDisplayed = false;

 			siteSvc.go($scope.filteredItems[index]).then(function(data){
 				$scope.actionReturnData = data;
 			}); 
 			// the above call should go to the service and determine what do do and then do it.
 			// doAction
 			//$window.location.href = $scope.filteredItems[index].url;

 			// Need to instead tell the site service to do
 			//  something with the item that was just selected/hit enter on
 		// });
 	}

 	$scope.refresh = function() {
 		siteSvc.refresh();
 	}

	angular.element($window).on('keydown', function(e) {
		switch (e.keyCode) {
			case 38:
				$scope.pressedUp();
				$scope.$apply();
				e.preventDefault();				
				break;
			case 40:
				$scope.pressedDown();
				$scope.$apply();
				e.preventDefault();				
				break;
			case 13:
				$scope.pressedEnter();
				$scope.$apply();
				e.preventDefault();
				break;
		}
		
    });

  });