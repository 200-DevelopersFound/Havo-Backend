const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authToken = require("../middleware");
const Category = require("../models/category");

router.post("/create/category", authToken, async (req, res, next) => {
  /*
  #swagger.tags = ['User Category']
  #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Create Category',
                required: true,
                schema: { categoryName : "INTRO"}
        }
   #swagger.responses[201] = {  schema: [
    {
        "_id": "61c8af95598a5a9b7a56ee92",
        "title": "INTRO",
        "dialogues": [],
        "__v": 1
    },
  ], description: 'User Cateories' }
  #swagger.responses[400] = {  schema: { error: "Bad Request" }, description: 'User not found' }
  #swagger.responses[500] = { schema: { error: "Error message" }, description: 'Error occured' }
*/
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({ error: "Category Name not provided" });
    }
    const user = await User.findOne({ _id: req.user.id }).populate(
      "categories"
    );

    if (user) {
      let category = await Category.create({ title: categoryName });

      await category.save();
      user.categories.push(category);
      await user.save();
      return res.status(201).json(user.categories);
    }
    return res.status(400).json({ error: "Bad Request" });
  } catch (error) {
    return next(error.message);
  }
});

router.post("/update/dialogue", authToken, async (req, res, next) => {
  /*
  #swagger.tags = ['User Category']
  #swagger.parameters['obj'] = {
    in: 'body',
    description: 'Update user dialogue',
    required: true,
    schema: {
      "categoryId" : "61c8af95598a5a9b7a56ee92",
      "dialogue" : "abcd"
    }
  }
  #swagger.responses[201] = {  schema: [
    {
        "_id": "61c8af95598a5a9b7a56ee92",
        "title": "INTRO",
        "dialogues": [
            "abcd"
        ],
        "__v": 1
    },
  ], description: 'User Cateories' }
  #swagger.responses[400] = {  schema: { error: "Bad Request" }, description: 'User not found' }
  #swagger.responses[500] = { schema: { error: "Error message" }, description: 'Error occured' }
*/
  try {
    const { categoryId, dialogue } = req.body;

    if (!categoryId) {
      return res.status(400).json({ error: "Category Id not provided" });
    }
    if (!dialogue) {
      return res.status(400).json({ error: "dialogue not provided" });
    }
    const user = await User.findOne({ _id: req.user.id }).populate(
      "categories"
    );
    if (user) {
      user.categories.forEach(async (category) => {
        if (category._id == categoryId) {
          category.dialogues.push(dialogue);
          await category.save();
        }
      });
      user.save();
      return res.status(201).json(user.categories);
    }
    return res.status(400).json({ error: "Bad Request" });
  } catch (error) {
    return next(error.message);
  }
});

module.exports = router;
