
function reqAdmin(req, res, next) {
  if (req.isAuthenticated()){
    req.user.isAdmin(function(ans){
      if (ans)
        return next();
      else {
        req.flash('message', 'No tiene permisos para esta operación');
        res.redirect('/');
      }
    })
  } else {
    req.flash('message', 'No ha iniciado sesión.');
    res.redirect('/');
  }
}


function reqAdminAPI(req, res, next) {
  if (req.isAuthenticated()){
    req.user.hasRole(function(ans){
      if (ans)
        return next();
      return  res.json(401 , { ok : false, error : 'No tiene permisos para esta operación'});
    });
  } else {
    res.json(401 , { ok : false, error : 'No ha iniciado sesión'});
  }
}

module.exports = {

  isLoggedIn : function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('message', 'No ha iniciado sesión.');
      res.redirect('/');
    }
  },

  isLoggedInAPI : function(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.json(401, {ok : false, error : 'Necesita permisos para esta operación'});
  },


  isAdmin : function (req, res, next) {
    return reqAdmin('admin', req, res, next);
  },

  isAdminAPI : function (req, res, next) {
    return reqAdminAPI('admin', req, res, next);
  }

};
