if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./services/postgres_db");
const treeify = require("treeify")

app.set("view engine", "ejs");
app.use(cors())
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;


const bcrypt = require("bcrypt");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const uuid = require("uuid");

const homeRouter = require("./routes/home");
const searchDropDownRouter = require("./routes/searchDropDown");
const searchRouter = require("./routes/search");


// app.get("/", function (req, res) {
//   res.render("index");
// });

//CREATE A TREE//
app.post("/tree", async(req,res) =>{
  console.log(req.body)
     fullTree = req.body.input
     FullerTree = fullTree.split(",")
     const tree = new BinaryTree()
     FullerTree.forEach(number=>{
         tree.insert(Number(number));
     })

     const results = tree
     console.log(FullerTree);
     console.log("");
     console.log("Tree Height: ", nodeHeight(tree.root));
     console.log("Balance Factor: ", nodeBalance(tree.root));
     console.log("");
     console.log(tree)

     try {
        const{input} = req.body;
        const newTree = await pool.query("INSERT INTO tree (input,results) VALUES($1,$2)",
         [input,results]); const resultObject ={ input:input, results:results }
         
         res.send(`<pre>${treeify.asTree(tree, true)}</pre>`)
         
    } catch (err) {
       
        console.error(err.message);
    }
    console.log(treeify.asTree(tree,true))
    
 });
 
 //GET ROUTE//
 app.get("/results", async (req, res) => {
     try {
       const allTrees = await pool.query("SELECT * FROM tree");
       console.log(allTrees);
       res.json(allTrees.rows);
     } catch (err) {
       console.error(err.message);
     }
   
   });
 
 
 
   
   
 //BINARY TREE IMPLEMENTATION//
 class Node {
     constructor(value, left = null, right = null) {
         this.value = value;
         this.left = left;
         this.right = right;
     }
 }
 class BinaryTree{
     constructor() {
         this.root = null
     }
     insert(value) {
         const recursion = (node) => {
             if(node===null) {
                 return new Node(value);
             }else if(value < node.value) {
                 node.left=recursion(node.left);
             }else if(value > node.value) {
                 node.right = recursion(node.right);
             }else{
                 throw new Error("Cannot be equal")
             }
             if(nodeBalance(node) >1) {
                 return nodeRotateLeft(node);
             }else if(nodeBalance <-1) {
                 return nodeRotateRight(node);
             }else{
                 return node;
             }
         }
         this.root = recursion(this.root);
         }
             search(value){
                 const recursiveSearch = (node) =>{
                     if(node===null) {
                         return false;
                     }else if(value<node.value){
                         return recursiveSearch(node.left);
                     }else if(value>node.value){
                         return recursiveSearch(node.right);
                     }else{
                         return true;
                     }
                 }
                 return recursiveSearch(this.root)
             }
 }
 function nodeHeight(node){
     if(node === null) {
         return -1;
     }else if(node.left === null && node.right === null){
         return 0;
     }else{
         return 1 + Math.max(nodeHeight(node.left), nodeHeight(node.right));
     }
 }
 function nodeBalance(node){
     return nodeHeight(node.right) - nodeHeight(node.left);
 }
 function nodeRotateLeft(node){
     if(node === null || node.right === null){
         return node;
     }
     const newRoot = node.right;
     node.right = newRoot.left;
     newRoot.left = node;
     return newRoot;
 }
 function nodeRotateRight(node){
     if(node === null || node.left === null){
         return node;
     }
     const newRoot = node.left;
     node.left = newRoot.right;
     newRoot.right = node;
     return newRoot;
 };
 
 

app.use("/", homeRouter);
app.use("/searchDropDown", searchDropDownRouter);
app.use("/search", searchRouter);






app.listen(PORT, () => {
  console.log(`Simple app running on port ${PORT}.`)
});

//EXPORTS//
module.exports = {
  BinaryTree,
  Node
}