window.onload = function(){

    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:8080/getdata', false);
    req.send('');

    var resp = req.responseText;

    var htmlUserInfo = document.getElementById('userInfo');
    htmlUserInfo.innerHTML = '<p>' + resp + '</p>';

    var sS = document.getElementById("sessionSelect");
    sS.addEventListener('change', function(){
        var selected = document.forms["sessions"].session.value;

        var req = new XMLHttpRequest();
        req.open('POST', 'http://localhost:8080/session', false);
        req.send(''+selected);

        var resp = req.responseText;

        var htmlEvents = document.getElementById('events');
        htmlEvents.innerHTML = '' + resp;
    }, false);

};