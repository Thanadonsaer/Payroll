const dbCon = require('../lib/db');
const { Types } = require('mysql');
var jwt = require('jsonwebtoken');
var secret = 'jwt-Payroll-token';
const bcrypt = require('bcryptjs');
var express = require('express')
var cookieParser = require('cookie-parser')

var app = express()
app.use(cookieParser());

exports.register = (req, res, next) => {
    console.log(req.body);
    let hashedPassword;
    var { Username, Password,Confirm_Password } = req.body;
    // select query
    dbCon.query('SELECT username FROM account WHERE username=?', [Username], async (err, result) => {
        hasdpassword  = await bcrypt.hash(Password,10);
        console.log(hasdpassword);
        var data = {
            username: Username,
            password: hasdpassword
        }

        err ? console.log(err) : 
        result.length > 0 ?req.flash('error', 'That username is already in use')  && res.render('employee/register') : 
        
        dbCon.query('INSERT INTO account SET ?', data, (err, result) => {
            err ? console.log(err) :
            req.flash('success', 'successfully');
            res.render('employee/register');
            //: res.send("Form submitted");
        })
    })
}

exports.login = (req, res, next) => {
    console.log(req.body);
    var { username, password } = req.body;
    // select query
    dbCon.query('SELECT * FROM account WHERE username=?', [username], (err, Account, result) => {
        console.log('Account_data', Account);
        if (err) {
            req.flash('error', 'An error occurred while searching for the username');
            res.render('login');
        } else {
            if (Account.length === 0) {
                req.flash('error', 'Username not found');
                res.render('login');
            } else {
                bcrypt.compare(password, Account[0].password, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    if (result) {
                        var token = jwt.sign({ username: Account[0].username }, secret,{ expiresIn: '15m' });
                        // res.cookies.[ชื่อcookie] เมื่อมีการเข้ามาในเว็บ ทาง server จะ response ส่ง cookies ออกไป

                        res.cookie("jwt_token", token, {
                            maxAge: 900000 // กำหนด timeout หน่วยเป็น millisecond
                        });
                        // หากต้องการให้ API ตัดการเชื่อมต่อใส่คำสั่ง res.end() เพื่อตัดการเชื่อมทันทีไม่อย่างนั้นจะโหลดจนกว่าจะ timeout
                        // console.log(req.cookies["jwt_token"]);
                        // console.log(token);
                        res.redirect('/employee');
                        res.end();

                    } else {
                        req.flash('error', 'Password incorrect!');
                        res.render('login');
                    }
                });
            }
        }
    });
};
