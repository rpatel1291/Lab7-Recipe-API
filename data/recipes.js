const mongoCollection = require("../config/mongoCollections");
const recipes = mongoCollection.recipes;
const uuid = require("node-uuid");

const exportedMethods = {
    async getAllRecipes() {
        const recipeCollection = await recipes();
        return await recipeCollection.find({}, {title: 1}).toArray();
    },
    async getAllRecipeNames() {
        const recipeList = await this.getAllRecipes();
        recipeInfo = [];
        recipeList.forEach(recipe => {
            let content = {
                _id: recipe._id,
                title: recipe.title
            };
            recipeInfo.push(content);
        });
        return recipeInfo;
    },
    async getRecipeById(id) {
        const recipeCollection = await recipes();
        const selectedRecipe = await recipeCollection.findOne({ _id: id });
        if (!selectedRecipe) throw "No Recipe with ID:" + id + " found";
        return selectedRecipe;
    },
    async addRecipe(title, ingredients, steps) {        
        if (typeof title !== "string" || title === "") throw "Title is missing";
        if (!Array.isArray(ingredients) || ingredients.length === 0) throw "No Ingredients listed";

        ingredients.forEach((ingredient) => {
            if (typeof ingredient.name !== "string" || ingredient.name === "") throw "Ingredient name is not string";
            if (typeof ingredient.amount !== "string" || ingredient.amount === "") throw "Ingredient amount is not stated";
        });

        if (!Array.isArray(steps) || steps.length === 0) throw "Recipe Steps are not listed";
        steps.forEach(step => {
            if (typeof step !== "string" || step === "") throw "Recipe Step needs to be listed";
        });

        const recipeCollection = await recipes();

        const newRecipe = {
            _id: uuid.v4(),
            title: title,
            ingredients: ingredients,
            steps: steps
        };

        const newRecipeInfo = await recipeCollection.insertOne(newRecipe);
        const newId = newRecipeInfo.insertedId;
        return await this.getRecipeById(newId);
    },
    async updateRecipeById(id, updateRecipe) {
        const recipeCollection = await recipes();
        const updatedRecipeData = {};

        if (updateRecipe.title) { }
        if (updateRecipe.ingredients) { }
        if (updateRecipe.steps) { }


    },
    async removeRecipe(id) {
        const recipeCollection = await recipes();
        const deletionInfo = await recipeCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0) throw "Could not delete Recipe";
    }

};

module.exports = exportedMethods;
