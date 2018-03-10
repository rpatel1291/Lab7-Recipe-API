const express = require("express");
const router = express.Router();
const data = require("../data");
const recipeData = data.recipes;


router.get("/", async (req, res) => {
    try {
        const recipeList = await recipeData.getAllRecipeNames();        
        res.json(recipeList);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const recipe = await recipeData.getRecipeById(req.params.id);
        res.status(200).json(recipe);
    }
    catch (e) {
        res.status(404).json({ error: e });
    }
});
router.post("/", async (req, res) => {
    const recipe = req.body;
    try {
        const { title, ingredients, steps } = recipe;
        const newRecipe = await recipeData.addRecipe(title, ingredients, steps);
        res.status(200).json(newRecipe);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        await recipeData.getRecipeById(req.params.id);
        res.status(200);
    } catch (e) {
        res.status(404).json({ error: e });
    }
    try {
        await recipeData.removeRecipe(req.params.id);
        res.status(200).json({ result: "Receipe Deleted" });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});
router.put("/:id", async (req, res) =>{
    const recipe = req.body;
    try {
        await recipeData.getRecipeById(req.params.id);
        res.status(200);
    } catch (e) {
        res.status(404).json({ error: e });
    }
    try {
        const updateRecipe = await recipeData.updateWholeRecipeById(req.params.id, recipe);
        res.status(200).json(updateRecipe);
    } catch (e) {
        res.status(404).json({ error: e });
    }
});
router.patch("/:id", async (req, res) => {
    const recipe = req.body;
    try {
        await recipeData.getRecipeById(req.params.id);
        res.status(200);
    }
    catch (e) {
        res.status(404).json({ error: e });
    }
    try {
        const updateRecipe = await recipeData.updateRecipeById(req.params.id, recipe);
        res.status(200).json(updateRecipe);

    } catch (e) {
        res.json(404).json({ error: e });
    }
});
module.exports = router;