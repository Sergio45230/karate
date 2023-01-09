import { dbConsult } from '../home/backend_if.js';
import { dateSelected } from '../home/date_time.js';

//Inicialización del OBJ de configuración y datos del CHART
let options = {
    series: [],
    chart: {
        height: 250,
        type: 'rangeBar'
    },
    plotOptions: {
        bar: {
            horizontal: true,
            barHeight: '40%',
            rangeBarGroupRows: true
        }
    },
    colors: [],
    fill: {
        type: 'solid'
    },
    xaxis: {
        type: 'datetime',
        labels: {
            datetimeFormatter: {
              year: 'yyyy',
              month: 'MMM \'yy',
              day: 'dd MMM',
              hour: 'HH:mm:ss'
            }
        }
    },
    legend: {
        show: false
    },
    tooltip: {
        enabled: true,
        fixed: {
            enabled: true,
            position: 'bottomLeft',
            offsetX: 50,
            offsetY: 100
        },
        items:{
            display: 'flex',
        },
        x:{
            show: true,
            format: 'HH:mm:ss'
        },
        theme: false,
    },
    theme: {
        mode: 'dark'
    },
    toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true | '<img src="/static/icons/reset.png" width="20">',
          customIcons: []
        },
        export: {
          csv: {
            filename: undefined,
            columnDelimiter: ',',
            headerCategory: 'category',
            headerValue: 'value',
            dateFormatter(timestamp) {
              return new Date(timestamp).toDateString()
            }
          },
          svg: {
            filename: undefined,
          },
          png: {
            filename: undefined,
          }
        },
        autoSelected: 'zoom' 
      },
};

