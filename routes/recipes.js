var recipes = require('../data/recipeData.js');

exports.list = function (req, res){
  var kind = req.params.id;

  res.render('recipes',{
    recipes: {
      list: recipes[kind],
      kind: recipes.recipeTypeName[kind]
    }
  });

}
