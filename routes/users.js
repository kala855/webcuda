var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/signin', function(req, res) {
  res.render('signin');
  res.send('respond with a resource');
});

module.exports = router;
