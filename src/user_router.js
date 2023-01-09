const express = require("express");
const router = express.Router();
const udb = require('./user_manager');

router.get('/reg', (req, res) =>{

    res.render('register');
})

router.post('/new', (req, res) => {

    let newUserInfo = req.body;
    let response = {};

    response.res = udb.newUser(newUserInfo);

    if (response.res == 'OK') {
        response.title = 'REGISTRO';
        response.err = 'Usuario creado con exito';
    }
    else if(response.res == 'userExist'){
        response.title = 'ERROR DE REGISTRO';
        response.err = 'Usuario existente - ERROR';
    }
    else if(response.res == 'emailExist'){
        response.title = 'ERROR DE REGISTRO';
        response.err = 'El email cargado ya existe en la base de datos';
    }
    else{
        response.title = 'ERROR DE REGISTRO';
        response.err = 'Error desconocido...';

    }

    res.redirect('/users_admin');
   
});

router.post('/update', (req, res) => {

    let updateRes = udb.updateUserInfo(req.body);

    if (updateRes) {
        res.send('OK');
    }
    else{
        res.send('NOK');
    }
});

router.post('/update_info', (req, res) => {

    let updateInfo = req.body;
    let userInfo = udb.getUserInfo(updateInfo.inputUser);

    if (userInfo != undefined) {
        userInfo.userId = updateInfo.inputuserID;
        userInfo.name = updateInfo.inputName;
        userInfo.lastName = updateInfo.inputLastName;
        userInfo.email = updateInfo.inputEmail;
        userInfo.pass = updateInfo.pass;
        userInfo.dni = updateInfo.dni;
        userInfo.dayBrith = updateInfo.dayBrith;
        userInfo.grad = updateInfo.grad;
        userInfo.style = updateInfo.style;
        userInfo.dojo = updateInfo.dojo;
        userInfo.clubTown = updateInfo.clubTown;
        userInfo.years = userInfo.years;

        let updated = udb.updateUserInfo(userInfo);
        if(updated){
            res.redirect('/users_admin');
        }
        else{
            res.send('Error - incorrect update...')
        }
    }
    else{
        res.send('Error - User not found...')
    }
});

router.get('/tst', (req, res) =>{

    let response = {};

    response.title = 'ERROR de Registro de Usuario';
    response.err = 'Usuario existente';
    res.render('register_response', response)
});

router.get('/admin', (req, res) => {

    if (req.session.loggedin) {
        let users = udb.getUpdatedUsersDB();
        let userRight = udb.getUserInfo(req.session.username);

        if(userRight.dominio == 'ROOT') {

            res.render('users_admin', users);
    
        }
        else{
            res.send(req.session.username + ' is not a ROOT user...')
        }
    }

    else {
        res.send('Usuario No autorizado...');
    }
    res.end();
});

router.post('/delete', (req, res) => {

    let del = udb.deleteUser(req.body.user2Del);

    if (del) {
        res.send('OK');
    }
    else{
        res.send('NOK');
    }
    res.redirect('/users_admin');
});

module.exports = router;