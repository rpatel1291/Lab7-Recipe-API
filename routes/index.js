const recipeRoutes = require("./recipes");

const constructorMethod = (app) => {
    app.use("/recipes", recipeRoutes);
    
    app.use("*", (req, res) => {
        res.status(404).json({ error: "Route Does Not Exist" });
    })
};

module.exports = constructorMethod;
