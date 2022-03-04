const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const { pronounce } = require("node-pronounce");
var dutchRandomWord = [];

router.get("/", function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");
  res.header("X-Content-Type-Options", "nosniff");
  res.header("Strict-Transport-Security", "max-age=63072000");
  res.setHeader("Content-Type", "application/json");

  axios({
    method: "GET",
    url: "https://www.generatormix.com/random-dutch-words-generator",
  })
    .then(function (response) {
      $ = cheerio.load(response.data);

      if (dutchRandomWord.length > 0) {
        dutchRandomWord = [];
      }
      let post = $("#output > div");
      let word = post.find("div:nth-child(1) > h3")[0].children[0].data;
      let definition = post
        .find("div:nth-child(1) > span")[0]
        .children[0].data.replace("Meaning: ", "");
      let pronunciation = pronounce(word);
      dutchRandomWord.push({
        word: decodeURI(word.charAt(0).toUpperCase() + word.slice(1)),
        definition: decodeURI(
          definition.charAt(0).toUpperCase() + definition.slice(1)
        ),
        pronunciation: decodeURI(
          pronunciation.charAt(0).toUpperCase() + pronunciation.slice(1)
        ),
      });
      res.send(JSON.stringify(dutchRandomWord, null, 2));
    })
    .catch(function (error) {
      if (!error.response) {
        console.log("API URL is Missing");
        res.json("API URL is Missing");
      } else {
        console.log("Something Went Wrong - Enter the Correct API URL");
        res.json("Something Went Wrong - Enter the Correct API URL");
      }
    });
});

module.exports = router;