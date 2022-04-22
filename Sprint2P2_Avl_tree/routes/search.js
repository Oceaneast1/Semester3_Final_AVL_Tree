


const express = require("express");
const router = express.Router();

const app = express();

router.use(express.static("public"));

const dal = require("../services/search.dal");

router.get("/",  (req, res) => {
    console.log("inside the page of search input page")
    res.render("search.ejs");
})

router.get("/search", async (req, res) => {
    console.log("outside pg search stage 2");
    const queryStr = require("url").parse(req.url, true).query;
    let allArrayInputs = await dal.getAllArrayInputs(queryStr.search);
    if (allArrayInputs.length === 0) {
      console.log("Inside the inside stage 3");
      res.render("norecord.ejs");
    } else {
      res.render("search.ejs", { allArrayInputs });
    }
  });





module.exports = router;