/// <reference path="//Microsoft.WinJS.2.0/js/base.js" />
/*jshint eqeqeq:false */
// WinJS.Class.define: http://msdn.microsoft.com/en-us/library/windows/apps/br229813.aspx

(function (global) {
	'use strict';

	var Store = WinJS.Class.define(
			/**
			 * Creates a new client side storage object and will create an empty
			 * collection if no collection already exists.
			 *
			 * @param {string} name The name of our DB we want to use
			 * real life you probably would be making AJAX calls
			 */
			function Store(name) {
				this._dbName = name;

				if (!localStorage[name]) {
					var data = {
						todos: []
					};

					localStorage[name] = JSON.stringify(data);
				}
			},
			{
				/**
				 * Finds items based on a query given as a JS object
				 *
				 * @param {object} query The query to match against (i.e. {foo: 'bar'})
				 * @param {function} callback	 The callback to fire when the query has
				 * completed running
				 *
				 * @example
				 * db.find({foo: 'bar', hello: 'world'}, function (data) {
				 *	 // data will return any items that have foo: bar and
				 *	 // hello: world in their properties
				 * });
				 */
				find: function (query) {
					var that = this;
					return new WinJS.Promise(function(completeHandler) {
						var todos = JSON.parse(localStorage[that._dbName]).todos;

						completeHandler(todos.filter(function (todo) {
							for (var q in query) {
								if (query[q] !== todo[q]) {
									return false;
								}
							}
							return true;
						}));
					});
				},

				/**
				 * Will retrieve all data from the collection
				 *
				 * @param {function} callback The callback to fire upon retrieving data
				 */
				findAll: function () {
					var that = this;
					return new WinJS.Promise(function (completeHandler) {
						completeHandler(JSON.parse(localStorage[that._dbName]).todos);
					});
					
				},

				/**
				 * Will save the given data to the DB. If no item exists it will create a new
				 * item, otherwise it'll simply update an existing item's properties
				 *
				 * @param {object} updateData The data to save back into the DB
				 * @param {number} id An optional param to enter an ID of an item to update
				 */
				save: function (updateData, id) {
					var that = this;

					return new WinJS.Promise(function (completeHandler) {
						var data = JSON.parse(localStorage[that._dbName]);
						var todos = data.todos;

						// If an ID was actually given, find the item and update each property
						if (id) {
							for (var i = 0; i < todos.length; i++) {
								if (todos[i].id === id) {
									for (var key in updateData) {
										todos[i][key] = updateData[key];
									}
									break;
								}
							}


							localStorage[that._dbName] = JSON.stringify(data);
							completeHandler(JSON.parse(localStorage[that._dbName]).todos);
						} else {
							// Generate an ID
							updateData.id = new Date().getTime();


							todos.push(updateData);
							localStorage[that._dbName] = JSON.stringify(data);
							completeHandler([updateData]);
						}
					});

				},

				/**
				 * Will remove an item from the Store based on its ID
				 *
				 * @param {number} id The ID of the item you want to remove
				 * @param {function} callback The callback to fire after saving
				 */
				remove: function (id, callback) {
					var that = this;

					return new WinJS.Promise(function (completeHandler) {
						var data = JSON.parse(localStorage[that._dbName]);
						var todos = data.todos;

						for (var i = 0; i < todos.length; i++) {
							if (todos[i].id == id) {
								todos.splice(i, 1);
								break;
							}
						}

						localStorage[that._dbName] = JSON.stringify(data);
						completeHandler(JSON.parse(localStorage[that._dbName]).todos);
					});
				},

				/**
				 * Will drop all storage and start fresh
				 *
				 * @param {function} callback The callback to fire after dropping the data
				 */
				drop: function (callback) {
					var that = this;

					return new WinJS.Promise(function (completeHandler) {
						localStorage[that._dbName] = JSON.stringify({ todos: [] });
						completeHandler(JSON.parse(localStorage[that._dbName]).todos);
					});
				}
			}
	);

	// Export to global scope
	global.app = global.app || {};
	global.app.Store = Store;

})(this);

