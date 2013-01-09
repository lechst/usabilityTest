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
        req.open('PUT','http://localhost:8080/db/test',false);
        req.send('');

        var jsonObj = '{"_id" : "_design/test", "views" : {"events" : {"map" : "function(doc){ emit(doc._id, [doc.time, doc.type, doc.pageX, doc.pageY])}"}}}';

        var req = new XMLHttpRequest();
        req.open('PUT','http://localhost:8080/db/test/_design/test',false);
        req.send(jsonObj);

    };

    this.addEvent = function(type,event,eventId){

        var date = new Date();
        var time = date.getTime();
        var req = new XMLHttpRequest();
        req.open('PUT','http://localhost:8080/db/test/event'+eventId,true);
        req.send('{"time":"'+time+'","type":"'+type+'","pageX":"'+event.pageX+'","pageY":"'+event.pageY+'"}');

    };

    this.addManyEvents = function(eventsArray){

        var docsArray = '['+eventsArray[0];

        for(var i=0; i < eventsArray.length; i++){

            docsArray += ','+eventsArray[i];

        }

        docsArray += ']';

        var req = new XMLHttpRequest();
        req.open('POST','http://localhost:8080/db/test/_bulk_docs',false);
        req.setRequestHeader('Content-Type','application/json');
        req.send('{"docs":' + docsArray + '}');

    };

    this.showEvents = function(){

        var req = new XMLHttpRequest();
        req.open('GET','http://localhost:8080/db/test/_design/test/_view/events',false);
        req.send('');

        var jsonResp = req.responseText;
        var resp = JSON.parse(jsonResp);

        var text = '';

        for(var i in resp.rows){

            var newText = resp.rows[i].value[0]+' '+resp.rows[i].value[1]+' '+resp.rows[i].value[2]+' '+resp.rows[i].value[3];
            text += '<p>'+newText+'</p>';

        }

        return text;

    };

    this.init();

};