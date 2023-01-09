var lastType;
var lastStation;

document.getElementById('bdy').onload = function () {
    setInterval(() => {
        updateStatus();
    }, 250);
}

function updateStatus() {

    var postReq = new XMLHttpRequest();

    postReq.open('POST', "/api/line_st", true);
    postReq.setRequestHeader("Content-Type", "application/json");
    postReq.responseType = 'json';

    postReq.onload = () => {
        var st = postReq.response;
        //console.log(postReq.response);
        refresh(st)
    }
    postReq.send(JSON.stringify({ user: 'PLU' }));
}

function refresh(st){
    if ((st.lineStatus == 'running') || st.lineStatus == 'paused'){
        document.getElementById('chasis').classList.remove('blink');
        document.getElementById('chasis').style.backgroundColor = 'green';
        document.getElementById('bdy').style.backgroundColor = 'green';
        document.getElementById('chasis').style.color = 'black';
    
        classShowToggler('last_info', 'visible');
        classShowToggler('info', 'hidden');
        
    }
    else{
        document.getElementById('chasis').classList.add('blink');
        document.getElementById('chasis').style.backgroundColor = 'red';
        document.getElementById('bdy').style.backgroundColor = 'red';
        document.getElementById('chasis').style.color = 'black';
        
        classShowToggler('last_info', 'hidden');
        classShowToggler('info', 'visible');
        

        lastType = st.stopedStationType;
        lastStation = st.stopedStationNumber;

    }

    document.getElementById('status').textContent = 'Chasis: ' + st.lineStatus;
    document.getElementById('st_type').textContent = st.stopedStationType;
    document.getElementById('station').textContent = st.stopedStationNumber;
    document.getElementById('time').textContent = st.downtime + ' seg';

    document.getElementById('lastStationType').textContent = st.lastStopedStationType;
    document.getElementById('lastStation').textContent = st.lastStopedStationNumber;
    document.getElementById('lastTime').textContent = st.lastTime + ' seg';

}


function classShowToggler(className, toStatus){
    var elements = document.getElementsByClassName(className)

    for(var i = 0 ; i < elements.length; i++){
        var element = elements[i];
        element.style.visibility = toStatus;
    };
}