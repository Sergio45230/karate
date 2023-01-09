document.getElementById('bdy').onload = () => {
    setTimeout(() => {
        let result = document.getElementById('result').textContent;
        if(result.search('ERROR') == -1){
            window.location = '/login';
        }
        else{
            history.go(-1);
        }
    }, 3000);
}