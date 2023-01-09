var export2excel = {
    export(tableID, filename = '') {
        let downloadLink;
        let dataType = 'application/vnd.ms-excel';
        const tableSelect = document.getElementById(tableID);

        let newTable = document.createElement('table');
        let header = document.createElement('thead');
        let hRow = document.createElement('tr');
        let tbody = document.createElement('tbody');
        let rows = tableSelect.getElementsByTagName('tr');
        let regDate = '';

        hRow = rows[0].innerHTML;
        hRow = hRow.split('>Date</th>')[0] + '>Date</th><th style="width:8%">Time</th>' + hRow.split('>Date</th>')[1]
        hRow = hRow.split('>Dominio</th>')[0] + '>Dominio</th><th style="width:10%">Station</th>' + hRow.split('>Dominio</th>')[1]
        header.innerHTML = hRow;
        newTable.appendChild(header);

        for (let i = 1; i < rows.length; i++) {
            if (rows[i].style.display != 'none') {
                let cells = rows[i].getElementsByTagName('td');
                let cellsInRow = cells.length - 1;
                let row = document.createElement('tr');

                for (let j = 0; j < cellsInRow; j++) {

                    if (j == 1) {
                        let cellA = document.createElement('td');
                        let cellB = document.createElement('td');
                        cellA.innerHTML = cells[j].innerHTML.split(' ')[0];
                        cellB.innerHTML = cells[j].innerHTML.split(' ')[1];
                        row.appendChild(cellA);
                        row.appendChild(cellB);
                        if (regDate == ''){
                            regDate = cells[j].innerHTML.split(' ')[0];
                            console.log(regDate);
                        }
                    }
                    else if (j == 4) {
                        let cellA = document.createElement('td');
                        let cellB = document.createElement('td');
                        cellA.innerHTML = cells[j].innerHTML
                        if (cellA.innerHTML == 'Mantenimiento') {
                            cellB.innerHTML = 'MANT';
                        }
                        else {
                            let matchStation = cells[2].innerHTML.match(/(VT [0-9]{3}|BLL [0-9]{2}|Vehicle Traking [0-9]{3}|Gestional [0-9]{2})/);
                            if (matchStation != null) {
                                let station = matchStation[0].replace('Vehicle Traking', 'VT');
                                station = station.replace('Gestional', 'BLL');
                                cellB.innerHTML = station;
                            }
                            else {
                                cellB.innerHTML = '';
                            }
                        }

                        row.appendChild(cellA);
                        row.appendChild(cellB);
                    }
                    else {
                        let cell = document.createElement('td');
                        cell.innerHTML = cells[j].innerHTML
                        row.appendChild(cell);
                    }
                }
                tbody.appendChild(row);
            }
        }

        newTable.appendChild(tbody);

        var tableHTML = newTable.outerHTML.replace(/ /g, '%20')
                                            .replace(/#/g, '')
                                            .replace(/á/g, '&aacute;')
                                            .replace(/é/g, '&eacute;')
                                            .replace(/í/g, '&iacute;')
                                            .replace(/ó/g, '&oacute;')
                                            .replace(/ú/g, '&uacute;')
                                            .replace(/Á/g, '&Aacute;')
                                            .replace(/É/g, '&Eacute;')
                                            .replace(/Í/g, '&Iacute;')
                                            .replace(/Ó/g, '&Oacute;')
                                            .replace(/Ú/g, '&Uacute;')
                                            .replace(/ñ/g, '&ntilde;')
                                            .replace(/Ñ/g, '&Ntilde;')
                                            .replace(/°/g, '&ordm;');

        // Specify file name
        //filename = filename ? filename + '.xls' : 'excel_data.xls';
        filename = 'excel_data-' + regDate.replace(/\//g, '-') + '.xls'

        // Create download link element
        downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['ufeff', tableHTML], {
                type: dataType
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
    }
}

export { export2excel }