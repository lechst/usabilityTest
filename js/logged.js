window.onload = function(){

    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:8080/getdata', false);
    req.send('');

    var resp = req.responseText;

    var htmlUserInfo = document.getElementById('userInfo');
    htmlUserInfo.innerHTML = '<p>' + resp + '</p>';

    var sS = document.getElementById("sessionSelect");

    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:8080/getsessions', false);
    req.send('');

    var jsonResp = req.responseText;
    var resp = JSON.parse(jsonResp);

    var session;

    for(var i in resp.sessions){

        session = resp.sessions[i];
        sS.innerHTML += '<option value="'+session+'">'+session+'</option>';

    }

    sS.addEventListener('change', function(){

        var selected = document.forms["sessions"].session.value;

        var req = new XMLHttpRequest();
        req.open('POST', 'http://localhost:8080/session', false);
        req.send(''+selected);

        var jsonResp = req.responseText;
        var resp = JSON.parse(jsonResp);

        var text = '';

        for(var i in resp.rows){

            var newText = JSON.stringify(resp.rows[i].value);
            text += '<p>'+newText+'</p>';

        }

        var htmlEvents = document.getElementById('events');
        htmlEvents.innerHTML = '' + text;

    }, false);

};