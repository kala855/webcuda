var resourceful = require('resourceful');

var Code = module.exports = resourceful.define('code', function () {
  //this.parent('User');
  this.string('name');
  this.string('path');

  this.timestamps();

});
