let dateAndTime = {
    getCurrentDate() {
        let currentDate = new Date();
        let day = twoDigitsString(currentDate.getDate());
        let month = twoDigitsString(currentDate.getMonth() + 1);
        let year = currentDate.getFullYear();

        return day + '-' + month + '-' + year;
    },
    getCurrentDateYYYYmmdd(){
        let currentDate = new Date();
        let day = twoDigitsString(currentDate.getDate());
        let month = twoDigitsString(currentDate.getMonth() + 1);
        let year = currentDate.getFullYear();

        return year + '-' + month + '-' + day;

    }
}

module.exports = dateAndTime;

function twoDigitsString(number){
    let res = number.toString()
    if(number < 10){
        res = '0' + res;
    }
    return res;
}