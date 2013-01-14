Database = function(){

    this.eventsLists = {
        "windowEvents": {
            "load": ["type","timeStamp","target",["target","innerHeight"],["target","innerWidth"]],
            "unload": ["type","timeStamp","target",["target","innerHeight"],["target","innerWidth"]],
            "resize": ["type","timeStamp","target",["target","innerHeight"],["target","innerWidth"]]
        },
        "formEvents": {},
        "keyboardEvents": {},
        "mouseEvents": {
            "click": ["type","timeStamp",["target","id"],"pageX","pageY"],
            "dblclick": ["type","timeStamp",["target","id"],"pageX","pageY"],
            "mousedown": ["type","timeStamp",["target","id"],"pageX","pageY"],
            "mousemove": ["type","timeStamp",["target","id"],"pageX","pageY"],
            "mouseover": ["type","timeStamp",["target","id"],"pageX","pageY"],
            "mouseout": ["type","timeStamp",["target","id"],"pageX","pageY"],
            "mouseup": ["type","timeStamp",["target","id"],"pageX","pageY"]
        },
        "mediaEvents": {},
        "touchEvents": {},
        "gestureEvents": {},
        "orientationEvents": {}
    };

    this.init = function(){

        var req = new XMLHttpRequest();
        req.open('GET','http://localhost:8080/db/_all_dbs',false);
        req.send('');

        var jsonResp = req.responseText;
        var resp = JSON.parse(jsonResp);
        for(var i=0; i<resp.length; i++){
            if(resp[i]=='events'){
                var req = new XMLHttpRequest();
                req.open('DELETE','http://localhost:8080/db/events',false);
                req.send('');
            }
        }

        var req = new XMLHttpRequest();
        req.open('PUT','http://localhost:8080/db/events',false);
        req.send('');

        var jsonObj = '{"_id" : "_design/events", "views" : {"events" : {"map" : "function(doc){ emit(doc.timeStamp, doc)}"}}}';

        var req = new XMLHttpRequest();
        req.open('PUT','http://localhost:8080/db/events/_design/events',false);
        req.send(jsonObj);

    };

    this.addEvent = function(jsonEvent,eventId){

        var req = new XMLHttpRequest();
        req.open('PUT','http://localhost:8080/db/events/event'+eventId,true);
        req.send(jsonEvent);

    };

    this.addManyEvents = function(eventsArray){

        var docsArray = '['+eventsArray[0];

        for(var i=0; i < eventsArray.length; i++){

            docsArray += ','+eventsArray[i];

        }

        docsArray += ']';

        var req = new XMLHttpRequest();
        req.open('POST','http://localhost:8080/db/events/_bulk_docs',false);
        req.setRequestHeader('Content-Type','application/json');
        req.send('{"docs":' + docsArray + '}');

    };

    this.showEvents = function(){

        var req = new XMLHttpRequest();
        req.open('GET','http://localhost:8080/db/events/_design/events/_view/events',false);
        req.send('');

        var jsonResp = req.responseText;
        var resp = JSON.parse(jsonResp);

        var text = '';

        for(var i in resp.rows){

            var newText = JSON.stringify(resp.rows[i].value);
            text += '<p>'+newText+'</p>';

        }

        return text;

    };

    this.init();

};