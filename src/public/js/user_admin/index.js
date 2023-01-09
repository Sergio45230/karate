/** 
*  Users UI management 
*
* @class User
* @param {number} userID - Unique user ID                               //0
* @param {string} name - User name                                      //1
* @param {string} lastName - User last name                             //2
* @param {string} email - User email                                    //3
* @param {string} user - User login name                                //4
* @param {string} pass - User login password                            //5
* @param {number} dni - User dni                                        //6
* @param {string} dayBrith - User day to brith ('YYYY-MM-DD')           //7
* @param {string} grad - user graduation                                //8
* @param {string} lastAccess - User last access date ('YYYY-MM-DD')     //9
* @param {string} style - User style                                    //10
* @param {string} dojo - User dojo                                      //11
* @param {string} clubTown - User club/Town                             //12
* @param {number} years - User years                                    //13
*/

class User {

    constructor(userID, name, lastName, email, user, pass, dni, dayBrith, grad, lastAccess, style, dojo, clubTown, years) {

        this.userID = userID;           //0
        this.name = name;               //1
        this.lastName = lastName;       //2
        this.email = email;             //3
        this.user = user;               //4
        this.pass = pass;               //5
        this.dni = dni;                 //6
        this.dayBrith = dayBrith;       //7
        this.grad = grad;               //8
        this.lastAccess = lastAccess;   //9
        this.style = style;             //10
        this.dojo = dojo;               //11
        this.clubTown = clubTown;       //12
        this.years = years;             //13
    }
};

let editRow, enableDisplayForm = true;

document.getElementById('usersTbl').onclick = (element) => {

    let inputClickedRowNumber;
    let formVisible = document.getElementById('form');//.style.visibility;

    if (formVisible == 'visible') {
        enableDisplayForm = false;
        document.getElementById('form').style.visibility = 'hidden';
        setTimeout(() => {
            enableDisplayForm = true;
        }, 1500);
    }

    if (element.target.nodeName == 'INPUT') {

        inputClickedRowNumber = element.path[3].rowIndex;
        
        let row = element.path[3].cells;
        let userInfo;
        let r = [];

        for (let i = 0; i < 14; i++) {
            if (i != 14) {
                r.push(row[i].innerText)
            }
            else {
                if (row[i].lastChild.childNodes[0].checked) {
                    r.push('enabled');
                }
                else {
                    r.push('disabled');
                }
            }
        }

        userInfo = new User(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13]);
        updateUserInfo(userInfo, false);
    }
}


// Gestión del doble click en tabla
document.getElementById('usersTbl').ondblclick = (e) => {

    let formVisible = document.getElementById('form');//.style.visibility;
    let row = e.path[1].cells;
    let userInfo;
    let r = [];

    for (let i = 0; i < 13; i++) {
        r.push(row[i].innerText);
    }
    userInfo = new User(r[0], r[1], r[2], r[3], r[4], r[0], r[6], r[7], r[0], r[8], r[9], r[10], r[11], r[5]);

    document.userForm.inputID.value = userInfo.userID;              //0
    document.userForm.inputName.value = userInfo.name;              //1
    document.userForm.inputLastName.value = userInfo.lastName;      //2
    document.userForm.inputEmail.value = userInfo.email;            //3
    document.userForm.inputUser.value = userInfo.user;              //4
    document.userForm.inputYears.value = userInfo.years;            //5
    document.userForm.inputDni.value = userInfo.dni;                //6
    document.userForm.inputDayBrith.value = userInfo.dayBrith;      //7
    document.userForm.inputGrad.value = userInfo.grad;              //8
    document.userForm.inputGrad.value = userInfo.lastAccess         //9
    document.userForm.inputStyle.value = userInfo.style;            //10
    document.userForm.inputDojo.value = userInfo.dojo;              //11
    document.userForm.inputClubTown.value = userInfo.clubTown;      //12  

    document.getElementById('form').style.visibility = 'visible';
    
    editRow = e.path[1].cells;
}

