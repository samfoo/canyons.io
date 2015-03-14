var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get("/new", function(req, res) {
  res.render('canyons/form', {});
});

module.exports = router;
