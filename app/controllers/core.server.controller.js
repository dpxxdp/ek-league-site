'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
errorHandler = require('./errors.server.controller'),
Settings = mongoose.model('Setting');



exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

/*
var initSettings = function() {
	console.log("initializing settings");
	var banner = new Settings({
		name:"bannerScroll",
		value:"Welcome to EKombat"
	});

	banner.save();
};
*/

exports.changeSettings = function(req, res) {
	console.log(JSON.stringify(req.query));

	if(req.query.settingName && req.query.settingValue) //single setting
	{
		var settingName = req.query.settingName;
		var settingValue = req.query.settingValue;

		Settings.update(
			{name: settingName},
			{$set: {value: settingValue}},
			{},
			function(err, rowsAffected) {
				console.log('updated '+rowsAffected);
			});

		Settings.findOne({name: settingName}).exec(function(err,setting){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				//console.log("sending setting " + JSON.stringify(setting));
				res.json(setting);
			}
		});
	}
	else
	{
		//else return all settings, not implemented
		res.json({});
	}

};

exports.getSettings = function(req, res) {

	if(req.query.settingName) //single setting
	{
		var settingName = req.query.settingName;

		Settings.findOne({name: settingName}).exec(function(err,setting){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				//console.log("sending setting " + JSON.stringify(setting));
				res.json(setting);
			}
		});
	}
	else
	{
		//else return all settings, not implemented
		res.json({});
	}
};
