
function reqAdmin(req, res, next) {
  if (req.isAuthenticated()){
    req.user.isAdmin(function(ans){
      if (ans)
        return next();
      else {
        req.flash('message', 'Permission denied');
        res.redirect('/');
      }
    });
  } else {
    req.flash('message', 'Please sign in.');
    res.redirect('/');
  }
}


function reqAdminAPI(req, res, next) {
  if (req.isAuthenticated()){
    req.user.isAdmin(function(ans){
      if (ans)
        return next();
      return  res.json(401 , { ok : false, error : 'Permission denied'});
    });
  } else {
    res.json(401 , { ok : false, error : 'Please sign in.'});
  }
}

module.exports = {

  isLoggedIn : function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('message', 'Please sign in.');
      res.redirect('/');
    }
  },

  isLoggedInAPI : function(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.json(401, {ok : false, error : 'Permission denied'});
  },


  isAdmin : function (req, res, next) {
    return reqAdmin(req, res, next);
  },

  isAdminAPI : function (req, res, next) {
    return reqAdminAPI(req, res, next);
  }

};
