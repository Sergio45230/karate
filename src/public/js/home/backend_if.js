import { ui } from './ui.js';
import { tbl } from './html_table_manager.js';
import { dateSelected } from './date_time.js';

var dbConsult;
var production;

var backEnd = {

    getData() {
        var postReq = new XMLHttpRequest();

        document.getElementsByName('selected_date_ini')[0].value = dateSelected.dateIni;
        document.getElementsByName('selected_date_end')[0].value = dateSelected.dateEnd;

        postReq.open('POST', "/api/get_data_base", true);
        postReq.setRequestHeader("Content-Type", "application/json");
        postReq.responseType = 'json';

        postReq.onload = () => {
            dbConsult = postReq.response;
            if (dbConsult != null) {
                document.getElementById("loadBanner").style.visibility = "hidden"
                //console.log(dbConsult);
                ui.editForm.createOptions();
                tbl.createViewRawData();
                ui.writeGeneralData();
                this.requestProdInfoFromServer();
            }
            else {
                window.location = '/login';
            }
        }
        postReq.send(JSON.stringify({ db: 'PLU', dateReq: dateSelected }));
    },

    updateData() {
        document.getElementById('updateText').style.visibility = 'visible';

        var postReq = new XMLHttpRequest();

        postReq.open('POST', "/api/get_data_base", true);
        postReq.setRequestHeader("Content-Type", "application/json");
        postReq.responseType = 'json';

        postReq.onload = () => {
            dbConsult = postReq.response;
            if (dbConsult != null) {
                document.getElementById("loadBanner").style.visibility = "hidden"
                //console.log(dbConsult);
                tbl.updateRawData();
                ui.updateGrapics();
                document.getElementById('updateText').style.visibility = 'hidden';
            }
            else {
                window.location = '/login';
            }
        }
        postReq.send(JSON.stringify({ db: 'PLU', dateReq: dateSelected }));
    },

    sendEditedRowInfo(rowInfo) {
        var req = new XMLHttpRequest();
        req.open('POST', "/api/save_user_excuse", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.responseType = 'text';

        req.onload = function () {
            let writeResponse = req.response;
            let res;
            
            if (writeResponse == 'OK') {
                res = true;
            }
            else {
                res = false;
            }
            ui.editForm.updateResponseSendEditData(res, rowInfo);
        }
        req.send(JSON.stringify(rowInfo));
    },
    updateDbInfo(dbInfo, i) {
        for (var p in dbInfo) {
            dbConsult.bdatos[i][p] = dbInfo[p];
        }
    },

    requestProdInfo() {
        return production;
    },

    requestProdInfoFromServer() {
        var postReq = new XMLHttpRequest();

        postReq.open('POST', "/api/get_extra_info", true);
        postReq.setRequestHeader("Content-Type", "application/json");
        postReq.responseType = 'json';

        postReq.onload = () => {
            production = postReq.response;
            if (!production.inProduction) {
                if (dbConsult != undefined) {
                    production = findDayProduction();
                }
            }

        }
        postReq.send(JSON.stringify({ db: 'PLU' }));

    }
}

function findDayProduction() {
    for (var i = dbConsult.bdatos.length - 1; i > -1; i--) {
        if (dbConsult.bdatos[i].Message.search('Day production:') != -1) {
            var msg = dbConsult.bdatos[i].Message

            //msg => 'Day production: | imposed:308 | teoric:050 | real:052'

            var production = {
                imposed: msg.split(' | ')[1].split(':')[1],
                teoric: msg.split(' | ')[2].split(':')[1],
                real: msg.split(' | ')[3].split(':')[1],
                inProduction: false
            };
            return production;
        }

    }
}

export { backEnd, dbConsult };