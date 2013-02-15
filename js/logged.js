window.onload = function(){

    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:8080/getdata', false);
    req.send('');

    var resp = req.responseText;

    var htmlUserSpace = document.getElementById('userSpace');
    htmlUserSpace.innerHTML = '<p>' + resp + '</p>';

};