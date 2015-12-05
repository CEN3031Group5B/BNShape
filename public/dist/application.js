'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

'use strict';

// Use Applicaion configuration module to register a new module
//ApplicationConfiguration.registerModule('articles',['ngCookies','ui.bootstrap']);
ApplicationConfiguration.registerModule('orders', ["ui.bootstrap.modal"]);

'use strict';

// Use Applicaion configuration module to register a new module
//ApplicationConfiguration.registerModule('articles',['ngCookies','ui.bootstrap']);
ApplicationConfiguration.registerModule('products', ['ngCookies']);
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

angular.module('core').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Team',
      state: 'products.list',
      type: '',
      roles: ['*']
    });

	Menus.addMenuItem('topbar', {
      title: 'About Us',
      state: 'products.list',
      type: '',
      roles: ['*']
    });

  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('cart', {
        url: '/cart',
        templateUrl: 'modules/products/client/views/view-cart.client.view.html'
    });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus','$cookieStore',
  function ($scope, $state, Authentication, Menus,$cookieStore) {
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
      } else {
        $scope.cart_items = [];
      }
    };

  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

angular.module('core').controller('CarouselCtrl', ["$scope", function ($scope) {
  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  var slides = $scope.slides = [
    {
      image: 'https://scontent-mia1-1.xx.fbcdn.net/hphotos-xlp1/v/t1.0-9/11220461_973102212753036_5098071536240473268_n.jpg?oh=48f5deb1e654f27fca0d041b739547f2&oe=56F0F6B6'
    },
    {
      image: 'https://scontent-mia1-1.xx.fbcdn.net/hphotos-xtf1/v/t1.0-9/12243248_976845205712070_8234193161510904182_n.jpg?oh=308cd8ae189b7f96d483cd4b9ecadea5&oe=56B88437'
    },
    {
      image: 'https://scontent-mia1-1.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/12019985_969015559828368_6298243536650081959_n.jpg?oh=1f6ed7a2396076c58abc664d70e954d0&oe=56AE3BF7'
    },
    {
      image: 'https://scontent-mia1-1.xx.fbcdn.net/hphotos-xtp1/v/t1.0-9/12243400_980460845350506_2500918501691579590_n.jpg?oh=bb3dd7101955073a3e58b7a0ba27f2cf&oe=56F04EA7'
    }];

  // $scope.addSlide = function() {
  //   var newWidth = 1000 + slides.length + 1;
  //   slides.push({
  //     image: '//placekitten.com/' + newWidth + '/500'
  //   });
  // };

  // for (var i=0; i<4; i++) {
  //   $scope.addSlide();
  // }
}]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
}]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

'use strict';

// Setting up route
angular.module('orders').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('orders', {
        abstract: true,
        url: '/checkout/review',
        template: '<ui-view/>'
      })
      .state('orders.review', {
        url: '',
        templateUrl: 'modules/orders/client/views/review-order.client.view.html'
      });
  }
]);

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
	$scope.cart_total = 0.00;
	$scope.shipping_price = 5.00;

	$scope.order_init = function(){
		var current_items = String($cookieStore.get('cart'));
      	if(current_items !== "undefined"){
        	$scope.cart_items = current_items.split('&');
        	$scope.filter();
      } 
	};

	$scope.filter = function() {
        //"562bc2f8b82bbbf8f91f72ba"
        var i = 0;
        for(i = 0; i < $scope.cart_items.length; i++){
            var product = $scope.findOne($scope.cart_items[i],$scope.found_one_cb);
        }
    };

    $scope.found_one_cb = function(data){
        var priceString = data.price;
        var price = parseFloat(priceString.split('$')[1]);
        $scope.cart_total += price;
        console.log(data._id);
        if($scope.quantity_dict[data._id] !== undefined){
            var current_quantity = $scope.quantity_dict[data._id];
            $scope.quantity_dict[data._id] = current_quantity + 1;
        } else {
            $scope.quantity_dict[data._id] = 1;
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
'use strict';

angular.module('products').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Products',
      state: 'products',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'All Items',
      state: 'products.list'
    });
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Women',
      state: 'products.list'
    });
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Men',
      state: 'products.list'
    });
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Kid',
      state: 'products.list'
    });
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Accessories',
      state: 'products.list'
    });
    Menus.addSubMenuItem('topbar', 'products', {
      title: 'Clearance',
      state: 'products.list'
    });
    // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'products', {
    //   title: 'Create Articles',
    //   state: 'articles.create',
    //   roles: ['user']
    // });
  }
]);

