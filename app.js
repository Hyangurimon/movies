const express = require("express");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());
const port = 3000;

let data = [{ id: 1 }, { id: 2 }, { id: 3 }];

mongoose.connect("mongodb://localhost:27017/test");

const movieSchema = new mongoose.Schema({
  title: String,
  year: String,
  director: String,
});

const Movie = mongoose.model("Movie", movieSchema);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Movie Lover!");
});

app.get("/movies", async (req, res) => {
  const moviesList = await Movie.find().select("title");
  res.send(moviesList);
});

app.post("/movies", async (req, res) => {
  if (!req.body?.title) {
    console.error("Title needed");
    res.status(400).send("Error: please enter a title");
    return;
  }
  const enteredMovieData = req.body.title;
  // fetch("http://www.omdbapi.com/?apikey=f4b55d3e&t=" + mData)
  //   .then((response) => response.json())
  //   .then((json) => {
  //     console.log(json);
  //   });
  let foundMovie = await Movie.findOne({ title: enteredMovieData }).exec();
  if (foundMovie !== null) {
    res.status(400).send("Error: Movie already exists");
    return;
  }

  const response = await fetch(
    "http://www.omdbapi.com/?apikey=f4b55d3e&t=" + enteredMovieData
  );
  const json = await response.json();
  const newMovie = new Movie({
    title: json.Title,
    year: json.Year,
    director: json.Director,
  });
  await newMovie.save();

  // const newMovie = new Movie({ title: req.body.title });
  // await newMovie.save();

  const moviesList = await Movie.find();
  res.send(moviesList);
});

app.get("/movies/:title", async (req, res) => {
  let movie = await Movie.findOne({ title: req.params.title }).exec();

  res.send(movie);
});

app.delete("/movies/:title", async (req, res) => {
  await Movie.deleteOne({ title: req.params.title });

  const moviesList = await Movie.find();
  res.send(moviesList);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
