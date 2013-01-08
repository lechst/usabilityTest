Database = function(){

    this.init = function(){

        var req = new XMLHttpRequest();
        req.open('GET','http://localhost:8080/db/_all_dbs',false);
        req.send('');

        var jsonResp = req.responseText;
        var resp = JSON.parse(jsonResp);
        for(var i=0; i<resp.length; i++){
            if(resp[i]=='test'){
                var req = new XMLHttpRequest();
                req.open('DELETE','http://localhost:8080/db/test',false);
                req.send('');
            }
        }

        var req = new XMLHttpRequest();
        req.open('PUT','http://localhost:8080/db/test',true);
        req.send('');

    };

    this.addEvent = function(type,event,eventId){

        var req = new XMLHttpRequest();
        req.open('PUT','http://localhost:8080/db/test/events'+eventId,true);
        req.send('{"type":"'+type+'","pageX":"'+event.pageX+'","pageY":"'+event.pageY+'"}');

    };

    this.showEvent = function(i){

        var req = new XMLHttpRequest();
        req.open('GET','http://localhost:8080/db/test/events'+i,false);
        req.send('');

        var jsonResp = req.responseText;
        var resp = JSON.parse(jsonResp);

        var text = resp.type+' '+resp.pageX+' '+resp.pageY;

        return text;

    };

    this.init();

};