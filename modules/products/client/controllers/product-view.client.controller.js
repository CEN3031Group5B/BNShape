'use strict';

// Product View controller
angular.module('products').controller('ProductViewController', ['$scope', '$rootScope','$stateParams', '$state', '$location', 'Authentication', 'Products', '$cookieStore',
  function ($scope, $rootScope, $stateParams, $state, $location, Authentication, Products, $cookieStore) {
    $scope.authentication = Authentication;
    $scope.this_product_id = $stateParams.productId;
    $scope.this_product = Products.get({ productId: $scope.this_product_id });
        //, function() { console.log($scope.this_product); });
    $scope.qty = 1;
    $scope.user = $scope.authentication.user;
    $scope.admin_eligible = ($scope.user !== 0) && ($scope.user.roles.indexOf("admin") > -1);
    $scope.admin = false;
    $scope.modified_vars = -2;
    $scope.modified_sizes = -2;

    $scope.$watchCollection(
        function getValue() { return $scope.this_product; },
        function collectionChanged() { ++$scope.modified_vars; console.log("blip1"); });

    $scope.$watchCollection(
        function getValue() { return $scope.this_product.sizes; },
        function collectionChanged() { ++$scope.modified_sizes; console.log("blip2"); });

    // Get average rating
    $scope.getRating = function() {
    	var sum = 0;
		for( var i = 0; i < $scope.this_product.reviews.length; i++ ){
		    sum += parseInt( $scope.this_product.reviews[i], 10 ); // Decimal base
		}

		return sum/$scope.this_product.reviews.length;
    };

    // Add a blank size choice
    $scope.addSize = function() {
    	$scope.this_product.sizes.push("New Size");
    };

    // Remove an existing size
    $scope.removeSize = function(_index) {
    	$scope.this_product.sizes.splice(_index, 1);//remove(_size);
    };

    // Increment quantity to add to cart
    $scope.incQty = function(_index) {
        ++$scope.qty;
    };
    

    // Increment quantity to add to cart
    $scope.decQty = function(_index) {
        if ($scope.qty > 1)
            --$scope.qty;
    };

    Array.prototype.remove = function() {
	    var what, a = arguments, L = a.length, ax;
	    while (L && this.length) {
	        what = a[--L];
	        while ((ax = this.indexOf(what)) !== -1) {
	            this.splice(ax, 1);
	        }
	    }
	    return this;
	};

    $scope.add_cart = function(_id){
        var prevCookie = "";
        prevCookie = $cookieStore.get('cart');
        var updatedCookie = _id;
        if(prevCookie !== undefined){
          $cookieStore.remove('cart');
          updatedCookie = prevCookie + "&" + _id;
        }
        // Add the quantity of products
        for ( var i = 0; i < $scope.qty - 1; ++i )
          updatedCookie += "&" + _id;
        $cookieStore.put('cart',updatedCookie);
        $rootScope.$broadcast('cart_update', { newCookie: updatedCookie});
        $state.go('cart');
    };

    $scope.newProduct = function () {
      //fill with actual data
      var product = new Products({
        name: 'New Product',
        code: 'NOCODE',
        reviews: [],
        price: '$0.00',
        reward_price: '0',
        reward_points: '0',
        description: 'No description.',
        availability: 'Out of stock',
        sizes: ['S', 'M', 'L']
      });

      // Redirect after creating
      product.$save(function (response) {
        console.log("New product created. Redirecting...");
        $state.go('products.view', {productId: product._id});

      }, function (errorResponse) {
        console.log("Error");
      });
    };


    $scope.cloneProduct = function () {
      //fill with actual data
      var product = new Products({
        name: "New " + $scope.this_product.name,
        code: $scope.this_product.code,
        reviews: [],
        price: $scope.this_product.price,
        reward_price: $scope.this_product.reward_price,
        reward_points: $scope.this_product.reward_points,
        description: $scope.this_product.description,
        availability: $scope.this_product.availability,
        sizes: $scope.this_product.sizes
      });

console.log(product);
      console.log("Tests: " + product._id);
      // Redirect after creating
      product.$save(function (response) {
        console.log("New product cloned. Redirecting...");
        $state.go('products.view', {productId: product._id});

      }, function (errorResponse) {
        console.log("Error");
      });
    };

    // Save changes
    $scope.saveChanges = function() {
      $scope.this_product.$update( function (response) {
        console.log("Saved changes");
        console.log(response);
        $scope.modified_vars = -1;
        $scope.modified_sizes = 0;

      }, function (errorResponse) {
        console.log("Error when trying to save changes!");
        console.log(errorResponse);
      });
    };
  }
]);
