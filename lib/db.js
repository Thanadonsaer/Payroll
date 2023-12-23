let mysql = require('mysql');
var dotenv = require('dotenv');
dotenv.config({path:'./.env'}); 
let connection = mysql.createConnection(
    {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    })
connection.connect((error) => {
    if(!error){
        console.log("Connected...");
        console.log("http://localhost:3000")
    }else{
        console.log(error);
    }
   
})




module.exports = connection;