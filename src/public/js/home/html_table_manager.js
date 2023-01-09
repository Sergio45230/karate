import { filters } from './filters.js';
import { ui, apliedFilter } from './ui.js';
import { cellInfo } from './main.js';
import { dbConsult } from './backend_if.js';
import { acc } from './acc.js';

// FUNCIONES PARA CREACIÓN DE TABLA ****************************************************************************************************************
var justificadas, injustificadas;
var data4Table = [];

var tbl = {
    //INICIALIZACIÓN TABLA SIN FILTROS
    createViewRawData() {

        // Obtener la referencia del elemento div tbl
        var divTbl = document.getElementById("tbl");

        // Crea un elemento <table> y un elemento <tbody>
        var tabla = document.createElement("table");
        data4Table = [];

        // Define Encabezados
        var headerNames = cellInfo.RAW.headers;

        // Define ancho de columnas
        var thCellWidth = cellInfo.RAW.width;

        // Crea tHeader
        tabla = this.createTblHeader(headerNames, thCellWidth, tabla);

        // Crea tBody
        var tblBody = document.createElement("tbody");

        // Obtiene longitud de filas de la base de datos
        var rows = dbConsult.bdatos.length
        justificadas = 0;
        injustificadas = 0;

        // Crea las celdas por cada fila
        for (var i = 0; i < rows; i++) {

            var row = filters.createFilteredRow(dbConsult.bdatos[i], headerNames, i, apliedFilter, justificadas, injustificadas);
            /*var jRow = false;*/
            if (!row.filteredRow) {
                /*if (row.justificadas > justificadas){
                    jRow = true;
                } */
                justificadas = row.justificadas;
                injustificadas = row.injustificadas;

                delete row.justificadas;
                delete row.injustificadas;
                delete row.filteredRow;

                data4Table.push(row);

                // Crea fila de la tabla
                var htmlRow = document.createElement("tr");

                //Agrega celdas a la fila
                for (var j = 0; j < headerNames.length; j++) {
                    htmlRow = this.createCell(row[headerNames[j]], thCellWidth[j], htmlRow);
                }

                /*if(jRow){
                    htmlRow.setAttribute('class', 'jrow');
                }*/
                if(dbConsult.bdatos[i]['UserComment'] != null && dbConsult.bdatos[i]['UserComment'] != ''){
                    htmlRow.setAttribute('class', 'jrow');
                }

                // agrega la htmlRow al final de la tabla (al final del elemento tblbody)
                tblBody.appendChild(htmlRow);
            }
        }
        // posiciona el <tbody> debajo del elemento <table>
        tblBody.setAttribute('id', 'tblBdy');
        tabla.appendChild(tblBody);

        // appends <table> into <body> 
        divTbl.appendChild(tabla);

        // modifica el atributo "border" de la tabla y lo fija a "2";
        tabla.setAttribute("border", "2");
        tabla.setAttribute('id', 'dataTbl');
        tabla.setAttribute('class', 'table table-hover table-dark');

        document.getElementById('col2').setAttribute('class', 'sorting asc');

        document.getElementById('dataTbl').addEventListener('DOMContentLoaded', filters.sortInit());

        document.getElementById('tblBdy').ondblclick = function (e) {
            ui.editForm.getRowInfoAndDisplayForm(e);
        }

        document.getElementById('tblBdy').onmouseover = function (e) {
            var dateOverMouseTD = e.srcElement.parentElement.getElementsByTagName("td")[1].textContent.split(' ')[0];
            var d = dateOverMouseTD.split('/');
            var date = '20' + d[2] + '-' + d[1] + '-' + d[0];
            ui.updateInfo(date);
        }
        

        filters.lastSort = 'col2@asc';

        //writeGeneralData();

    },

    updateRawData() {
        var rows = dbConsult.bdatos.length;
        var auxData4Table = [];
        var headerNames = cellInfo.RAW.headers;
        justificadas = 0;
        injustificadas = 0;

        // Crea las celdas por cada fila
        for (var i = 0; i < rows; i++) {

            var row = filters.createFilteredRow(dbConsult.bdatos[i], headerNames, i, apliedFilter, justificadas, injustificadas);

            if (!row.filteredRow) {

                justificadas = row.justificadas;
                injustificadas = row.injustificadas;

                delete row.justificadas;
                delete row.injustificadas;
                delete row.filteredRow;

                auxData4Table.push(row);

            }

        }

        data4Table = auxData4Table;

        tbl.update();

    },

    createTBL(dataTableArray) {
        if (dataTableArray.length > 0) {
            var divTbl = document.getElementById("tbl");
            var tabla = document.createElement("table");
            var headerNames = Object.getOwnPropertyNames(dataTableArray[0]);
            if (cellInfo[apliedFilter] == undefined) {
                cellInfo[apliedFilter] = cellInfo['RAW'];
            }
            var thCellWidth = cellInfo[apliedFilter].width;

            // Crea tHeader
            tabla = this.createTblHeader(headerNames, thCellWidth, tabla);

            // Crea tBody
            var tblBody = document.createElement("tbody");

            var tmpRow = {};

            // Obtiene longitud de filas de la base de datos
            var rows = dataTableArray.length

            // Crea las celdas por cada fila
            for (var i = 0; i < rows; i++) {

                // Crea fila de la tabla
                var htmlRow = document.createElement("tr");

                //Agrega celdas a la fila
                var cells = Object.getOwnPropertyNames(dataTableArray[0]).length;
                for (var j = 0; j < cells; j++) {
                    htmlRow = this.createCell(dataTableArray[i][headerNames[j]], thCellWidth[j], htmlRow);
                }
                // Marca la fila con clase justificada
                if(dataTableArray[i][headerNames[7]] != ''){
                    htmlRow.setAttribute('class', 'jrow');
                }

                // agrega la htmlRow al final de la tabla (al final del elemento tblbody)
                tblBody.appendChild(htmlRow);
            }

            // posiciona el <tbody> debajo del elemento <table>
            tblBody.setAttribute('id', 'tblBdy');
            tabla.appendChild(tblBody);

            this.deleteTable();

            // appends <table> into <body> 
            divTbl.appendChild(tabla);

            // modifica el atributo "border" de la tabla y lo fija a "2";
            tabla.setAttribute("border", "2");
            tabla.setAttribute('id', 'dataTbl');
            tabla.setAttribute('class', 'table table-hover table-dark');

            document.getElementById('tblBdy').ondblclick = function (e) {
                ui.editForm.getRowInfoAndDisplayForm(e);
            }

            //Inicializa evento de filtro para headers de la tabla
            document.getElementById('dataTbl').addEventListener('DOMContentLoaded', filters.sortInit());

            document.getElementById('tblBdy').onmouseover = function (e) {
                var dateOverMouseTD = e.srcElement.parentElement.getElementsByTagName("td")[1].textContent.split(' ')[0];
                var d = dateOverMouseTD.split('/');
                var date = '20' + d[2] + '-' + d[1] + '-' + d[0];
                ui.updateInfo(date);
            }

            //Aplica último filtro
            filters.sort();

            ui.writeGeneralData();

            //Actualiza acumulados
            if (document.getElementById('acc').style.visibility == 'visible'){
                //document.getElementById('accFliterShow').innerText = apliedFilter;
                acc.createAccTbl();        
            }

            tmpRow = undefined;
        }
        else {
            this.deleteTable();
        }
    },

    createTblHeader(titlesArray, thCellWidth, tabla) {
        var tblHead = document.createElement('thead');
        var htmlRow = document.createElement("tr");

        for (var i = 0; i < titlesArray.length; i++) {
            var celda = document.createElement("th");
            var colID = 'col' + (i + 1).toString();
            if (thCellWidth[i] != 0) {
                celda.setAttribute('style', 'width:' + thCellWidth[i].toString() + '%');
            }
            else {
                celda.setAttribute('style', 'display: none');
            }
            celda.setAttribute('id', colID)
            var textoCelda = document.createTextNode(titlesArray[i]);
            celda.appendChild(textoCelda);
            htmlRow.appendChild(celda);
        }
        tblHead.appendChild(htmlRow);
        tabla.appendChild(tblHead);

        return tabla;
    },

    createCell(cellText, cellWidth, row) {
        var celda = document.createElement("td");
        celda.setAttribute('style', 'width:' + cellWidth.toString() + '%');
        if (cellWidth == 0) {
            celda.setAttribute('style', 'display: none')
        }
        var textoCelda = document.createTextNode(cellText);
        celda.appendChild(textoCelda);
        row.appendChild(celda);

        return row;

    },
    deleteTable() {
        var tblContainer = document.getElementById('tbl');
        var table = document.getElementById('dataTbl');
        if (table != undefined) {
            tblContainer.removeChild(table);
        }
    },

    update() {
        var filter = apliedFilter.split(' ');
        var filterEnabled = false;
        switch (filter[0]) {
            case 'RAW':
                filterEnabled = true;
                break;
            case 'UTE':
                filterEnabled = true;
                break;
            case 'Dominio':
                filterEnabled = true;
                break;
            case 'TRIM':
                filterEnabled = true;
                break;
            case 'CHASIS':
                filterEnabled = true;
                break;
            case 'FINAL':
                filterEnabled = true;
                break;
            case 'DOOR':
                filterEnabled = true;
                break;
            case 'JUSTIFICADAS':
                filterEnabled = true;
                break;
            case 'INJUSTIFICADAS':
                filterEnabled = true;
                break;
        }
        if (filterEnabled) {
            this.createTBL(data4Table);
        }
    },
    justificadasAdd(value){
        justificadas += value;
        injustificadas += value;
    }
}


export { tbl, justificadas, injustificadas, data4Table };