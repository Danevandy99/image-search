'use strict';

var Users = require('../models/users.js');
var Bing = require('node-bing-api')({
	accKey: "T0uVqd6NrcUlHy3+gXp3MTIbYdsy5AaRGh0JzBjde88"
});
var url = require('url');
var Search = require('../models/search');

function ClickHandler() {

	this.search = function(req, res) {
		var url_parts = url.parse(req.url, true);
		var query = url_parts.query;
		if (query.offset != undefined) {
			console.log(query);
			Bing.images(query.search_string, {
				skip: query.offset
			}, function(error, response, body) {
				var newSearch = new Search();
				newSearch.term = query.search_string;
				newSearch.when = new Date();
				newSearch.save(function(err) {
					if (err) {
						throw err;
					}
				});
				res.json(body);
			});
		} else {
			res.json('Please include offset and search string.');
		}

	}

	this.getSearches = function(req, res) {
		Search.find({}, {
			'_id': false,
			'__v': false
		}).sort('-when').limit(10).exec(function(err, searches) {
			if (err) {
				throw err;
			}
			res.json(searches);
		})
	}

}

module.exports = ClickHandler;
