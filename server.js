const express = require("express");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.Port || 7000;
const dbURL = "mongodb://localhost:27017/moongoose";
const mustacheExpress = require("mustache-express");

app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

var Doll = require("./models/Doll");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(dbURL).then(function(err, db) {
  if (err) {
    console.log("error");
  } else console.log("Connected to MONGOOSE DB");
});

app.get("/", function(req, res) {
  res.render("index");
});

app.post("/doll", (req, res) => {
  let dollData = req.body;

  let newDoll = new Doll({
    hair: {
      color: dollData.haircolor,
      texture: dollData.hairtexture
    },
    cost: dollData.cost,
    owner: dollData.owner
  });
  //   res.send(newDoll);
  newDoll.save().then(savedDoll => {
    res.redirect("/");
  });
});

app.get("/dolls", (req, res) => {
  Doll.find()
    .then(function(foundDolls) {
      res.render("dolls", { dolls: foundDolls });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});
app.post("/delete/:id", (req, res) => {
  Doll.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect("/dolls");
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.post("/redo/:id", function(req, res) {
  Doll.findOne({ _id: req.params.id })
    .then(foundDoll => {
      res.render("update", { update: foundDoll });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.post("/update/:id", (req, res) => {
  Doll.updateOne(
    { _id: req.params.id },
    {
      hair: {
        color: req.body.haircolor,
        texture: req.body.hairtexture
      },
      cost: req.body.cost,
      owner: req.body.owner
    }
  )
    .then(() => {
      res.redirect("/dolls");
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.listen(port, function() {
  console.log(`Server is running on port ${port}.`);
});
