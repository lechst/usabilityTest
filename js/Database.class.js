Database = function(){

    this.path = 'http://localhost:8080/db';
    this.application = 'utdb001';
    this.user = 'name=utdb001&password=1234';
    this.session = '';

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

        var date = new Date();
        var time = date.getTime();
        var rn = Math.floor((Math.random()*100000)+100000);

        this.session += time;
        this.session += rn;

        var req = new XMLHttpRequest();
        req.open('POST', this.path + '/_session', false);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.send(this.user);

    };

    this.addEvent = function(jsonEvent,eventId){

        var req = new XMLHttpRequest();
        req.open('PUT', this.path + '/' + this.application + '/' + this.session + '' + eventId, true);
        req.send(jsonEvent);

    };

    this.addManyEvents = function(eventsArray){

        var docsArray = '['+eventsArray[0];

        for(var i=0; i < eventsArray.length; i++){

            docsArray += ','+eventsArray[i];

        }

        docsArray += ']';

        var req = new XMLHttpRequest();
        req.open('POST', this.path + '/' + this.application + '/_bulk_docs', false);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send('{"docs":' + docsArray + '}');

    };

    this.showEvents = function(){

        var req = new XMLHttpRequest();
        req.open('GET', this.path + '/' + this.application + '/_design/' + this.application + '/_view/sessions', false);
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