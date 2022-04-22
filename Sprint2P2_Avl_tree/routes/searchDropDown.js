const express = require("express");
const router = express.Router();


const app = express();

router.use(express.static("public"));

const dal = require("../services/search.dal");

router.get("/",  (req, res) => {
    console.log("inside the page of searchDropDown")
    res.render("searchDropDown.ejs");
});



module.exports = router;
