'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Products',
      state: 'articles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'All Items',
      state: 'articles.list'
    });

    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Women',
      state: 'articles.list'
    });

    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Men',
      state: 'articles.list'
    });

    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Kid',
      state: 'articles.list'
    });

    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Accessories',
      state: 'articles.list'
    });
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Clearance',
      state: 'articles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Create Articles',
      state: 'articles.create',
      roles: ['user']
    });
  }
]);
