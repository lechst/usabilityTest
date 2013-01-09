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

        var jsonObj = '{"_id" : "_design/test", "views" : {"events" : {"map" : "function(doc){ emit(doc._id, [doc.type, doc.pageX, doc.pageY])}"}}}';

        var req = new XMLHttpRequest();
        req.open('PUT','http://localhost:8080/db/test/_design/test',true);
        req.send(jsonObj);

    };

    this.addEvent = function(type,event,eventId){

        var req = new XMLHttpRequest();
        req.open('PUT','http://localhost:8080/db/test/events'+eventId,true);
        req.send('{"type":"'+type+'","pageX":"'+event.pageX+'","pageY":"'+event.pageY+'"}');

    };

    this.showEvents = function(eventId){

        var req = new XMLHttpRequest();
        req.open('GET','http://localhost:8080/db/test/_design/test/_view/events',false);
        req.send('');

        var jsonResp = req.responseText;
        var resp = JSON.parse(jsonResp);

        var text = '';

        for(var i=0; i<eventId; i++){

            var newText = resp.rows[i].value[0]+' '+resp.rows[i].value[1]+' '+resp.rows[i].value[2];
            text += '<p>'+newText+'</p>';

        }

        return text;

    };

    this.init();

};