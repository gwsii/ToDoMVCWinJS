﻿(function (global) {
	'use strict';

	var Model = WinJS.Class.define(
			/**
		 * Creates a new Model instance and hooks up the storage.
		 *
		 * @constructor
		 * @param {object} storage A reference to the client side storage class
		 */
		function Model(storage) {
			this.storage = storage;
		},
		{
			/**
			 * Creates a new todo model
			 *
			 * @param {string} [title] The title of the task
			 */
			create: function (title) {
				var that = this;
				title = title || '';

				return new WinJS.Promise(function (complete) {
					var newItem = {
						title: title.trim(),
						completed: false
					};

					that.storage.save(newItem).then(complete);
				});
			},


			/**
			 * Finds and returns a model in storage. If no query is given it'll simply
			 * return everything. If you pass in a string or number it'll look that up as
			 * the ID of the model to find. Lastly, you can pass it an object to match
			 * against.
			 *
			 * @param {string|number|object} [query] A query to match models against
			 *
			 * @example
			 * model.read(1, func); // Will find the model with an ID of 1
			 * model.read('1'); // Same as above
			 * //Below will find a model with foo equalling bar and hello equalling world.
			 * model.read({ foo: 'bar', hello: 'world' });
			 */
			read: function (query) {
				var that = this;
				return new WinJS.Promise(function (complete) {
					var queryType = typeof query;

					if (queryType === 'undefined') {
						return that.storage.findAll().then(complete);
					} else if (queryType === 'string' || queryType === 'number') {
						query = parseInt(query, 10);
						that.storage.find({ id: query }).then(complete);
					} else {
						that.storage.find(query).then(complete);
					}
				});
			},


			/**
			 * Updates a model by giving it an ID, data to update, and a callback to fire when
			 * the update is complete.
			 *
			 * @param {number} id The id of the model to update
			 * @param {object} data The properties to update and their new value
			 */
			update: function (id, data) {
				var that = this;

				return new WinJS.Promise(function (complete) {
					that.storage.save(data, id).then(complete);
				});
			},


			/**
			 * Removes a model from storage
			 *
			 * @param {number} id The ID of the model to remove
			 */
			remove: function (id) {
				var that = this;

				return new WinJS.Promise(function (complete) {
					that.storage.remove(id).then(complete);
				});
			},


			/**
			 * WARNING: Will remove ALL data from storage.
			 */
			removeAll: function () {
				var that = this;

				return new WinJS.Promise(function (complete) {
					that.storage.drop().then(complete);
				});
			},


			/**
			 * Returns a count of all todos
			 */
			getCount: function () {
				var that = this;

				return new WinJS.Promise(function (complete) {
					var todos = {
						active: 0,
						completed: 0,
						total: 0
					};

					that.storage.findAll(function (data) {
						data.forEach(function (todo) {
							if (todo.completed) {
								todos.completed++;
							} else {
								todos.active++;
							}


							todos.total++;
						});
						callback(todos);
					});
				});

			}
		}
	);

	// Export to global scope
	global.app = global.app || {};
	global.app.Model = Model;
})(this);
