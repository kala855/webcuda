var resourceful = require('resourceful');

var File = module.exports = resourceful.define('file', function () {

  this.string('name');
  this.string('category');

  this.timestamps();

});
