'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus','$cookieStore',
  function ($scope, $state, Authentication, Menus,$cookieStore) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.cart_items = [];
    $scope.cart_popup = "cart_popup.html";

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = true;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = true;
    });

    $scope.$on('cart_update', function(event,args){
        var newCartItems = [];
        if(args.newCookie !== ''){
          if(String(args.newCookie).indexOf("&") > -1){
            newCartItems = args.newCookie.split('&');
          } else {
            newCartItems[0] = args.newCookie;
          }
          $scope.cart_items = newCartItems;
        } else {
          $scope.cart_items = [];
        }
        //$scope.$apply(); //show the changes
    });

    $scope.init_header = function() {
      var current_items = String($cookieStore.get('cart'));
      if(current_items !== "undefined"){
        $scope.cart_items = current_items.split('&');
      } else {
        $scope.cart_items = [];
      }
    };

  }
]);
