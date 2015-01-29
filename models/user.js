var resourceful = require('resourceful');

var User = module.exports = resourceful.define('user', function () {
  this.string('email').format('email');
  this.string('password');
  this.string('code');
  this.bool('activated', {default : false});
  this.string('role', {default : 'user'});
  this.string('name');

  this.timestamps();


  this.prototype.isActivated = function() {
    return this.activated;
  }

  this.prototype.isAdmin = function(callback) {
    if(this.role === 'Admin'){
      return callback(true);
    }
    return callback(false);
  }

});
