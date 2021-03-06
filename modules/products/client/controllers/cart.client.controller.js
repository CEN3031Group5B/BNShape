'use strict';

// Articles controller
angular.module('products').controller('CartController', ['$scope', '$rootScope','$stateParams', '$location', 'Authentication', 'Products', '$cookieStore',
  function ($scope, $rootScope,$stateParams, $location, Authentication, Products, $cookieStore) {
    $scope.authentication = Authentication;
    $scope.editing_index = -1;
    $scope.cart_items = []; //all the ids of the products in cart
    $scope.cart_total = 0.00;
    $scope.display_items = []; //the actual products with attributes
    $scope.filter_items = []; //used to help filter sizes
    $scope.quantity_dict = {}; //maps cookie string with quantity

    $scope.getItems = function () {
      var current_items = String($cookieStore.get('cart'));
      if(current_items !== "undefined"){
        $scope.cart_items = current_items.split('&');
        $scope.filter_items = current_items.split('&');
        $scope.filter();
      } 
    };

    $scope.filter = function() {
        var i = 0;
        for(i = 0; i < $scope.cart_items.length; i++){
            var product = $scope.findOne($scope.cart_items[i].split("-")[0],$scope.found_one_cb);
        }
    };
    $scope.found_one_cb = function(data){
        var priceString = data.price;
        var price = parseFloat(priceString.split('$')[1]);
        var dis = 0.0;
        if(data.discount !== ""){
            dis = $scope.parse_discount(data.discount);
        }
        $scope.cart_total += price * (1+dis);

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

    $scope.parse_discount = function(discountString) {
        var discNum =  discountString.split("%")[0];
        var discFloat = parseFloat(discNum);
        var lessThanOne = discFloat / 100;
        return lessThanOne;
    };

    $scope.findOne = function (_product_id,cb) {
      return Products.get({productId: _product_id},cb);
    };

    $scope.save_edit_cart = function(_id, updated_quantity, price, size, discount){
        if(updated_quantity !== undefined){ //if no change in select then this occurs
            var current_quantity = $scope.quantity_dict[_id + "-" + size];
            if(current_quantity !== parseInt(updated_quantity)){
                $scope.quantity_dict[_id + "-" + size] = updated_quantity;
                var adj_price = parseFloat(price);
                if(discount !== ""){
                  adj_price = adj_price * (1+$scope.parse_discount(discount));
                }
                if(parseInt(updated_quantity) < current_quantity){
                    var num_to_delete = current_quantity - parseInt(updated_quantity);  
                    $scope.cart_items.sort(); //organize so we can easily splice
                    var index = $scope.cart_items.indexOf(_id + "-" + size);
                    $scope.cart_items.splice(index, num_to_delete);
                    $scope.cart_total -= num_to_delete * adj_price;
                } else {
                    var num_to_add = parseInt(updated_quantity) - current_quantity;
                    for(var i = 0; i < num_to_add; i++){
                        $scope.cart_items.push(_id + "-" + size);
                    }
                    $scope.cart_total += num_to_add * adj_price;
                }
                $cookieStore.remove('cart');
                $cookieStore.put('cart', $scope.cart_items.join("&"));
                $rootScope.$broadcast('cart_update', { newCookie: $scope.cart_items.join("&"), total:$scope.cart_total});
            }
        }
        $scope.editing_index = -1;
    };

    $scope.start_edit = function(index){
        $scope.editing_index = index;
    };

    $scope.quick_delete_cart = function(productId, quantity, index_to_delete, size, discount){
        var num_to_delete = quantity;
        $scope.cart_items.sort(); //organize so we can easily splice
        for(var index = 0; index < $scope.cart_items.length; index++){
              if($scope.cart_items[index] === productId + "-" + size){
                    $scope.cart_items.splice(index, quantity); //delete all with this id
                    break; //no need to run 
              }
        }
        /**update total**/
        var deleted_product = $scope.display_items[index_to_delete];
        var price = parseFloat(deleted_product.price.split('$')[1]);
        if(discount !== ""){
          price = price * (1+$scope.parse_discount(discount));
        }
        var deleted_price = quantity * price;
        $scope.cart_total -= deleted_price;

        /***update cart**/
        $scope.display_items.splice(index_to_delete,1); //don't display it anymore
        $cookieStore.remove('cart');
        if($scope.display_items.length!==0){
          $cookieStore.put('cart', $scope.cart_items.join("&"));
          $rootScope.$broadcast('cart_update', { newCookie: $scope.cart_items.join("&"), total:$scope.cart_total});
        } else {
          $rootScope.$broadcast('cart_update', { newCookie: '', total:0.0});
        }

    };
  }
]);