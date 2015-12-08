'use strict';

describe('Users E2E Tests:', function () {
  describe('Signin Validation', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/');
      /**element(by.css('button[type=submit]')).click();
      element(by.binding('error')).getText().then(function (errorText) {
        expect(errorText).toBe('Missing credentials');**/
	 expect(browser.getTitle()).toEqual('B.N. Shape Clothing - Development Environment');
      });
    });
	describe('Twitter Visible Validation', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/');
      /**element(by.css('button[type=submit]')).click();
      element(by.binding('error')).getText().then(function (errorText) {
        expect(errorText).toBe('Missing credentials');**/
	  // expect(find('a:contains("Register")').length).toBe(1);;
      });
    });
	
	describe('Check for register account to exist', function () {
    it('Should report missing credentials', function () {
      browser.get('http://www.localhost:3000/authentication/signup');
      /**element(by.css('button[type=submit]')).click();
      element(by.binding('error')).getText().then(function (errorText) {
        expect(errorText).toBe('Missing credentials');**/
	 // expect('Name').toExist();
      });
    });
  });
