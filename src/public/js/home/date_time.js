
var dateSelected = {};
var dateAndTime = {
    // OBTIENE FECHA Y HORA DEL SISTEMA
    getSystemDate() {
        var d = new Date();
        var year = (d.getFullYear()).toString();
        var month = (d.getMonth() + 1).toString();
        var day = (d.getDate()).toString();
        var date = year + '-' + this.set2DigitValue(month) + '-' + this.set2DigitValue(day);
        return date;
    },

    getSystemTime() {
        var d = new Date();
        var h = d.getHours().toString();
        var m = d.getMinutes().toString();
        var s = d.getSeconds().toString();
        var time = this.set2DigitValue(h) + ':' + this.set2DigitValue(m) + ':' + this.set2DigitValue(s);
        return time;

    },
    //AYUDA AL FORMATO DE HH:MM:SS (CAMPOS DE DOS DÍGITOS)
    set2DigitValue(val) {
        if (val.length < 2) {
            val = '0' + val;
        }
        return val;
    },
    //FORMAT FECHA 'DD/MM/YYYY'
    formatDateSTR(dateString) {
        var dateSplit = dateString.split('/');
        //console.log(dateSplit);
        var dateF = dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0].slice(2, 4);
        return dateF;
    },

    //FORMAT FECHA 'YYYY/MM/DD'
    formatDateSTR2(dateString) {
        var dateSplit = dateString.split('/');
        //console.log(dateSplit);
        var dateF = dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0];
        return dateF;
    },

    changedateSelected(dateIni, dateEnd){
        dateSelected.dateIni = dateIni;
        dateSelected.dateEnd = dateEnd;
    },

    timeStamp2String(ts){
        var d = new Date(ts);
        var day = this.set2DigitValue(d.getDate().toString());
        var month = this.set2DigitValue((d.getMonth() + 1).toString());
        var year = d.getFullYear().toString();
        var hours = this.set2DigitValue(d.getHours().toString());
        var minutes = this.set2DigitValue(d.getMinutes().toString());
        var seconds = this.set2DigitValue(d.getSeconds().toString());

        return {date: day + '/' + month + '/' + year, time: hours + ':' + minutes + ':' + seconds};
    }

}

// Inicializa fechas a la fecha de carga de la pagina
    dateSelected.dateIni = dateAndTime.getSystemDate();
    dateSelected.dateEnd = dateSelected.dateIni;


export { dateAndTime, dateSelected };