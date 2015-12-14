'use strict';

// Product View controller
angular.module('products').controller('ProductViewController', ['$scope', '$rootScope','$stateParams', '$state', '$location', 'Authentication', 'Products', '$cookieStore', 'FileUploader', '$timeout', '$window',
  function ($scope, $rootScope, $stateParams, $state, $location, Authentication, Products, $cookieStore, FileUploader, $timeout, $window) {
    $scope.authentication = Authentication;
    $scope.this_product_id = $stateParams.productId;
    $scope.this_product = Products.get({ productId: $scope.this_product_id }, function(data) { 
          $scope.imageURL = "/modules/products/client/img/products/" + $scope.this_product.name + ".jpg"; 
    });
    $scope.qty = 1;
    $scope.user = $scope.authentication.user;

    $scope.uploader = new FileUploader({
      url: 'api/products/picture/' + $scope.this_product_id
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    if ($scope.user.roles !== undefined)
        $scope.admin_eligible = ($scope.user.roles.indexOf("admin") > -1);
    else
      $scope.admin_eligible = false;

    $scope.admin = false;
    $scope.modified_vars = -2;
    $scope.modified_sizes = -2;

    $scope.$watchCollection(
        function getValue() { return $scope.this_product; },
        function collectionChanged() { ++$scope.modified_vars; });

    $scope.$watchCollection(
        function getValue() { return $scope.this_product.sizes; },
        function collectionChanged() { ++$scope.modified_sizes; });

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

    $scope.add_cart = function(_id, price, quantity, discount){
        if($scope.this_product.sizes.length === 0){
          $scope.selected_size = "N/A";
        }
        if($scope.selected_size !== undefined) {
          var prevCookie = "";
          prevCookie = $cookieStore.get('cart');
          var updatedCookie = "";
          var i = 0;
          for(i = 0; i < quantity; i++){
            updatedCookie += $scope.this_product_id + "-" + $scope.selected_size;
            if(i !== quantity - 1){
              updatedCookie += "&";
            }
          }
          if(prevCookie !== undefined){
            $cookieStore.remove('cart');
            updatedCookie = prevCookie + "&" + updatedCookie;
          }

          var disc_price = price;
          if(discount !== ""){
            disc_price = parseFloat(price.split('$')[1]) * (1+$scope.parse_discount(discount));
          }
          $cookieStore.put('cart',updatedCookie);
          $rootScope.$broadcast('cart_update', { newCookie: updatedCookie, price: quantity*disc_price});
          $state.go('cart');
        } else {
          alert("select size please");
        }
       
    };

    $scope.parse_discount = function(discountString) {
        var discNum =  discountString.split("%")[0];
        var discFloat = parseFloat(discNum);
        var lessThanOne = discFloat / 100;
        return lessThanOne;
    };    

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Clear upload buttons
      $scope.cancelUpload();

      $scope.imageURL = "/modules/products/client/img/products/" + $scope.this_product.name + ".jpg";

      $scope.$apply();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = "/modules/products/client/img/products/" + $scope.this_product.name + ".jpg";
    };
  }
]);
