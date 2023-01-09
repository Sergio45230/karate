const express = require("express");
const router = express.Router();
const dateAndTime = require('./dateAndTime');
const udb = require('./user_manager');

var userData = {};

//Root
router.get('/', (req, res) => {

    req.session.destroy(function (err) {
    res.render('login');
    })
});

router.post('/authentification', (req, res) => {
    let user = req.body.username;
    let pass = req.body.password;

    let userLoginRes = udb.chkUserLogin(user, pass);

    if ( userLoginRes == 'accessOK') {
        req.session.loggedin = true;
        req.session.username = user;

        userData[user] = {};
        userData[user].filterDate = dateAndTime.getCurrentDateYYYYmmdd();
        userData[user].filterDom = '';
        userData[user].filterLin = '';
        
        res.redirect('/users_admin');
    }
    else {
        if(userLoginRes == 'updateInfo'){
            res.render('update_user_info', req.body);
        }
        if(userLoginRes == 'accessErr'){
            res.send('Error de loggin...');
        }
        if(userLoginRes == 'userDisabled'){
            res.send('User is disabled...');
        }
    }
    res.end();

});

router.get('/users_admin', (req, res) => {

    let users = udb.getUpdatedUsersDB();

    res.render('users_admin', users);
});

module.exports = router;