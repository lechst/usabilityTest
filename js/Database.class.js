Database = function(){

    var path = 'http://192.168.181.1:8080/db';

    this.eventsLists = {
        "windowEvents": {
            "load": ["type","timeStamp","target",["target","innerHeight"],["target","innerWidth"]],
            "unload": ["type","timeStamp","target",["target","innerHeight"],["target","innerWidth"]],
            "resize": ["type","timeStamp","target",["target","innerHeight"],["target","innerWidth"]]
        },
        //"formEvents": {},
        //"keyboardEvents": {},
        "mouseEvents": {
            "click": ["type","timeStamp",["target","id"],"pageX","pageY"],
            "dblclick": ["type","timeStamp",["target","id"],"pageX","pageY"],
            "mousedown": ["type","timeStamp",["target","id"],"pageX","pageY"],
            //"mousemove": ["type","timeStamp",["target","id"],"pageX","pageY"],
            "mouseover": ["type","timeStamp",["target","id"],"pageX","pageY"],
            "mouseout": ["type","timeStamp",["target","id"],"pageX","pageY"],
            "mouseup": ["type","timeStamp",["target","id"],"pageX","pageY"],
            "mousewheel": ["type","timeStamp",["target","id"],"pageX","pageY"]
        },
        //"mediaEvents": {},
        "touchEvents": {
            "touchstart": ["type","timeStamp",["target","id"],"pageX","pageY"],
            //"touchmove": ["type","timeStamp",["target","id"],"pageX","pageY"],
            "touchend": ["type","timeStamp",["target","id"],"pageX","pageY"],
            "touchcancel": ["type","timeStamp",["target","id"],"pageX","pageY"]
        },
        "gestureEvents": {
            "gesturestart": ["type","timeStamp",["target","id"],"rotation","scale"],
            "gesturechange": ["type","timeStamp",["target","id"],"rotation","scale"],
            "gestureend": ["type","timeStamp",["target","id"],"rotation","scale"]
        },
        "orientationEvents": {
            "orientationchange": ["type","timeStamp","target",["target","innerHeight"],["target","innerWidth"],"orientation"]
        }
    };

    this.init = function(){

        var req = new XMLHttpRequest();
        req.open('GET',path+'/_all_dbs',false);
        req.send('');

        var jsonResp = req.responseText;
        var resp = JSON.parse(jsonResp);
        for(var i=0; i<resp.length; i++){
            if(resp[i]=='events'){
                var req = new XMLHttpRequest();
                req.open('DELETE',path+'/events',false);
                req.send('');
            }
        }

        var req = new XMLHttpRequest();
        req.open('PUT',path+'/events',false);
        req.send('');

        var jsonObj = '{"_id" : "_design/events", "views" : {"events" : {"map" : "function(doc){ emit(doc.timeStamp, doc)}"}}}';

        var req = new XMLHttpRequest();
        req.open('PUT',path+'/events/_design/events',false);
        req.send(jsonObj);

    };

    this.addEvent = function(jsonEvent,eventId){

        var req = new XMLHttpRequest();
        req.open('PUT',path+'/events/event'+eventId,true);
        req.send(jsonEvent);

    };

    this.addManyEvents = function(eventsArray){

        var docsArray = '['+eventsArray[0];

        for(var i=0; i < eventsArray.length; i++){

            docsArray += ','+eventsArray[i];

        }

        docsArray += ']';

        var req = new XMLHttpRequest();
        req.open('POST',path+'/events/_bulk_docs',false);
        req.setRequestHeader('Content-Type','application/json');
        req.send('{"docs":' + docsArray + '}');

    };

    this.showEvents = function(){

        var req = new XMLHttpRequest();
        req.open('GET',path+'/events/_design/events/_view/events',false);
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