//Boton comando de cierre de formulario de edición
document.getElementById('close').onclick = () => {
    document.getElementById('form').style.visibility = 'hidden';
}

//Boton Salvar
document.getElementById('saveBtn').addEventListener('click', (e) => {
    e.preventDefault();

    let userInfo = new User(

        document.userForm.inputID.value,              //0
        document.userForm.inputName.value,            //1
        document.userForm.inputLastName.value,        //2
        document.userForm.inputEmail.value,           //3
        document.userForm.inputPass.value,            //4
        document.userForm.inputUser.value,            //5
        document.userForm.inputYears.value,           //6
        document.userForm.inputDni.value,             //7
        document.userForm.inputDayBrith.value,        //8
        document.userForm.inputGrad.value,            //9
        document.userForm.inputStyle.value,           //10
        document.userForm.inputDojo.value,            //11
        document.userForm.inputClubTown.value         //12
    )
    updateUserInfo(userInfo, true);

});


//Consulta POST Ver lo que me dijo el facha tincho
function updateUserInfo(userInfo, updateTBL) {
    let req = new XMLHttpRequest();
    
    req.open('POST', "/users/update", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.responseType = 'text';
    req.onload = () => {
        let res = 'OK';
        console.log(res)
        if (res == 'OK') {
            
            if (updateTBL) {
                editRow[0].innerText = document.userForm.inputID.value;
                editRow[1].innerText = document.userForm.inputName.value;
                editRow[2].innerText = document.userForm.inputLastName.value;
                editRow[3].innerText = document.userForm.inputEmail.value;
                editRow[4].innerText = document.userForm.inputUser.value;
                editRow[5].innerText = document.userForm.inputYears.value;
                editRow[6].innerNumber = document.userForm.inputDni.value;
                editRow[7].innerText = document.userForm.inputDayBrith.value;
                editRow[8].innerText = document.userForm.inputGrad.value;
                editRow[10].innerText = document.userForm.inputStyle.value;
                editRow[11].innerText = document.userForm.inputDojo.value;
                editRow[12].innerText = document.userForm.inputClubTown.value;

                document.getElementById('form').style.visibility = 'hidden';
            }
            for (var i = 0; i < 14; i++) {
                console.log(i, editRow[i].innerText);
            }
        }
        else {
            window.alert('Error desconocido en la modificación...');
        }
    }

    req.send(JSON.stringify(userInfo));
}

document.getElementById('deleteBtn').addEventListener('click', (e) => {
    e.preventDefault();

    let user2Del = document.userForm.inputUser.value;

    if (window.confirm('WARNING:\nEstas seguro de eliminar a ' + document.userForm.inputUser.value + '?')) {
        deleteUser({user2Del});
    }
});

function deleteUser(user) {

    let req = new XMLHttpRequest();

    req.open('POST', "/users/delete", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.responseType = 'text';

    req.onload = () => {
        let res = req.response;
        if (res == 'OK') {
            window.location = '/users/admin';
        }
        else {
            window.alert('Error, no se pudo eliminar usuario...');
        }
    }

    req.send(JSON.stringify(user));
}



//Aplica filtro de busqueda de texto 
document.querySelector("#search").onkeyup = function (e) {

    if (e.key == 'Escape') {
        document.querySelector("#search").value = '';
    }
    $TableFilter("#usersTbl", this.value);
}

document.getElementById('clear_search').onclick = function () {

    document.querySelector('#search').value = '';
    $TableFilter("#usersTbl", '');
}

function $TableFilter(id, value) {

    let rows = document.querySelectorAll(id + ' tbody tr');

    for (var i = 0; i < rows.length; i++) {
        var showRow = false;
        var row = rows[i];

        row.style.display = 'none';

        for (var x = 0; x < row.childElementCount - 1; x++) {

            if (row.children[x].textContent.toLowerCase().indexOf(value.toLowerCase().trim()) > -1) {

                showRow = true;

                break;
            }

        }
        if (showRow) {
            row.style.display = null;
        }
    }
}
