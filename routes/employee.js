let express = require('express');
let router = express.Router();
let dbCon = require('../lib/db');
const { Types } = require('mysql');
var jwt = require('jsonwebtoken');
var secret = 'jwt-Payroll-token';
var cookieParser = require('cookie-parser');
const { error } = require('jquery');

var app = express()
app.use(cookieParser());

router.get('/', (req, res, next) => {
    var token = req.cookies["jwt_token"];
    if (token) {
        // console.log('JWT_Token:', token);
        // console.log(decoded);
        var decoded = jwt.verify(token, secret);
        // ตรวจสอบ token
        dbCon.query('SELECT username FROM account WHERE username=?', [decoded.username], (err, result) => {

            isLogin = decoded.username;
            req.flash('isLogin', isLogin);
            // ดำเนินการต่อไป...
            dbCon.query('SELECT * FROM employee_information ORDER BY id desc', (err, rows) => {
                if (err) {
                    req.flash('error', err);
                    res.render('employee', { data: '' });
                } else {
                    res.render('employee', { data: rows });
                }
            });
        })

    } else {
        res.redirect('/login')
    }

})
router.get('/logout', (req, res, next) => {
    res.clearCookie('jwt_token');
    res.redirect('/login')
})
router.get('/register', (req, res, next) => {
    var token = req.cookies["jwt_token"];
    var isLogin = '';
    if (token) {
        var decoded = jwt.verify(token, secret);
        isLogin = decoded.username
    }
    req.flash('isLogin', isLogin);
    res.render('employee/register')
})
router.get('/account', (req, res, next) => {
    var token = req.cookies["jwt_token"];
    if (token) {
        // console.log('JWT_Token:', token);
        // console.log(decoded);
        var decoded = jwt.verify(token, secret);
        // ตรวจสอบ token
        dbCon.query('SELECT username FROM account WHERE username=?', [decoded.username], (err, result) => {
            isLogin = decoded.username;
            req.flash('isLogin', isLogin);
            // ดำเนินการต่อไป...
            dbCon.query('SELECT * FROM account ORDER BY id desc', (err, rows) => {
                if (err) {
                    req.flash('error', err);
                    res.render('employee/account', { data: '' });
                } else {
                    res.render('employee/account', { data: rows });
                }
            });
        })

    } else {
        res.redirect('/login')
    }

})

// display add emplloyee
router.get('/add', (req, res, next) => {
    var token = req.cookies["jwt_token"];
    if (token) {
        // console.log('JWT_Token:', token);
        // console.log(decoded);
        var decoded = jwt.verify(token, secret);
        // ตรวจสอบ token
        dbCon.query('SELECT username FROM account WHERE username=?', [decoded.username], (err, result) => {
            isLogin = decoded.username;
            req.flash('isLogin', isLogin);
            // ดำเนินการต่อไป...
            res.render('employee/add', {
                ID: '', ID_CARD: '', 
                TH_Prefix: '',TH_First_Name: '',TH_Last_Name: '',
                EN_Prefix: '',EN_First_Name: '',EN_Last_Name: '',
                Gender: '',ID_card_number: '',Status: '',
                social_security_number: '',group: '',
                department: '',position: '',scope: '',
                place: '',level: '',type: '',
                status_work: '',start_date: '',
                probation: '',placement_date: '',end_date: ''
            })
        })

    } else {
        res.redirect('/login')
    }

})


function constructFormData(reqBody) {
    const {
        ID, ID_CARD, TH_Prefix, TH_First_Name, TH_Last_Name,
        EN_Prefix, EN_First_Name, EN_Last_Name, Gender, ID_card_number,
        Status, Social_security_number, Group, Department, Position,
        Scope, Place, Level, Type, Status_work, Start_date, Probation,
        Placement_date, End_date
    } = reqBody;

    return {
        ID:ID,ID_CARD : ID_CARD, คำนำหน้า: TH_Prefix, ชื่อ: TH_First_Name, นามสกุล: TH_Last_Name,
        Prefix: EN_Prefix, First_Name: EN_First_Name, Last_Name: EN_Last_Name, Gender,
        เลขบัตรประชาชน: ID_card_number, เลขประกันสังคม: Social_security_number,
        สถานะภาพ: Status, ฝ่าย: Group, แผนก: Department, ตำแหน่ง: Position,
        สถานที่ทำงาน: Place, เขตทำงาน: Scope, สถานะทำงาน: Status_work,
        วันเริ่มงาน: Start_date, วันทดลอง: Probation, วันบรรจุ: Placement_date,
        วันที่ออก: End_date, ประเภท: Type, ระดับ: Level
    };
}
router.post('/add', (req, res, next) => {
    const form_data = constructFormData(req.body);

    dbCon.query('INSERT INTO employee_information SET ?', form_data, (err, result) => {
        if (err) {
            req.flash('error', err);
            res.render('employee/add', { ...req.body });
        } else {
            req.flash('success', 'Employee successfully added');
            res.redirect('/employee');
        }
    });
});

router.post('/edit', (req, res, next) => {
    const form_data = constructFormData(req.body);

        // Update query
        dbCon.query('UPDATE employee_information SET ? WHERE ID = ?', [form_data, ID], (err, result) => {
            if (err) {
                req.flash('error', err);
                res.render('/employee', { ...req.body });
            } else {
                req.flash('success', 'Employee successfully edited');
                res.redirect('/employee');
            }
        });

});


router.post('/delete', (req, res, next) => {
    const { ID } = req.body;
    let errors = false;

    // if no error
    if (!errors) {
        const form_data = {
            ID: ID
        };

        // delete query
        dbCon.query('DELETE FROM employee_information WHERE ID = ?', form_data.ID, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.redirect('/employee'); // Use res.redirect instead of res.render
            } else {
                req.flash('success', 'Employee successfully deleted');
                res.redirect('/employee');
            }
        });
    }
});
router.post('/account/delete', (req, res, next) => {
    const {username} = req.body;

    // Check if the username is 'Admin'
    if (username === 'Admin') {  
         
        return res.send('noaccess')
    }
    // No error, proceed with the deletion
    dbCon.query('DELETE FROM account WHERE username = ?', username, (err, result) => {
        if (err) {
            req.flash('error', err);
            res.redirect('/employee/account');
        } else {
            req.flash('success', 'Account successfully deleted');
            res.redirect('/employee/account');
        }
    });
});

module.exports = router;