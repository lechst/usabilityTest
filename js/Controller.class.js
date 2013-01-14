Controller = function(){

    this.view = new View();
    this.database = new Database();

    this.eventId = 0;
    this.eventsArray = [];

    this.init = function(){

        this.window = window;
        this.show = document.getElementById('showClicks');

        this.bindMouseEvents();

    };

    this.bindMouseEvents = function() {
        for(var event in this.database.eventsLists.mouseEvents){
            //this.window.addEventListener(event,this.memoEvent(event),false);
            this.window.addEventListener(event,this.memoManyEvents(event),false);
        }
        this.show.addEventListener('click',this.showAll(),false);
    };

    this.memoEvent = function(event){
        var that = this;
        return function(e){
            e.preventDefault();

            var jsonEvent = '{';

            for(var i=0; i<that.database.eventsLists.mouseEvents[event].length; i++){
                if(typeof that.database.eventsLists.mouseEvents[event][i] === 'string'){
                    jsonEvent += '"'+that.database.eventsLists.mouseEvents[event][i]+'":"'+e[that.database.eventsLists.mouseEvents[event][i]]+'",';
                }
                else {
                    jsonEvent += '"'+that.database.eventsLists.mouseEvents[event][i][0]+'.'+that.database.eventsLists.mouseEvents[event][i][1]+'":"'+e[that.database.eventsLists.mouseEvents[event][i][0]][that.database.eventsLists.mouseEvents[event][i][1]]+'",';
                }
            }

            jsonEvent = jsonEvent.substring(0,jsonEvent.length-1);
            jsonEvent += '}';

            that.database.addEvent(jsonEvent,that.eventId);
            that.eventId++;
        }
    };

    this.memoManyEvents = function(event){
        var that = this;
        return function(e){
            e.preventDefault();

            var n = 100;

            var jsonEvent = '{';

            jsonEvent += '"_id":"event'+that.eventId+'",';

            for(var i=0; i<that.database.eventsLists.mouseEvents[event].length; i++){
                if(typeof that.database.eventsLists.mouseEvents[event][i] === 'string'){
                    jsonEvent += '"'+that.database.eventsLists.mouseEvents[event][i]+'":"'+e[that.database.eventsLists.mouseEvents[event][i]]+'",';
                }
                else {
                    jsonEvent += '"'+that.database.eventsLists.mouseEvents[event][i][0]+'.'+that.database.eventsLists.mouseEvents[event][i][1]+'":"'+e[that.database.eventsLists.mouseEvents[event][i][0]][that.database.eventsLists.mouseEvents[event][i][1]]+'",';
                }
            }

            jsonEvent = jsonEvent.substring(0,jsonEvent.length-1);
            jsonEvent += '}';

            that.eventsArray[that.eventId % n] = jsonEvent;
            that.eventId++;

            if(that.eventId % n == 0){
                that.database.addManyEvents(that.eventsArray);
            }
        }
    };

    this.showAll = function(){
        var that = this;
        return function(e){
            e.preventDefault();

            that.view.clearShow();

            var text = that.database.showEvents();
            that.view.appendShow(text);
        }
    };

    this.init();

};