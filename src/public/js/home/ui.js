import { filters } from './filters.js';
import { dateAndTime, dateSelected } from './date_time.js';
import { tbl, justificadas, injustificadas } from './html_table_manager.js';
import { dbConsult, backEnd } from './backend_if.js';
import { acc } from './acc.js';
import { export2excel } from './export2excel.js';
import { timeLine } from '../timeline/timeline.js';

var apliedFilter = 'RAW';
var overMouseDate = { date: dateSelected.dateEnd, show: false };
var ui = {
    //ACTUALIZACIÓN DE ELEMENTOS DINÁMICOS RÁPIDOS
    dinamicUpdate() {
        // Actualiza Fecha Hora UI
        var dateTime = dateAndTime.getSystemDate() + ' - ' + dateAndTime.getSystemTime();
        document.getElementById('dateTime').textContent = dateTime;
        // Actualiza filtro aplicado UI
        document.getElementById('appliedFilter').textContent = apliedFilter;
        // Corrige altura de tabla UI
        var tblBotPos = document.getElementById('tbl').getBoundingClientRect().bottom;
        var footTopPos = document.getElementById('footer').getBoundingClientRect().top;
        if (footTopPos - tblBotPos != 7) {
            var tblHeight = document.getElementById('tbl').getBoundingClientRect().height;
            var value = tblHeight - (tblBotPos - footTopPos + 7).toString() + 'px';
            document.getElementById('tbl').setAttribute('style', 'max-height:' + value);
        }
        //Avtualiza datos de producción
        var productionRes = backEnd.requestProdInfo();
        var imposed, teoric, real;

        if (productionRes != undefined && !overMouseDate.show && overMouseDate.date == dateAndTime.getSystemDate()) {
            imposed = productionRes.imposed;
            teoric = productionRes.teoric;
            real = productionRes.real + ' (produciendo)';
        }
        else {
            imposed = 'NA';
            teoric = 'NA'
            real = 'NA';
        }

        if (overMouseDate.show) {
            imposed = overMouseDate.imposed;
            teoric = overMouseDate.teoric;
            real = overMouseDate.real + ' (finalizada)';
        }
        if (imposed != undefined) {
            document.getElementById('imposed').textContent = 'Impostada: ' + imposed;
            document.getElementById('teoric').textContent = 'Teórica: ' + teoric;
            document.getElementById('real').textContent = 'Real: ' + real;
        }

    },
    //ACTUALIZACIÓN DE VALORES DINAMICOS LENTOS
    updateInfo(date) {

        // Actualiza info de Horarios
        var scheduleInfo = 'Horario productivo: ' + date + ' => ' + dbConsult.horarios[date][0].substr(0, 5) + '-';
        scheduleInfo += dbConsult.horarios[date][7].substr(0, 5) + ' hs  --- ';
        scheduleInfo += 'Horario pausas: | 1er: ' + dbConsult.horarios[date][1].substr(0, 5) + '-' + dbConsult.horarios[date][2].substr(0, 5) + ' hs | ';
        scheduleInfo += '2da: ' + dbConsult.horarios[date][3].substr(0, 5) + '-' + dbConsult.horarios[date][4].substr(0, 5) + ' hs | ';
        scheduleInfo += '3er: ' + dbConsult.horarios[date][5].substr(0, 5) + '-' + dbConsult.horarios[date][6].substr(0, 5) + ' hs |';
        let productionTimeLen = new Date(date + ' ' + dbConsult.horarios[date][7]).getTime() - new Date(date + ' ' + dbConsult.horarios[date][0]).getTime();

        if(productionTimeLen > 30000000){
            scheduleInfo += ' 4ta: ' + dbConsult.horarios[date][8].substr(0, 5) + '-' + dbConsult.horarios[date][9].substr(0, 5) + ' hs |';
            
        }
        document.getElementById('scheduleInfo').textContent = scheduleInfo;

        //ACTUALIZA PRODUCCIÓN DEL DÍA PARA DIAS QUE LA TENGAN REGISTRADA ('Day production' Alarm)
        if (dbConsult.dayProduction[date] != undefined) {
            let values = dbConsult.dayProduction[date].split(' | ');
            let imposed = values[1].split(':')[1];
            let teoric = values[2].split(':')[1];
            let real = values[3].split(':')[1];
            overMouseDate = { date: date, imposed: imposed, teoric: teoric, real: real, show: true };
        }
        else {
            overMouseDate = { date: date, show: false };
        }
        this.writeGeneralData();
    },

    //ESCRIBE VALORES FUEREA DE LA TABLA
    writeGeneralData() {
        document.getElementById('justificadas').textContent = justificadas;
        document.getElementById('injustificadas').textContent = injustificadas;
        document.getElementById('user').innerText = dbConsult.userInfo.name + ' ' + dbConsult.userInfo.lastName;
        document.getElementById('dominio').innerText = dbConsult.dominio;
    },
    //INTERFASE PARA FORMULARIO DE EDICIÓN
    editForm: {
        rowElements: undefined,
        //CREA LOS VALORES DE LAS LISTAS DESPLEGABLES EN FUNCION A LAS VARIABLES DESDE LA CONSULTA (dbConsult)
        createOptions() {
            var selector = document.getElementById('editForm4M');
            for (var i = 0; i < dbConsult.cuatroMlist.length; i++) {
                var option = document.createElement('option');
                option.text = dbConsult.cuatroMlist[i];
                selector.add(option);
            }
            var selector = document.getElementById('editFormCausal');
            for (var i = 0; i < dbConsult.causalList.length; i++) {
                var option = document.createElement('option');
                option.text = dbConsult.causalList[i];
                selector.add(option);
            }
            var selector = document.getElementById('editFormReponsable');
            for (var i = 0; i < dbConsult.responsableList.length; i++) {
                var option = document.createElement('option');
                option.text = dbConsult.responsableList[i];
                selector.add(option);
            }
        },
        //OBTIENE INFOAMCIÓN DESDE LA FILA DOBLECLICKEADA PARA PRESENTARLA EN EL FORMULARIO
        getRowInfoAndDisplayForm(e) {
            this.rowElements = e.srcElement.parentElement.getElementsByTagName("td");
            this.htmlElement = e.srcElement.parentElement;

            var elements = {};
            elements.pos = this.rowElements[0].innerHTML;
            elements.date = this.rowElements[1].innerHTML;
            elements.description = this.rowElements[2].innerHTML;
            elements.time = this.rowElements[3].innerHTML;
            elements.dominio = this.rowElements[4].innerHTML;
            elements.cuatroM = this.rowElements[5].innerHTML;
            elements.causal = this.rowElements[6].innerHTML;
            elements.commentary = this.rowElements[7].innerHTML;
            elements.responsable = this.rowElements[8].innerHTML;
            elements.datecomment = this.rowElements[9].innerHTML;
            elements.eventID = this.rowElements[10].innerHTML;

            document.getElementById('editFormTitle').textContent = 'Editor de evento - ' + elements.dominio + ' - Fecha: ' + elements.date;
            document.getElementById('editFormMsg').textContent = elements.description;

            document.getElementById('editFormTxt').value = elements.commentary;

            document.getElementById('editFormStopTime').textContent = 'Tiempo de parada: ' + elements.time;

            var cuatroMLst = document.getElementById('editForm4M');
            if (elements.cuatroM == '') {
                cuatroMLst.value = 'Seleccione 4M'
            }
            else {
                cuatroMLst.value = elements.cuatroM;
            }

            var causalLst = document.getElementById('editFormCausal');
            if (elements.causal == '') {
                causalLst.value = 'Seleccione Causal'
            }
            else {
                causalLst.value = elements.causal;
            }

            var responsableLst = document.getElementById('editFormReponsable');
            if (elements.responsable == '') {
                responsableLst.value = 'Seleccione Resp'
            }
            else {
                responsableLst.value = elements.responsable;
            }

            document.getElementById('editFormLastUpdate').textContent = 'Sin justificar.';

            var id = elements.eventID;
            var index = parseInt(elements.pos);
            var user = dbConsult.bdatos[index].PersonID;
            document.getElementById('editFormID').textContent = id;

            if (elements.datecomment != '') {
                document.getElementById('editFormLastUpdate').textContent = 'Última modificación: ' + elements.datecomment + ' by ' + user;
            }
            //VISIBILIDAD DEL BOTON DE COMANDO 'DELETE'
            let rowClass = this.htmlElement.getAttribute('class');
            if (rowClass != null) {
                if (rowClass.search('jrow') != -1) {
                    document.getElementById('editFormDelete').style.visibility = 'visible';
                }
            }
            document.getElementById('editForm').style.visibility = 'visible';

        },
        //PREPARACIÓN DE INFORMACIÓN PARA ENVÍO AL SERVIDOR
        sendEditData() {
            var cuatroM_Value = dbConsult.cuatroMlist.indexOf(document.getElementById('editForm4M').value);
            var causal_Value = dbConsult.causalList.indexOf(document.getElementById('editFormCausal').value);
            var responsable_Value = dbConsult.responsableList.indexOf(document.getElementById('editFormReponsable').value);

            var cuatroM = document.getElementById('editForm4M').value;
            var causal = document.getElementById('editFormCausal').value;
            var responsable = document.getElementById('editFormReponsable').value;
            var commentary = document.getElementById('editFormTxt').value;
            var id = document.getElementById('editFormID').textContent;
            var dateComm = dateAndTime.getSystemDate().replace(/-/g, '/') + ' ' + dateAndTime.getSystemTime();

            //VARIABLE A ENVIAR
            if (cuatroM_Value >= 0 && causal_Value >= 0 && responsable_Value >= 0 && commentary != '') {
                var row2Send = {
                    usuario: dbConsult.usuario,
                    cuatroM: cuatroM,
                    causal: causal,
                    areaRespo: responsable,
                    comentario: commentary,
                    dateCommentary: dateComm,
                    id: id
                };

                //ACTUALIZACIÓN DE CELDAS EN LA TABLA
                backEnd.sendEditedRowInfo(row2Send);
            }
            else {
                alert('Por favor complete todos los campos requeridos!!.\nGracias.\n');
            }

        },
        updateResponseSendEditData(writeResponse, row2Send) {
            if (writeResponse) {

                this.rowElements[5].innerHTML = row2Send.cuatroM;
                this.rowElements[6].innerHTML = row2Send.causal;
                this.rowElements[7].innerHTML = row2Send.comentario;
                this.rowElements[8].innerHTML = row2Send.areaRespo;
                this.rowElements[9].innerHTML = row2Send.dateCommentary;
                if(row2Send.comentario != ''){
                    this.htmlElement.setAttribute('class', 'jrow');
                    tbl.justificadasAdd(1);
                }
                else{
                    this.htmlElement.classList.remove('jrow');
                    tbl.justificadasAdd(-1);
                }

                var i = parseInt(this.rowElements[0].innerHTML);
                var toDB = {};

                toDB.Causal = row2Send.causal;
                toDB.CuatroM = row2Send.CuatroM;
                toDB.UserComment = row2Send.comentario;
                toDB.Responsable = row2Send.areaRespo;
                toDB.Fecha = row2Send.dateCommentary;
                toDB.PersonID = dbConsult.usuario;

                backEnd.updateDbInfo(toDB, i);

                document.getElementById('editFormDelete').style.visibility = 'hidden';
                document.getElementById('editForm').style.visibility = 'hidden';
            }
            else {
                alert('Error en servidor SQL...\n\nPor favor reintente en unos minutos\n\nDisculpe las molestias ocacionadas.\n')
            }
        },

        delete() {
            var cuatroM = '';
            var causal = '';
            var responsable = '';
            var commentary = '';
            var id = document.getElementById('editFormID').textContent;
            var dateComm = dateAndTime.getSystemDate().replace(/-/g, '/') + ' ' + dateAndTime.getSystemTime();

            //VARIABLE A ENVIAR
            var row2Send = {
                usuario: dbConsult.usuario,
                cuatroM: cuatroM,
                causal: causal,
                areaRespo: responsable,
                comentario: commentary,
                dateCommentary: dateComm,
                id: id
            };

            //ACTUALIZACIÓN DE CELDAS EN LA TABLA
            backEnd.sendEditedRowInfo(row2Send);

        },
    },
    
    updateGrapics(){
        if(document.getElementById('chartDiv').style.visibility == 'visible'){
            timeLine.createChart();
        }
    }
}

