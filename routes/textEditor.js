//var recipes = require('../data/recipeData.js');
var express = require('express');
var router = express.Router();
var sys = require('sys');
var exec = require('child_process').exec;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('textEditor', {title: 'test'});
  res.send('{"OK":true}');
});

module.exports = router;
