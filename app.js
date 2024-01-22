const express = require("express");
const fs = require("fs");
let { middlewareVerification } = require("./utils");
const PORT = 3000;
const app = express();
app.use(express.static("./static"));
app.use(express.json());

app.get("/jokes", (req, res) => {
  fs.readFile("./db/jokes.json", (err, data) => {
    if (err) return res.status(500).send("error on the server");
    let jokes = JSON.parse(data.toString()).jokes;
    res.status(200).json(jokes);
  });
});

app.post("/jokes", middlewareVerification, (req, res) => {
  let { author, joke, likes } = req.body;
  fs.readFile("./db/jokes.json", (err, dataFile) => {
    if (err) return res.status(500).send("error on the server");
    let data = JSON.parse(dataFile.toString());
    let jokeToSave = {
      id: data.nextId,
      author,
      joke,
      likes,
    };
    data.jokes.push(jokeToSave);
    data.nextId++;
    fs.writeFile("./db/jokes.json", JSON.stringify(data, null, 4), (err) => {
      if (err) return res.status(500).send("error on the server");
      res.status(201).json(jokeToSave);
    });
  });
});

app.delete("/jokes/:id", (req, res) => {
  let id = req.params.id;
  fs.readFile("./db/jokes.json", (err, data) => {
    if (err) return res.status(500).send("error on the server");
    let dataFile = JSON.parse(data.toString());
    let jokes = dataFile.jokes;
    let jokeIndex = jokes.findIndex((ele) => ele.id == id);
    if (jokeIndex == -1) return res.status(404).send("joke not found");
    dataFile.jokes = jokes.filter((ele) => ele.id != id);
    fs.writeFile(
      "./db/jokes.json",
      JSON.stringify(dataFile, null, 4),
      (err) => {
        if (err) return res.status(500).send("error on the server");
        res.status(200).json("joke is deleted with success");
      }
    );
  });
});
// app.delete("/jokes/deleteall", (req, res) => {
//   fs.readFile("./db/jokes.json", (err, data) => {
//     if (err) return res.status(500).send("error on the server");
//     let dataFile = JSON.parse(data.toString());
//     let jokes = dataFile.jokes;
//     dataFile.jokes = [];
//     fs.writeFile(
//       "./db/jokes.json",
//       JSON.stringify(dataFile, null, 4),
//       (err) => {
//         if (err) return res.status(500).send("error on the server");
//         res.status(200).json("jokes are deleted with success");
//       }
//     );
//   });
// });

app.put("/jokes/:id", middlewareVerification, (req, res) => {
  let id = req.params.id;
  fs.readFile("./db/jokes.json", (err, data) => {
    if (err) return res.status(500).send("error on the server");
    let dataFile = JSON.parse(data.toString());
    let jokes = dataFile.jokes;
    let jokeData = jokes.find((ele) => ele.id == id);

    if (!jokeData) return res.status(404).send("joke not found");
    let { author, joke, likes } = req.body;
    jokeData.author = author;
    jokeData.joke = joke;
    jokeData.likes = likes;
    fs.writeFile(
      "./db/jokes.json",
      JSON.stringify(dataFile, null, 4),
      (err) => {
        if (err) return res.status(500).send("error on the server");
        res.status(200).json(jokeData);
      }
    );
  });
});

app.listen(PORT, () => console.log("server started at ", PORT));
