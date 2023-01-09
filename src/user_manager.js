const fs = require('fs');
const dateAndTime = require('./dateAndTime');

let userDb = {
    users: [],
    lastUpdate: '',
    userQuantity: 0
};



let udb = {
    //LECTURA DE JSON DE USUARIOS
    readUserDB() {
        if (fs.existsSync('./src/user_db/user_db.json')) {
            let fileData = fs.readFileSync('./src/user_db/user_db.json', 'utf-8');
            userDb = JSON.parse(fileData);
        }
        else {
            userDb.lastUpdate = dateAndTime.getCurrentDate();
            json2File = JSON.stringify(userDb);
            fs.writeFileSync('./src/user_db/user_db.json', json2File);
        }
    },
    //ESCRITURA JSON DE USUARIOS
    writeUserDB() {
        if (fs.existsSync('./src/user_db/user_db_JSON.bak')) {
            fs.unlinkSync('./src/user_db/user_db_JSON.bak');
        }
        fs.copyFileSync('./src/user_db/user_db.json', './src/user_db/user_db_JSON.bak');

        userDb.lastUpdate = dateAndTime.getCurrentDate();

        fs.writeFileSync('./src/user_db/user_db.json', JSON.stringify(userDb), 'utf-8');

    },
    //NUEVO USUARIO
    newUser(userInfo) {

        let newUser = {
            name: userInfo.inputName,
            lastName: userInfo.inputLastName,
            email: userInfo.inputEmail,
            user: userInfo.inputUser,
            pass: userInfo.inputPass,
            dni: userInfo.inputDni,
            dayBrith: userInfo.inputDayBrith,
            grad: userInfo.inputGrad,
            style: userInfo.inputStyle,
            dojo: userInfo.inputDojo,
            clubTown: userInfo.inputClubTown,
            lastAccess: dateAndTime.getCurrentDateYYYYmmdd(),
            years: userInfo.inputYeras
        };
        //VERIFICACIÓN DE EXISTENCIA DE USUARIO Y DE DOCUMENTO
        let userExist = userDb.users.find(userOBJ => userOBJ.user == newUser.user);
        let emailExist = userDb.users.find(userOBJ => userOBJ.email == newUser.email);

        let res = 'Error';

        if (userExist == undefined && emailExist == undefined) {

            newUser.years = calcularEdad(newUser.dayBrith);

            userDb.userQuantity += 1;
            newUser.userID = userDb.userQuantity.toString();
            userDb.users.push(newUser);
            this.writeUserDB();
            res = 'OK';
        }
        else {
            if (emailExist == undefined && userExist != undefined) {
                res = 'userExist';
            }
            else {
                res = 'emailExist';
            }
        }

        return res

    },
    //ELIMINAR USUARIO (INCOMPLETO)
    deleteUser(user) {
        let userExist = userDb.users.findIndex((userOBJ) => userOBJ.user == user);

        if (userExist != undefined) {
            userDb.users.splice(userExist, 1);
            this.reindexUsersDb();
            this.writeUserDB();
            return true;
        }

        return false;
    },

    reindexUsersDb(){
        let i;
        for(i = 0; i < userDb.users.length; i++){
            userDb.users[i].userID = i + 1;
        }
        userDb.userQuantity = i;
    },

    //CAMBIO DE CLAVE DE USUARIO (INCOMPLETO)
    changeUserPass(user, oldPassword, newPassword) {

        let userExist = userDb.users.findIndex((userOBJ) => userOBJ.user == user);

        if (userExist != undefined) {
            if (userDb.users[userExist].pass == oldPassword) {
                userDb.users[userExist].pass = newPassword;
                return 'OK';
            }
            else {
                return 'invalidOldPass';
            }
        }
        else {
            return 'Not User';
        }


    },
    //ACTUALIZACIÓN DE INFORMACIÓN DE USUARIO
    updateUserInfo(userInfo) {

        let userIndex = userDb.users.findIndex((userOBJ) => userOBJ.user == userInfo.user);

        if (userIndex != undefined && userIndex == parseInt(userInfo.userID) - 1) {
            userInfo.lastAccess = userDb.users[userIndex].lastAccess;
            userInfo.years = calcularEdad(userInfo.dayBrith);
            //userInfo.pass = userIndex.pass;
            userDb.users[userIndex] = userInfo;

            this.writeUserDB();
            return true;
        }
        else {
            return false;
        }
    },
    
    userRecoverPass(user) {

    },
    changeUserStatus(user, status) {

    },
    //CHEQUEO DE LOGIN DE USUARIO
    chkUserLogin(user, pass) {

        let userInfo = this.getUserInfo(user);
        let res = 'accessErr';
        if (userInfo != undefined) {
            if (userInfo.user == user && userInfo.pass == pass) {
                if (userInfo.name != '' && userInfo.lastName != '' && userInfo.email != '') {
                    
                    let i = userDb.users.findIndex((userOBJ) => userOBJ.user == user);
                    userDb.users[i].lastAccess = dateAndTime.getCurrentDateYYYYmmdd();
                    this.writeUserDB();
                    res = 'accessOK';
                }
                else {
                    if (userInfo.status == 'enabled') {
                        res = 'updateInfo';
                    }
                    else {
                        res = 'userDisabled';
                    }
                }
            }
        }
        return res;
    },
    //EXTRAE INFORMACIÓN DE UN USUARIO SEGÚN 'USER'
    getUserInfo(userLoginName) {
        return userDb.users.find(userOBJ => userOBJ.user == userLoginName);
    },
    //ENVÍA DB USUARIOS
    getUsersDB() {
        return userDb;
    },

    getUpdatedUsersDB() {
        this.readUserDB();
        return userDb;
    },
};

module.exports = udb;

udb.readUserDB();

setInterval(() => {
    udb.readUserDB();
}, 60000);

//Servicio de Comprobación de último acceso de usuario
setInterval(() => {

    let now = new Date(dateAndTime.getCurrentDateYYYYmmdd()).getTime()
    for (let i = 0; i < userDb.users.length; i++){

        if (userDb.users[i].lastAccess && userDb.users[i].status == 'enabled') {
            let userLastAccess = new Date(userDb.users[i].lastAccess).getTime();
            let diff = (now - userLastAccess) / 1000 / 60 / 60 / 24
            if(diff > 30){
                userDb.users[i].status = 'disabled';
            }
        }
    }
    udb.writeUserDB();
    
}, 3600000);

function calcularEdad(edad) {
    var hoy = new Date();
    var cumpleanos = new Date(edad);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    return edad;
};