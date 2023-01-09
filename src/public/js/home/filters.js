import { dbConsult } from "./backend_if.js";
import { dateAndTime } from "./date_time.js";


//RANGO DE DOMINIOS PARA CADA LÍNEA
var dom4Lines = {
    TRIM: { ini: 1, end: 11 },
    CHASIS: { ini: 12, end: 33 },
    FINAL: { ini: 34, end: 39 },
    DOOR: { ini: 40, end: 44 }
}


var filters = {

    lastSort: undefined,

    createFilteredRow(data, headerNames, index, appliedFilter, justificadas, injustificadas) {
        var tmpRow = {
            filteredRow: false,
            justificadas: justificadas,
            injustificadas: injustificadas
        };

        if (data.Message == 'Producción Activa, Alarma Auxiliar, Sin Dominio ') {
            tmpRow.filteredRow = true;
            return tmpRow;
        }

        if (data.Severity >= 100) {
            tmpRow.filteredRow = true;
            return tmpRow;
        }

        if(dbConsult.userInfo.nivel != 'Administrador' && data.dominio == 'Mantenimiento'){
            tmpRow.filteredRow = true;
            return tmpRow;
        }

        if (appliedFilter.search('UTE') != -1 && data.ute != appliedFilter) {
            tmpRow.filteredRow = true;
            return tmpRow;
        }
        if (appliedFilter.search('Dominio') != -1 && data.dominio != appliedFilter) {
            tmpRow.filteredRow = true;
            return tmpRow;
        }


        var lineFilter = appliedFilter.split(' ')[0];

        if (appliedFilter.search(lineFilter) != -1 && (lineFilter == 'TRIM' || lineFilter == 'CHASIS' || lineFilter == 'FINAL' || lineFilter == 'DOOR')) {
            if (data.dominio.search('Dominio') != -1) {
                var domainNumber = parseInt(data.dominio.split(' ')[1]);
                if (domainNumber < dom4Lines[lineFilter].ini || domainNumber > dom4Lines[lineFilter].end) {
                    tmpRow.filteredRow = true;
                    return tmpRow;
                }
            }
            else {
                tmpRow.filteredRow = true;
                return tmpRow;
            }
        }

        if (appliedFilter == 'JUSTIFICADAS') {
            if (data.Fecha == '' || data.Fecha == null || data.Fecha == undefined) {
                tmpRow.filteredRow = true;
                return tmpRow;
            }
        }

        if (appliedFilter == 'INJUSTIFICADAS') {
            if (!(data.Fecha == '' || data.Fecha == null || data.Fecha == undefined) || data.dominio == 'Mantenimiento') {
                tmpRow.filteredRow = true;
                return tmpRow;
            }
        }


        var f = formatDateSTR(data.fechaI) + ' ' + data.horaI;
        var auxDate, regDate = null;
        if (data.Fecha != null) {
            auxDate = dateAndTime.timeStamp2String(data.Fecha);
            regDate = auxDate.date + ' ' + auxDate.time;
        }

        //Prepara array con info de la fila
        tmpRow[headerNames[0]] = index.toString();
        tmpRow[headerNames[1]] = f;
        tmpRow[headerNames[2]] = data.Message;
        tmpRow[headerNames[3]] = data.diferencia;
        tmpRow[headerNames[4]] = data.dominio;
        tmpRow[headerNames[5]] = data.CuatroM;
        tmpRow[headerNames[6]] = data.Causal;
        tmpRow[headerNames[7]] = data.UserComment;
        tmpRow[headerNames[8]] = data.Responsable;
        tmpRow[headerNames[9]] = regDate;
        tmpRow[headerNames[10]] = data.EventID;

        if (data.dominio != 'Mantenimiento') {
            if (data.Fecha == '' || data.Fecha == null || data.Fecha == undefined) {
                tmpRow.injustificadas += 1;
            }
            else {
                tmpRow.justificadas += 1;
            }
        }

        for (var propertie in tmpRow) {
            if (tmpRow[propertie] == null || tmpRow[propertie] == undefined) {
                tmpRow[propertie] = '';
            }
        }

        return tmpRow;

    },
    //FUNCIÓN DE ORDENAMIENTO DE TABLA - INICIALIZA EVENTO DOBLE CLICK
    sortInit() {

        $('th').dblclick(function () {
            filters.lastSort = this.id;
            var table = $(this).parents('table').eq(0)
            var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))

            if (!this.asc) {
                rows = rows.reverse()
            }
            for (var i = 0; i < rows.length; i++) {
                table.append(rows[i])
            }
            setIcon($(this), this.asc);
            filters.lastSort = this.id + '@'
            if (this.asc) {
                filters.lastSort += 'asc';
            }
            else {
                filters.lastSort += 'desc';
            }
            this.asc = !this.asc
        })

    },
    //FUNCIÓN DE ORDENAMIENTO DE TABLA - UTILIZA lastSort COMO REFERENCIA DE ÚLTIMO FILTRO DE ORDENAMIENTO APLICADO
    sort() {
        if (filters.lastSort != undefined) {
            var elementID = filters.lastSort.split('@')[0];
            var sortDirection = filters.lastSort.split('@')[1];
            var e = $('#' + elementID);
            var table = $(e).parents('table').eq(0)
            var rows = table.find('tr:gt(0)').toArray().sort(comparer($(e).index()))

            var dirSetIcon = true;
            if (sortDirection == 'desc') {
                rows = rows.reverse()
                dirSetIcon = false;
            }
            for (var i = 0; i < rows.length; i++) {
                table.append(rows[i])
            }
            setIcon($(e), dirSetIcon);
        }
//Aplica filtro de busqueda de texto 
        if (document.querySelector('#search').value != '') {
            this.$TableFilter("#dataTbl", document.querySelector('#search').value);
        }

    },

    $TableFilter(id, value) {

        var exp = value.replace(/ /g, '|');

        var wordsCount = value.split(' ').length;

        var er = new RegExp(exp, 'gi');

        //console.log(er);

        var rows = document.querySelectorAll(id + ' tbody tr');

        for (var i = 0; i < rows.length; i++) {
            var showRow = false;

            var row = rows[i];
            row.style.display = 'none';

            for (var x = 0; x < row.childElementCount - 1; x++) {
                /*var regExpmatch = row.children[x].textContent.toLowerCase().match(er);
                if (regExpmatch != null) {
                    if (regExpmatch.length >= wordsCount) {
                        showRow = true;
                        break;
                    }
                }*/
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

}
//***************************************************************************************************
// FUNCIONES AUXILIARES PARA ORDENAMIENTO TABLA  ****************************************************
function comparer(index) {
    return function (a, b) {
        var valA = getCellValue(a, index),
            valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
    }
}

function getCellValue(row, index) {
    return $(row).children('td').eq(index).html()
}

function setIcon(element, asc) {
    $("th").each(function (index) {
        $(this).removeClass("sorting");
        $(this).removeClass("asc");
        $(this).removeClass("desc");
    });
    element.addClass("sorting");
    if (asc) element.addClass("asc");
    else element.addClass("desc");
}
// FIN FUNCIONES AUXILIARES PARA ORDENAMIENTO TABLA *************************************************
//***************************************************************************************************


function formatDateSTR(dateString) {
    var dateSplit = dateString.split('/');
    var dateF = dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0].slice(2, 4);
    return dateF;
}

export { filters }
