require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const Thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const American = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const Chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = { latest, Thai, American, Chinese };
    res.render("index", { title: "Homepage", categories, food });
  } catch (error) {
    console.log(error);

    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", { title: "Cooking-Blog- Categories", categories });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    res.render("recipe", { title: "Cooking-Blog-Recipe", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Cooking Blog - Categoreis",
      categoryById,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });

    res.render("search", { title: "Cooking-blogs-Search", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", { title: "Explore-Latests-Recipes", latest });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    const random = await Recipe.aggregate([{ $sample: { size: count } }]);
    res.render("Random", { title: "Showing-Random-Recipes", random });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};
exports.submitRecipe = async (req, res) => {
  try {
    const infoErrorsObj = req.flash("infoErrors");
    const infoSubmitObjs = req.flash("InfoSubmit");
    

    res.render("submit-recipe", {
      titile: "Submit Recipe",
      infoErrorsObj,
      infoSubmitObjs,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};
exports.submitRecipeOnPost = async(req, res) => {
  try {

    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingridients: req.body.ingridients,
      category: req.body.Category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
};
 
// async function insertDummyCategoryData(){
//     try {
//         await Category.insertMany(
//             [
//                 {
//                     name:"Thai",
//                     image:"thai-food.jpg",
//                 },
//                 {
//                     name:"American",
//                     image:"american-food.jpg",
//                 },
//                 {
//                     name:"Chinese",
//                     image:"chinese-food.jpg",
//                 },
//                 {
//                     name:"Mexican",
//                     image:"mexican-food.jpg",
//                 },
//                 {
//                     name:"Indian",
//                     image:"indian-food.jpg",
//                 },
//                 {
//                     name:"Spanish",
//                     image:"spanish-food.jpg",
//                 },
//             ]
//         )
//     } catch (error) {
//         console.log('err'+error);

//     }
// }
// insertDummyCategoryData()

// async function insertDymmyRecipeData(){
//       try {
//         await Recipe.insertMany([
//           {
//             "name": "Chinese-steak-tofu-stew",
//             "description": `**Southern Fried Chicken:**
//             Southern Fried Chicken is a classic Southern dish renowned for its crispy coating and juicy interior. Chicken pieces are marinated in buttermilk, then coated in a seasoned flour mixture, which typically includes paprika, garlic powder, and cayenne for a hint of spice. The coated chicken is fried until golden brown and crispy, creating a delicious contrast in texture. Served hot, this comfort food pairs perfectly with Southern sides like mashed potatoes, coleslaw, and biscuits. Its popularity extends far beyond the Southern United States, making it a beloved dish worldwide. Perfectly balanced flavors and a satisfying crunch define this iconic comfort food. Enjoyed for its simplicity and deliciousness, Southern Fried Chicken remains a timeless culinary favorite.`,
//             "email": "recipeemail@raddy.co.uk",
//             "ingridients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika",
//             ],
//             "category": "American",
//             "image": "chinese-steak-tofu-stew.jpg"
//           },

//           {
//             "name": "Crab Cakes",
//             "description": `**Southern Fried Chicken:**
//             Southern Fried Chicken is a classic Southern dish renowned for its crispy coating and juicy interior. Chicken pieces are marinated in buttermilk, then coated in a seasoned flour mixture, which typically includes paprika, garlic powder, and cayenne for a hint of spice. The coated chicken is fried until golden brown and crispy, creating a delicious contrast in texture. Served hot, this comfort food pairs perfectly with Southern sides like mashed potatoes, coleslaw, and biscuits. Its popularity extends far beyond the Southern United States, making it a beloved dish worldwide. Perfectly balanced flavors and a satisfying crunch define this iconic comfort food. Enjoyed for its simplicity and deliciousness, Southern Fried Chicken remains a timeless culinary favorite.`,
//             "email": "recipeemail@raddy.co.uk",
//             "ingridients": [
//               "1 level teaspoon baking powder",
//               "1 level teaspoon cayenne pepper",
//               "1 level teaspoon hot smoked paprika",
//             ],
//             "category": "American",
//             "image": "crab-cakes.jpg"
//           },

//         ]);
//       } catch (error) {
//         console.log('err', + error)
//       }
//     }

//     insertDymmyRecipeData();
