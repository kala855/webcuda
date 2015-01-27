var resourceful = require('resourceful');

var Code = module.exports = resourceful.define('code', function () {
  this.string('name');
  this.string('path');
  this.parent('user');

  this.timestamps();

});
