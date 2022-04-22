const dal = require("./postgres_db");
const express = require("express");
const app = express();

const getAllInputs = () =>{
    return new Promise(function (resolve, reject){
        const sql = "Select * From Sprint2_Project2 Order by ID ASC";
        dal.query(sql, [], (err, result) => {
            if(err) {
                reject(err);
            } else{
                resolve(result.rows);
            }
        });
    });
};

module.exports = {
    getAllInputs,
};