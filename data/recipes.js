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
    //Put
    async updateWholeRecipeById(id, updateRecipe) {
        const recipeCollection = await recipes();
        const updateRecipeData = {};

        if (updateRecipe.title && updateRecipe.ingredients && updateRecipe.steps) {

            if (typeof updateRecipe.title !== "string" || updateRecipe.title === "") throw "Recipe title not provided";

            updateRecipeData.title = updateRecipe.title;

            if (!Array.isArray(updateRecipe.steps) || updateRecipe.steps.length === 0) throw "Steps must be provided";
            updateRecipe.steps.forEach(step => {
                if (typeof step !== "string" || step === "") throw "Step is missing";
            })
            updateRecipeData.steps = updateRecipe.steps;

            if (!Array.isArray(updateRecipe.ingredients) || updateRecipe.ingredients.length === 0) throw "Recipe ingredients not provided";
            updateRecipe.ingredients.forEach(ingredient => {
                if (typeof ingredient.name !== "string" || ingredient.name === "") throw "Recipe name is not provided";
                if (typeof ingredient.amount !== "string" || ingredient.amount === "") throw "Recipe amount is not provided";
            })

            updateRecipeData.ingredients = updateRecipe.ingredients;

            let updateCommand = {
                $set: updateRecipeData
            };
            let query = {
                _id: id
            };

            await recipeCollection.updateOne(query, updateCommand);
            return await this.getRecipeById(id);

        }
        else throw "Recipe's title, ingredients, and steps are not changed";

    },
    //Patch
    async updateRecipeById(id, updateRecipe) {
        const recipeCollection = await recipes();

        const updateRecipeData = {};


        if (updateRecipe.steps) {
            if (!Array.isArray(updateRecipe.steps) || updateRecipe.steps.length === 0) throw "Steps must be provided";
            updateRecipe.steps.forEach(step => {
                if (typeof step !== "string" || step === "") throw "Step is missing";
            })

            updateRecipeData.steps = updateRecipe.steps;
        }

        if (updateRecipe.title) {
            if (typeof updateRecipe.title !== "string" || updateRecipe.title === "") throw "Recipe title not provided";

            updateRecipeData.title = updateRecipe.title;
        }

        if (updateRecipe.ingredients) {
            if (!Array.isArray(updateRecipe.ingredients) || updateRecipe.ingredients.length === 0) throw "Recipe ingredients not provided";
            updateRecipe.ingredients.forEach(ingredient => {
                if (typeof ingredient.name !== "string" || ingredient.name === "") throw "Ingredient Name is not provided";
                if (typeof ingredient.amount !== "string" || ingredient.amount === "") throw "Ingredient Amount is not provided";                
            })
            updateRecipeData.ingredients = updateRecipe.ingredients;
        }

        let updateCommand = {
            $set: updateRecipeData
        };
        let query = {
            _id: id
        };
        await recipeCollection.updateOne(query, updateCommand);
        return await this.getRecipeById(id);

    },
    async removeRecipe(id) {
        const recipeCollection = await recipes();
        const deletionInfo = await recipeCollection.removeOne({ _id: id });

        if (deletionInfo.deletedCount === 0) throw "Could not delete Recipe";
    }

};

module.exports = exportedMethods;