//FILTRO DE BÚSQUEDA DE TEXTO EN TABLA

document.querySelector("#search").onkeyup = function (e) {
    if(e.key == 'Escape'){
        document.querySelector("#search").value = '';
    }
    filters.$TableFilter("#dataTbl", this.value);
}

document.getElementById('clear_search').onclick = function () {
    document.querySelector("#search").value = '';
    filters.$TableFilter("#dataTbl", this.value);
}

// EVENTOS Formulario de Justificación *******************************************************************************************

document.getElementById('closeForm').onclick = function () {
    document.getElementById('editForm').style.visibility = 'hidden';
    document.getElementById('editFormDelete').style.visibility = 'hidden';
}

document.getElementById('bdy').onkeyup = function (k) {
    if (document.getElementById('editForm').style.visibility == 'visible' && k.key == 'Escape') {
        document.getElementById('editForm').style.visibility = 'hidden';
        document.getElementById('editFormDelete').style.visibility = 'hidden';
    }
    if (document.getElementById('acc').style.visibility == 'visible' && k.key == 'Escape') {
        document.getElementById('acc').style.visibility = 'hidden';
    }

}

document.getElementById('editFormSendBTN').onclick = function () {
    ui.editForm.sendEditData();
}

document.getElementById('editFormDelete').onclick = function () {
    ui.editForm.delete();
}


