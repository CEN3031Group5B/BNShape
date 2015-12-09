'use strict';

// Articles controller
angular.module('products').controller('OrderController', ['$scope', '$rootScope','$stateParams', '$state', 'Authentication', 'Products', '$cookieStore','$modal','$window',
  function ($scope, $rootScope, $stateParams, $state, Authentication, Products, $cookieStore, $modal, $window) {
	//$scope.authentication = Authentication;
	$scope.user = Authentication.user;
	$scope.delivery_details = true;
	$scope.terms = false;
	$scope.cart_items = [];
	$scope.quantity_dict = {};
	$scope.display_items = [];
  $scope.filter_items = [];
	$scope.cart_total = 0.00;
	$scope.shipping_price = 5.00;

	$scope.order_init = function(){
		var current_items = String($cookieStore.get('cart'));
      	if(current_items !== "undefined"){
        	$scope.cart_items = current_items.split('&');
          $scope.filter_items = current_items.split('&');
        	$scope.filter();
      } 
	};

	$scope.filter = function() {
        //"562bc2f8b82bbbf8f91f72ba"
        var i = 0;
        for(i = 0; i < $scope.cart_items.length; i++){
            var product = $scope.findOne($scope.cart_items[i].split("-")[0],$scope.found_one_cb);
        }
    };

    $scope.found_one_cb = function(data){
        var priceString = data.price;
        var price = parseFloat(priceString.split('$')[1]);
        $scope.cart_total += price;

        var add_id = "";
        var i = 0;
        for(i = 0; i < $scope.filter_items.length; i++){
            if($scope.filter_items[i].split("-")[0] === data._id){
                add_id = $scope.filter_items[i].split("-")[1];
                $scope.filter_items.splice(i, 1);
                break;
            }
        }

        data._size_id = add_id;
        add_id = data._id + "-" + add_id;
        if($scope.quantity_dict[add_id] !== undefined){
            var current_quantity = $scope.quantity_dict[add_id];
            $scope.quantity_dict[add_id] = current_quantity + 1;
        } else {
            $scope.quantity_dict[add_id] = 1;
            $scope.display_items.push(data);
        }
    };

    $scope.parse_price = function(priceString) {
        return parseFloat(priceString.split('$')[1]);
    };

    $scope.findOne = function (_product_id,cb) {
      return Products.get({productId: _product_id},cb);
    };

	$scope.open = function(){
    	var modalInstance = $modal.open({
      		animation: true,
      		templateUrl: 'myModalContent.html',
      		size: 'lg',
		});
		var state_change = $rootScope.$on('$stateChangeSuccess', 
			function(event, toState, toParams, fromState, fromParams){
				modalInstance.close();				
				state_change(); //destroys event
			});
	};

	$scope.confirm = function(){
		//all valid as well
		if($scope.terms){
			
			$window.open('https://www.paypal.com', '_blank');
		} else {
			alert("Please check terms and conditions");
		}
	};

}]);