// Definición de métodos
let timeLine = {
    
    createChart() {
        //console.log(dbConsult);
        let chartsData = {};
            chartsData.Chasis = JSON.parse(JSON.stringify(options));

        let lineSlct = '';
        
        let initHour = dbConsult.horarios[dateSelected.dateEnd][0];
        let endHour = dbConsult.horarios[dateSelected.dateEnd][7];
        
        let dbLen = dbConsult.bdatos.length;
        
        let initDateTime = dateSelected.dateEnd + ' ' + initHour;
        let endDateTime = dateSelected.dateEnd + ' ' + endHour;
        
        let initFirstPause = dateSelected.dateEnd + ' ' + dbConsult.horarios[dateSelected.dateEnd][1];
        let endFirstPause = dateSelected.dateEnd + ' ' + dbConsult.horarios[dateSelected.dateEnd][2];
        let initSecondPause = dateSelected.dateEnd + ' ' + dbConsult.horarios[dateSelected.dateEnd][3];
        let endSecondPause = dateSelected.dateEnd + ' ' + dbConsult.horarios[dateSelected.dateEnd][4];
        let initThirdPause = dateSelected.dateEnd + ' ' + dbConsult.horarios[dateSelected.dateEnd][5];
        let endThirdPause = dateSelected.dateEnd + ' ' + dbConsult.horarios[dateSelected.dateEnd][6];
        
        let initSerialDate = {
            Trim: new Date(initDateTime).getTime(),
            Chasis: new Date(initDateTime).getTime(),
            Final: new Date(initDateTime).getTime(),
            Puertas: new Date(initDateTime).getTime()
        };

        let endSerialDate = new Date (endDateTime).getTime();


        let totalStopTime = {
            Trim: 0,
            Chasis: 0,
            Final: 0,
            Puertas: 0
        };
        let lineStopCounter = {
            Trim: 0,
            Chasis: 0,
            Final: 0,
            Puertas: 0
        };

        let alarmGroup = {
            Trim: 'Trim',
            Chasis: 'GanchoGirado',
            Final: 'Final',
            Puertas: 'Lenta_Puertas'
        }
        //Calcula el tiempo de producción programado en segundos
        let totalProduction = parseInt(document.getElementById('imposed').textContent.split(': ')[1]);
        let totalTimeProduction = (endSerialDate - initSerialDate.Chasis) / 1000;
        totalTimeProduction -= (new Date(endFirstPause).getTime() - new Date (initFirstPause).getTime()) / 1000;
        totalTimeProduction -= (new Date(endSecondPause).getTime() - new Date (initSecondPause).getTime()) / 1000;
        totalTimeProduction -= (new Date(endThirdPause).getTime() - new Date (initThirdPause).getTime()) / 1000;
        //Calcula el tiempo por vehículo
        let oneCarTime = totalTimeProduction/totalProduction

        //Inicializa registros para adecuar la visualización de los gráficos ordenadamente (Trim - Chasis - Final)
        let initReg =
        {
            name: 'Produciendo',
            data: [
                {
                    x: 'Trim',
                    y: [
                        initSerialDate['Trim'] - 10800000,
                        initSerialDate['Trim'] - 10801000
                    ],
                },
            ]
        };
        chartsData.Chasis.series.push(initReg);
        chartsData.Chasis.colors.push('#00FF00');

        initReg =
        {
            name: 'Produciendo',
            data: [
                {
                    x: 'Chasis',
                    y: [
                        initSerialDate['Chasis'] - 10800000,
                        initSerialDate['Chasis'] - 10801000
                    ],
                },
            ]
        };
        chartsData.Chasis.series.push(initReg);
        chartsData.Chasis.colors.push('#00FF00');
        
        initReg =
        {
            name: 'Produciendo',
            data: [
                {
                    x: 'Final',
                    y: [
                        initSerialDate['Final'] - 10800000,
                        initSerialDate['Final'] - 10801000
                    ],
                },
            ]
        };
        chartsData.Chasis.series.push(initReg);
        chartsData.Chasis.colors.push('#00FF00');

        initReg =
        {
            name: 'Produciendo',
            data: [
                {
                    x: 'Puertas',
                    y: [
                        initSerialDate['Final'] - 10800000,
                        initSerialDate['Final'] - 10801000
                    ],
                },
            ]
        };
        chartsData.Chasis.series.push(initReg);
        chartsData.Chasis.colors.push('#00FF00');


        //Recorre los registros de la base de datos buscando las paradas de línea.
        for (let i = 0; i < dbLen; i++) {
            let reg = dbConsult.bdatos[i];

            lineSlct = reg.Message.split(' ')[0];

            if (reg.Message.search('STOP') != -1 && reg.miliseg > 3000 && new Date(reg.EventTimeStamp).getTime() > initSerialDate[lineSlct]) {

                //Prepara texto de referencia
                let txtRef = ' - Hora: ' + reg.horaI + ' - Duración: ' + reg.diferencia + ' - Perdida: ' + ((reg.miliseg/1000)/oneCarTime).toFixed(1);

                //Obtiene la hora de la parada.
                let hourStopReference = new Date(dateSelected.dateEnd + ' ' + reg.horaI).getTime();

                //Incrementa los totalizadores
                totalStopTime[lineSlct] += reg.miliseg/1000;
                
                lineStopCounter[lineSlct]++;
                
                // Busca la causa de la parada en +30 -30 registros con una diferencia de tiempo de ocurerncia de 7 segundos.
                for(let j = i - 30; j < i + 30 && j < dbLen; j++){
                    if(j < 0){j = 0}
                    let auxReg = dbConsult.bdatos[j];

                    let hourStop = new Date(dateSelected.dateEnd + ' ' + auxReg.horaI).getTime();

                    let timeDiff = Math.abs(hourStop - hourStopReference);
                    
                    if(timeDiff < 7000 && auxReg.GroupPath.search(alarmGroup[lineSlct]) != -1 && auxReg.Message.search('STOP') == -1){
                        txtRef = auxReg.Message + '\r\n' + txtRef;
                    }
                }
                // Conforma variable de ingreso de evento al chart - Fin Produciendo
                let chartReg =
                                {
                                    name: 'Produciendo',
                                    data: [
                                        {
                                            x: lineSlct,
                                            y: [
                                                initSerialDate[lineSlct] - 10800000,
                                                new Date(reg.EventTimeStamp).getTime() - 10800000
                                            ],
                                        },
                                    ]
                                };
                // Conforma variable de ingreso de evento al chart - Inicio de parada
                let chartRegStop =
                                {
                                    name: 'Línea detenida ' + txtRef,
                                    data: [
                                        {
                                            x: lineSlct,
                                            y: [
                                                new Date(reg.EventTimeStamp).getTime() - 10800000,
                                                new Date(reg.EventTimeStamp).getTime() + reg.miliseg - 10800000
                                            ],
                                        },
                                    ]
                                }
                //Recalcula próximo inicio de producción
                initSerialDate[lineSlct] = new Date(reg.EventTimeStamp).getTime() + reg.miliseg;
                //Carga variables en las series del chart.
                chartsData.Chasis.series.push(chartReg);
                chartsData.Chasis.series.push(chartRegStop);
                chartsData.Chasis.colors.push('#00FF00');
                chartsData.Chasis.colors.push('#FF0000');

            }
        };
        let lines = ['Trim', 'Chasis', 'Final', 'Puertas'];

        for (let i=0; i < lines.length; i++){
            //Variable que grafica tramo desde ultima parada hasta hora actual.
            let chartReg =
            {
                name: 'Produciendo',
                data: [
                    {
                        x: lines[i],
                        y: [
                            initSerialDate[lines[i]] - 10800000,
                            new Date().getTime() - 10800000
                        ],
                    },
                ]
            };
            //Para días productivos y dentro del horario de producción
            
            if(endSerialDate > new Date().getTime() /*&& new Date(initSerialDate[lines[i]]).getDate() == new Date().getDate && new Date(initSerialDate[lines[i]]).getMonth() == new Date().getMonth()*/){
                chartsData.Chasis.series.push(chartReg);
                chartsData.Chasis.colors.push('#00FF00');
            }
            //Fuera del horario productivo reemplaza hora actual con hora fin producción.
            else{
                chartReg.data[0].y[1] = endSerialDate - 10800000;
                chartsData.Chasis.series.push(chartReg);
                chartsData.Chasis.colors.push('#00FF00');
            }
            //Grafica el tiempo restante
            chartReg =
            {
                name: 'Tiempo restante',
                data: [
                    {
                        x: lines[i],
                        y: [
                            new Date().getTime() - 10800000,
                            endSerialDate - 10800000
                        ],
                    },
                ]
            }

            if (endSerialDate > new Date().getTime()){
                chartsData.Chasis.series.push(chartReg);
                chartsData.Chasis.colors.push('#AAAAAA');
            }

            //Grafica las pausas
            chartReg =
            {
                name: 'Pausa 1',
                data: [
                    {
                        x: lines[i],
                        y: [
                            new Date(initFirstPause).getTime() - 10800000,
                            new Date(endFirstPause).getTime() - 10800000
                        ],
                    },
                ]
            }
            chartsData.Chasis.series.push(chartReg);
            chartsData.Chasis.colors.push('#4E89FF');

            chartReg =
            {
                name: 'Pausa 2',
                data: [
                    {
                        x: lines[i],
                        y: [
                            new Date(initSecondPause).getTime() - 10800000,
                            new Date(endSecondPause).getTime() - 10800000
                        ],
                    },
                ]
            }
            chartsData.Chasis.series.push(chartReg);
            chartsData.Chasis.colors.push('#4E89FF');

            chartReg =
            {
                name: 'Pausa 3',
                data: [
                    {
                        x: lines[i],
                        y: [
                            new Date(initThirdPause).getTime() - 10800000,
                            new Date(endThirdPause).getTime() - 10800000
                        ],
                    },
                ]
            }
            chartsData.Chasis.series.push(chartReg);
            chartsData.Chasis.colors.push('#4E89FF');

            if((new Date(endDateTime).getTime() - new Date(initDateTime).getTime()) > 30000000){
                chartReg =
                {
                    name: 'Pausa 4',
                    data: [
                        {
                            x: lines[i],
                            y: [
                                new Date(dateSelected.dateEnd + ' ' + dbConsult.horarios[dateSelected.dateEnd][8]).getTime() - 10800000,
                                new Date(dateSelected.dateEnd + ' ' + dbConsult.horarios[dateSelected.dateEnd][9]).getTime() - 10800000
                            ],
                        },
                    ]
                }
                chartsData.Chasis.series.push(chartReg);
                chartsData.Chasis.colors.push('#4E89FF');
    
            }

            //Conforma variable de config completa para gráfico
            chartsData.Chasis.xaxis.min = new Date(initDateTime).getTime() - 11100000
            chartsData.Chasis.xaxis.max = new Date(endDateTime).getTime() - 10500000
        };
        //Borra gráfico antigüo, si existe.
            document.getElementById('chartsGraph').innerHTML = '';
        //Genera grafico
        let chart = new ApexCharts(document.querySelector("#chartsGraph"), chartsData.Chasis);
        chart.render();

        //Escribe info
        document.getElementById('trimChartInfo').innerText = 'TRIM - Cantidad de paradas: ' + lineStopCounter.Trim + ' - Tiempo acumulado: ' + totalStopTime.Trim.toFixed(0) + ' seg. - Pérdida teórica: ' + (totalStopTime.Trim/oneCarTime).toFixed(1) + ' vehículos.';
        document.getElementById('chasisChartInfo').innerText = 'CHASIS - Cantidad de paradas: ' + lineStopCounter.Chasis + ' - Tiempo acumulado: ' + totalStopTime.Chasis.toFixed(0) + ' seg. - Pérdida teórica: ' + (totalStopTime.Chasis/oneCarTime).toFixed(1) + ' vehículos.';
        document.getElementById('finalChartInfo').innerText = 'FINAL - Cantidad de paradas: ' + lineStopCounter.Final + ' - Tiempo acumulado: ' + totalStopTime.Final.toFixed(0) + ' seg. - Pérdida teórica: ' + (totalStopTime.Final/oneCarTime).toFixed(1) + ' vehículos.';
        document.getElementById('puertasChartInfo').innerText = 'PUERTAS - Cantidad de paradas: ' + lineStopCounter.Puertas + ' - Tiempo acumulado: ' + totalStopTime.Puertas.toFixed(0) + ' seg. - Pérdida teórica: ' + (totalStopTime.Puertas/oneCarTime).toFixed(1) + ' vehículos.';
    }
};


export { timeLine };
