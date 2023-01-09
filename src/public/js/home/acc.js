
//FILTRA ARRAY PARA ELIMINAR ELEMENTOS DUPLUCADOS
Array.prototype.unique = function (a) {
    return function () { return this.filter(a) }
}(function (a, b, c) {
    return c.indexOf(a, b + 1) < 0
});


let acc = {
    createAccTbl() {
        let tblInfo = getTblInfo();
        let msgList = getMsgList(tblInfo);
        let accumOBJ = msgGroup(msgList, tblInfo);
        tbl.create(accumOBJ);
    }
}

function getTblInfo() {
    let dataFromTbl = document.getElementById('dataTbl').getElementsByTagName('td');
    return dataFromTbl;
}

function getMsgList(dataFromTbl) {
    let msgList = [];
    for (var i = 0; i < dataFromTbl.length; i += 11) {
        if (dataFromTbl[i + 2].parentElement.style.display != 'none') {
            msgList.push(dataFromTbl[i + 2].innerHTML);
        }
    }
    var uniqueMsgs = msgList.unique();
    return uniqueMsgs;
}


function msgGroup(msgList, tblData) {

    let filteredTable = [];

    let index = 1;

    let quant = msgList.length;

    let tableLen = tblData.length;

    for (let i = 0; i < quant; i++) {

        let tAcumSegundos = 0;

        let eventCounter = 0;

        for (let j = 0; j < tableLen; j += 11) {

            let msgCHK = tblData[j + 2].innerHTML;
            let msgREF = msgList[i];

            if (msgCHK == msgREF) {

                tAcumSegundos += secondsFrom_StringTime(tblData[j + 3].innerHTML);

                eventCounter += 1;

            }

        }

        if (tAcumSegundos > 0) {

            let tAcumMinutes = set2DigitValue(Math.trunc(tAcumSegundos / 60).toString()) + ':' + set2DigitValue((tAcumSegundos - Math.trunc(tAcumSegundos / 60) * 60).toString());

            let tableLine = { Pos: index, Description: msgList[i], Tiempo: tAcumMinutes, Cant: eventCounter };

            filteredTable.push(tableLine);

            index += 1;

        }
    }

    return sort4Time(filteredTable);

}

//OBTIENE CANTIDAD DE SEGUNDOS DESDE HH:MM:SS (String)
function secondsFrom_StringTime(timeSTR) {

    var arrayTime = timeSTR.split(':');

    var rest = 0;

    if (arrayTime.length > 2) {

        var hoursToSec = parseInt(arrayTime[0]) * 3600;

    }
    else {
        rest = 1;
        hoursToSec = 0;
    }

    var minutesToSec = parseInt(arrayTime[1 - rest]) * 60;

    var seconds = parseInt(arrayTime[2 - rest]);

    var tiempoCausalSegundos = hoursToSec + minutesToSec + seconds;

    return tiempoCausalSegundos;

}

//AYUDA AL FORMATO DE HH:MM:SS (CAMPOS DE DOS DÍGITOS)
function set2DigitValue(val) {
    if (val.length < 2) {
        val = '0' + val;
    }
    return val;
}

//ORDENAMIENTO POR CANTIDAD
function sort4Quantity(table2Sort) {

    do {
        var changes = false;
        for (var i = 0; i < table2Sort.length - 1; i++) {
            if (table2Sort[i].Cant < table2Sort[i + 1].Cant) {
                var auxOBJ = table2Sort[i];
                table2Sort[i] = table2Sort[i + 1];
                table2Sort[i + 1] = auxOBJ;
                changes = true;
            }
        }
    } while (changes == true);

    for (var i = 0; i < table2Sort.length - 1; i++) {
        table2Sort[i].Pos = i;
    }

    return table2Sort;
}

//ORDENAMIENTO POR TIEMPO
function sort4Time(table2Sort) {

    do {
        var changes = false;
        for (var i = 0; i < table2Sort.length - 1; i++) {
            var val1 = parseInt(table2Sort[i].Tiempo.split(':')[0]) * 60 + parseInt(table2Sort[i].Tiempo.split(':')[1]);
            var val2 = parseInt(table2Sort[i + 1].Tiempo.split(':')[0]) * 60 + parseInt(table2Sort[i + 1].Tiempo.split(':')[1]);
            if (val1 < val2) {
                var auxOBJ = table2Sort[i];
                table2Sort[i] = table2Sort[i + 1];
                table2Sort[i + 1] = auxOBJ;
                changes = true;
            }
        }
    } while (changes == true);

    for (var i = 0; i < table2Sort.length; i++) {
        table2Sort[i].Pos = i;
    }

    return table2Sort;
}

let tbl = {
    create(dataTableArray) {
        var divTbl = document.getElementById("divAccTbl");
        var tabla = document.createElement("table");
        var headerNames = Object.getOwnPropertyNames(dataTableArray[0]);
        var thCellWidth = [2, 50, 10, 5];

        // Crea tHeader
        tabla = this.createTblHeader(headerNames, thCellWidth, tabla);

        // Crea tBody
        var tblBody = document.createElement("tbody");

        var tmpFile = {};

        // Obtiene longitud de filas de la base de datos
        var rows = dataTableArray.length

        // Crea las celdas por cada fila
        for (var i = 0; i < rows; i++) {

            // Crea fila de la tabla
            let htmlRow = document.createElement("tr");

            //Agrega celdas a la fila
            var cells = Object.getOwnPropertyNames(dataTableArray[0]).length;
            for (var j = 0; j < cells; j++) {
                htmlRow = this.createCell(dataTableArray[i][headerNames[j]], thCellWidth[j], htmlRow);
            }

            // agrega la fila al final de la tabla (al final del elemento tblbody)
            tblBody.appendChild(htmlRow);

            // posiciona el <tbody> debajo del elemento <table>
            tabla.appendChild(tblBody);

            this.deleteTable();

            // appends <table> into <body> 
            divTbl.appendChild(tabla);

            // modifica el atributo "border" de la tabla y lo fija a "2";
            //tabla.setAttribute("border", "2");
            tabla.setAttribute('id', 'accTbl');
            tabla.classList.add('table', 'table-striped', 'table-bordered', 'table-sm');

        }
        tmpFile = undefined;
    },

    createTblHeader(titlesArray, thCellWidth, tabla) {
        var tblHead = document.createElement('thead');
        var hilera = document.createElement("tr");

        for (var i = 0; i < titlesArray.length; i++) {
            var celda = document.createElement("th");
            var colID = 'col' + (i + 1).toString();

            celda.setAttribute('style', 'width:' + thCellWidth[i].toString() + '%');
            celda.setAttribute('id', colID)
            var textoCelda = document.createTextNode(titlesArray[i]);
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }
        tblHead.appendChild(hilera);
        tabla.appendChild(tblHead);

        return tabla;
    },

    createCell(cellText, cellWidth, row) {
        var celda = document.createElement("td");
        celda.setAttribute('style', 'width:' + cellWidth.toString() + '%');
        var textoCelda = document.createTextNode(cellText);
        celda.appendChild(textoCelda);
        row.appendChild(celda);

        return row;

    },
    deleteTable() {
        var tblContainer = document.getElementById('divAccTbl');
        var table = document.getElementById('accTbl');
        if (table != undefined) {
            tblContainer.removeChild(table);
        }
    }
}

export { acc };



