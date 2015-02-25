var resourceful = require('resourceful');

var Bug = module.exports = resourceful.define('bug', function () {

  this.string('type');
  this.string('desc');
  this.string('notes');
  this.string('reporter');
  this.bool('solved', {default : false});

  this.timestamps();

});
