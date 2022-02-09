const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const jsonParser = bodyParser.json();

const raw_recipe_data = fs.readFileSync("data.json");
let recipe_data = JSON.parse(raw_recipe_data);
let recipe_array = recipe_data.recipes;

recipe_names = [];
for (const index in recipe_array) {
    recipe_names.push(recipe_array[index].name);
}

app.get("/recipes", (req, res) => {
    res.status(200).send({"recipeNames" : recipe_names});
});

app.get("/recipes/details/*", (req, res) => {
    const req_recipe = req.params[0];
    if(recipe_names.includes(req_recipe)) {
        for (const index in recipe_array) {
            if(recipe_array[index].name == req_recipe) {
                res.status(200).send({"details" : {"ingredients": recipe_array[index].ingredients, "numSteps": recipe_array[index].instructions.length}});
            }
        }
    } else {
        res.status(200).send({"error": "Recipe does not exist"})
    }
});

app.post("/recipes", jsonParser, (req, res) => {
    if(req.body.name == undefined || req.body.ingredients == undefined || req.body.instructions == undefined) {
        res.status(400).send({"error": "One or more required fields are absent"})
    } else {
        if(recipe_names.includes(req.body.name)) {
            res.status(400).send({"error": "Recipe already exists"});
        } else {
            recipe_array.push(req.body);
            recipe_names.push(req.body.name);
            res.status(200).send({});
        }
    }
});

app.put("/recipes", jsonParser, (req, res) => {
    if(req.body.name == undefined || req.body.ingredients == undefined || req.body.instructions == undefined) {
        res.status(400).send({"error": "One or more required fields are absent"})
    } else {
        if(recipe_names.includes(req.body.name)) {
            for (const index in recipe_array) {
                if(recipe_array[index].name == req.body.name) {
                    recipe_array.splice(index, 1);
                    recipe_array.push(req.body)
                    res.status(204).send()
                }
            }
        } else {
            res.status(404).send({"error": "Recipe does not exist"})
        }
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
});