'use strict';

// Setting up route
angular.module('products').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('products', {
        abstract: true,
        url: '/products',
        template: '<ui-view/>'
      })
      .state('products.list', {
        url: '',
        templateUrl: 'modules/products/client/views/view-products.client.view.html'
      })
      .state('products.view', {
        url: '/:productId',
        templateUrl: 'modules/products/client/views/view-product-info.client.view.html',
      });
  }
]);

'use strict';

// Articles controller
angular.module('products').controller('CartController', ['$scope', '$rootScope','$stateParams', '$location', 'Authentication', 'Products', '$cookieStore',
  function ($scope, $rootScope,$stateParams, $location, Authentication, Products, $cookieStore) {
    $scope.authentication = Authentication;
    $scope.editing_index = -1;
    $scope.cart_items = []; //all the ids of the products in cart
    $scope.cart_total = 0.00;
    $scope.display_items = []; //the actual products with attributes
    $scope.cart_products = [];
    $scope.quantity_dict = {};

    $scope.getItems = function () {
      var current_items = String($cookieStore.get('cart'));
      if(current_items !== "undefined"){
        $scope.cart_items = current_items.split('&');
        $scope.filter();
      } 
    };

    $scope.filter = function() {
        //"562bc2f8b82bbbf8f91f72ba"
        var i = 0;
        for(i = 0; i < $scope.cart_items.length; i++){
            var product = $scope.findOne($scope.cart_items[i],$scope.found_one_cb);
        }
    };
    $scope.found_one_cb = function(data){
        var priceString = data.price;
        var price = parseFloat(priceString.split('$')[1]);
        $scope.cart_total += price;

        if($scope.quantity_dict[data._id] !== undefined){
            var current_quantity = $scope.quantity_dict[data._id];
            $scope.quantity_dict[data._id] = current_quantity + 1;
        } else {
            $scope.quantity_dict[data._id] = 1;
            $scope.display_items.push(data);
        }
    };

    $scope.parse_price = function(priceString) {
        return parseFloat(priceString.split('$')[1]);
    };

    $scope.findOne = function (_product_id,cb) {
      return Products.get({productId: _product_id},cb);
    };

    $scope.save_edit_cart = function(_id, updated_quantity, price){
        if(updated_quantity !== undefined){ //if no change in select then this occurs
            var current_quantity = $scope.quantity_dict[_id];
            if(current_quantity !== updated_quantity){
                $scope.quantity_dict[_id] = updated_quantity;
                if(updated_quantity < current_quantity){
                    var num_to_delete = current_quantity - updated_quantity;  
                    $scope.cart_items.sort(); //organize so we can easily splice
                    var index = $scope.cart_items.indexOf(_id);
                    $scope.cart_items.splice(index, num_to_delete);
                    $scope.cart_total -= num_to_delete * price;
                } else {
                    var num_to_add = updated_quantity - current_quantity;
                    for(var i = 0; i < num_to_add; i++){
                        $scope.cart_items.push(_id);
                    }
                    $scope.cart_total += num_to_add * price;
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

    $scope.quick_delete_cart = function(productId, quantity, index_to_delete){
        var num_to_delete = quantity;
        $scope.cart_items.sort(); //organize so we can easily splice
        for(var index = 0; index < $scope.cart_items.length; index++){
              if($scope.cart_items[index] === productId){
                    $scope.cart_items.splice(index, quantity); //delete all with this id
                    break; //no need to run 
              }
        }
        /**update total**/
        var deleted_product = $scope.display_items[index_to_delete];
        var deleted_price = quantity * parseFloat(deleted_product.price.split('$')[1]);
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
'use strict';

// Product View controller
angular.module('products').controller('ProductViewController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products',
  function ($scope, $stateParams, $location, Authentication, Products) {
    $scope.authentication = Authentication;
    $scope.this_product_id = $stateParams.productId;
    $scope.this_product = Products.get({ productId: $scope.this_product_id }, function() {
            console.log($scope.this_product);
        });
    $scope.admin = false;

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

    // Save changes
    $scope.saveChanges = function() {
      $scope.this_product.$update( function (response) {
        console.log("Saved changes");
        console.log($scope.this_product.name);
        console.log(response);

      }, function (errorResponse) {
        console.log("Error when trying to save changes!");
        console.log($scope.this_product.name);
        console.log(errorResponse);
      });
    };
  }
]);

'use strict';

// Articles controller
angular.module('products').controller('ProductsController', ['$scope', '$rootScope','$stateParams', '$state', 'Authentication', 'Products', '$cookieStore',
  function ($scope, $rootScope, $stateParams, $state, Authentication, Products, $cookieStore) {
    $scope.authentication = Authentication;
    $scope.success_add = false;
    $scope.products = [];

    $scope.init_product = function(){
      console.log("hi");
      $scope.products = Products.query();
      console.log($scope.products);
    };

    $scope.add_cart = function(_id, price){
        var prevCookie = "";
        prevCookie = $cookieStore.get('cart');
        var updatedCookie = _id;
        if(prevCookie !== undefined){
          $cookieStore.remove('cart');
          updatedCookie = prevCookie + "&" + _id;
        }
        $cookieStore.put('cart',updatedCookie);
        $rootScope.$broadcast('cart_update', { newCookie: updatedCookie, price: parseFloat(price.split('$')[1])});
        $state.go('cart');
    };

    $scope.create = function () {
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

      // Redirect after save
      product.$save(function (response) {
        console.log("saved");

      }, function (errorResponse) {
        console.log("errored");
      });
    };
  }
]);

'use strict';

angular.module('products').factory('Products', ['$resource',
  function ($resource) {
    return $resource('api/products/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
/*	 	Edit phone, email, name, etc. #104148896*/
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })

/* To make things easier manage addresses is not going to be attached to the rest this sprint. #104148896.
      .state('settings.address', {
        url: '/address',
        templateUrl: 'modules/users/client/views/settings/manage-addresses.client.view.html'
      })*/
	  
	  /*edit an address #104148896*/
      .state('settings.address', {
        url: '/address',
        templateUrl: 'modules/users/client/views/settings/edit-addresses.client.view.html'
      })
/*#104148896 edit password*/
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
	  
	  /*order-history, wish-list, downloads 106010170*/
      .state('settings.order-history', {
        url: '/order-history',
        templateUrl: 'modules/users/client/views/settings/order-history.client.view.html'
      })
	  
	  .state('settings.wish-list', {
        url: '/wish-list',
        templateUrl: 'modules/users/client/views/settings/wish-list.client.view.html'
      })
	  
	  .state('settings.downloads', {
        url: '/downloads',
        templateUrl: 'modules/users/client/views/settings/downloads.client.view.html'
      })
	  
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

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

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
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
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.unshift(function (password) {
          var result = PasswordValidator.getResult(password);
          var strengthIdx = 0;

          // Strength Meter - visual indicator for users
          var strengthMeter = [
            { color: 'danger', progress: '20' },
            { color: 'warning', progress: '40' },
            { color: 'info', progress: '60' },
            { color: 'primary', progress: '80' },
            { color: 'success', progress: '100' }
          ];
          var strengthMax = strengthMeter.length;

          if (result.errors.length < strengthMeter.length) {
            strengthIdx = strengthMeter.length - result.errors.length - 1;
          }

          scope.strengthColor = strengthMeter[strengthIdx].color;
          scope.strengthProgress = strengthMeter[strengthIdx].progress;

          if (result.errors.length) {
            scope.popoverMsg = PasswordValidator.getPopoverMsg();
            scope.passwordErrors = result.errors;
            modelCtrl.$setValidity('strength', false);
            return undefined;
          } else {
            scope.popoverMsg = '';
            modelCtrl.$setValidity('strength', true);
            return password;
          }
        });
      }
    };
}]);

'use strict';

angular.module('users')
  .directive('passwordVerify', function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, modelCtrl) {
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || modelCtrl.$viewValue) {
            combined = scope.passwordVerify + '_' + modelCtrl.$viewValue;
          }
          return combined;
        }, function(value) {
          if (value) {
            modelCtrl.$parsers.unshift(function(viewValue) {
              var origin = scope.passwordVerify;
              if (origin !== viewValue) {
                modelCtrl.$setValidity('passwordVerify', false);
                return undefined;
              } else {
                modelCtrl.$setValidity('passwordVerify', true);
                return viewValue;
              }
            });
          }
        });
     }
    };
});

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
