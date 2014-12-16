var resourceful = require('resourceful');

var User = module.exports = resourceful.define('user', function () {
  this.string('email').format('email');
  this.string('password');
  this.string('activated', {default : 'pending'});
  this.string('code');
  this.string('role', {default : 'user'});
  this.string('name');

  this.timestamps();

  this.prototype.hasRole = function (role, callback) {
    var cur_roles = this.role;
    if (this.role.indexOf(role) > -1)
      return callback(true);
    return callback(false);
  };

  this.prototype.isActivated = function() {
    return this.activated === 'activated';
  }

});
