const { statusCode, message } = JSON.parse(localStorage.getItem("response"));
document.getElementById("errorCode").innerHTML = statusCode;
document.getElementById("Code").innerHTML = statusCode;
document.getElementById("errorDescription").innerHTML = message;

var str = document.getElementsByTagName('div')[0].innerHTML.toString();
var i = 0;
document.getElementsByTagName('div')[0].innerHTML = "";

setTimeout(function() {
    var se = setInterval(function() {
        i++;
        document.getElementsByTagName('div')[0].innerHTML = str.slice(0, i) + "|";
        if (i == str.length) {
            clearInterval(se);
            document.getElementsByTagName('div')[0].innerHTML = str;
        }
    }, 10);
},0);