//BOTON COMANDO DE CAMBIO DE FECHA
document.getElementById('selectDate').onclick = () => {
    var dateIni = document.getElementsByName('selected_date_ini')[0].value;
    var dateEnd = document.getElementsByName('selected_date_end')[0].value;
    dateAndTime.changedateSelected(dateIni, dateEnd);
    apliedFilter = 'RAW';
    document.getElementById('loadBanner').style.visibility = 'visible';
    overMouseDate = { date: dateSelected.dateEnd, show: false };
    backEnd.updateData();
}



//EVENTO DE CAMBIO DE FECHA DE INI_DATE
document.getElementById('ini_date').onchange = function () {
    
    var iniDate = new Date(this.value);
    var today = new Date(dateAndTime.getSystemDate());
    var endDate = new Date(document.getElementById('end_date').value);

    if (iniDate > today) {
        this.value = dateAndTime.getSystemDate();
    }

    if (iniDate > endDate) {
        document.getElementById('end_date').value = this.value;
    }

    if ((endDate - iniDate) > 864000000) {
        let newDate = dateAndTime.timeStamp2String(endDate.getTime() - 864000000).date;
        let formatNewDate = dateAndTime.formatDateSTR2(newDate).replace(/\//g,'-');
        this.value = formatNewDate;
    }

};

document.getElementById('end_date').onchange = function () {
    var iniDate = new Date(document.getElementById('ini_date').value);
    var today = new Date(dateAndTime.getSystemDate());
    var endDate = new Date(document.getElementById('end_date').value);

    if (endDate > today) {
        this.value = dateAndTime.getSystemDate();
    }

    if (endDate < iniDate) {
        document.getElementById('ini_date').value = this.value;
    }

    if ((endDate - iniDate) > 864000000) {
        let newDate = dateAndTime.timeStamp2String(iniDate.getTime() + 864000000).date;
        let formatNewDate = dateAndTime.formatDateSTR2(newDate).replace(/\//g,'-');
        this.value = formatNewDate;
    }


};


//Interfase menú filtros
document.getElementById('filter_mnu').onclick = function (filterMnuItem) {
    var selectionFilter = filterMnuItem.target.innerText;
    //console.log(selectionFilter);
    var update = false;

    if (selectionFilter == 'Limpiar filtros') {
        apliedFilter = 'RAW';
        document.querySelector('#search').value = '';
        update = true;
    }
    else if (selectionFilter == 'Filtrar por Justificadas') {
        apliedFilter = 'JUSTIFICADAS'
        update = true;
    }
    else if (selectionFilter == 'Filtrar por Injustificadas') {
        apliedFilter = 'INJUSTIFICADAS'
        update = true;
    }
    else if (selectionFilter == 'Filtrar por Línea TRIM') {
        apliedFilter = 'TRIM Line'
        update = true;
    }
    else if (selectionFilter == 'Filtrar por Línea CHASIS') {
        apliedFilter = 'CHASIS Line'
        update = true;
    }
    else if (selectionFilter == 'Filtrar por Línea FINAL') {
        apliedFilter = 'FINAL Line'
        update = true;
    }
    else if (selectionFilter == 'Filtrar por Línea PUERTAS') {
        apliedFilter = 'DOOR Line'
        update = true;
    }
    else if (selectionFilter.search('Acumulados') != -1) {
        document.getElementById('acc').style.visibility = 'visible';
        document.getElementById('accFliterShow').innerText = 'Filtro aplicado: ' + apliedFilter;
        acc.createAccTbl();
    }    
    else if (selectionFilter.search('Más...') != -1) {

    }
    else if (selectionFilter.search('Export to SpreadSheet') != -1){
        let tblID = 'dataTbl';
        export2excel.export(tblID, dateSelected.endDate);
    } 

    else if (selectionFilter == 'Time Line GRAPHIC') {
        document.getElementById('chartDiv').style.visibility = 'visible';
        timeLine.createChart();
    }

    else if (selectionFilter.search('Línea de Tiempo') != -1) {

    }


    else {
        apliedFilter = selectionFilter;
        update = true;
    }
    if(update){ tbl.updateRawData(); }

}

document.getElementById('accClose').onclick = function(){
    document.getElementById('acc').style.visibility = 'hidden';
}

document.getElementById('chartClose').onclick = function(){
    document.getElementById('chartDiv').style.visibility = 'hidden';
}





export { ui, apliedFilter };