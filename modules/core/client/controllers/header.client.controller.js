'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus','$cookieStore', 'Products',
  function ($scope, $state, Authentication, Menus, $cookieStore, Products) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.cart_items = [];
    $scope.cart_popup = "cart_popup.html";
    $scope.price = 0.0;
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
        if(args.total === undefined){
          $scope.price += args.price;
        } else {
          $scope.price = args.total;
        }
        //$scope.$apply(); //show the changes
    });

    $scope.init_header = function() {
      var current_items = String($cookieStore.get('cart'));
      if(current_items !== "undefined"){
        $scope.cart_items = current_items.split('&');
        $scope.set_price();
      } else {
        $scope.cart_items = [];
      }
    };
    $scope.set_price = function() {
        //"562bc2f8b82bbbf8f91f72ba"
        var i = 0;
        for(i = 0; i < $scope.cart_items.length; i++){
            var product = $scope.findOne($scope.cart_items[i].split("-")[0],$scope.found_one_cb);
        }
    };
    $scope.findOne = function (_product_id,cb) {
      return Products.get({productId: _product_id},cb);
    };
    $scope.found_one_cb = function(data){
       var item_price = $scope.parse_price(data.price);
       $scope.price += item_price;
    };

    $scope.parse_price = function(priceString) {
        return parseFloat(priceString.split('$')[1]);
    };

  }
]);
