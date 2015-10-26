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
