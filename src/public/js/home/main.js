import { ui } from './ui.js';
import { backEnd } from './backend_if.js';
import { acc } from './acc.js';

var cellInfo = {
    RAW: { headers: ['Pos', 'Date', 'Description', 'Time', 'Dominio', '4M', 'Causal', 'Commentary', 'Responsable', 'DateComment', 'EventID'], width: [1, 8, 30, 4, 3, 10, 10, 20, 5, 4, 0] },
    MSG: { headers: '', width: [1, 50, 10, 10] },
    CAUSAL: { headers: '', width: [1, 50, 10, 10] }
}

//Actualización de Base de Datos
setInterval(() => {
    backEnd.updateData();

}, 300000);

//Actualización de elementos dinámicos
setInterval(() => {
    ui.dinamicUpdate();
}, 500);

//Actualización de valores dinamicos. Requerimiento al servidor.
setInterval(() => {
    backEnd.requestProdInfoFromServer();
}, 20000);


//Carga de datos inicial
document.getElementById("bdy").onload = () => {
    document.getElementById("loadBanner").style.visibility = "visible"
    backEnd.getData();
}

export { cellInfo };
