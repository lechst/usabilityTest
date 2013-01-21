Controller = function(){

    this.view = new View();
    this.database = new Database();

    this.eventId = 1000000;
    this.eventsArray = [];

    this.init = function(){

        this.window = window;
        this.show = document.getElementById('showClicks');
        this.show.addEventListener('click',this.showAll(),false);

        for(var type in this.database.eventsLists){
            this[type+'Bind'](type);
        }

    };

    for(var type in this.database.eventsLists){

        this[type+'Bind'] = function(type) {
            for(var event in this.database.eventsLists[type]){
                this.window.addEventListener(event,this[type+'Memo'](type,event),false);
                //this.window.addEventListener(event,this[type+'MemoMany'](event),false);
            }
        };

        this[type+'Memo'] = function(type,event){
            var that = this;
            return function(e){
                //e.preventDefault();

                var jsonEvent = '{';

                jsonEvent += '"session":"' + that.database.session + '",';

                for(var i=0; i<that.database.eventsLists[type][event].length; i++){
                    if(typeof that.database.eventsLists[type][event][i] === 'string'){
                        jsonEvent += '"'+that.database.eventsLists[type][event][i]+'":"'+e[that.database.eventsLists[type][event][i]]+'",';
                    }
                    else {
                        jsonEvent += '"'+that.database.eventsLists[type][event][i][0]+'.'+that.database.eventsLists[type][event][i][1]+'":"'+e[that.database.eventsLists[type][event][i][0]][that.database.eventsLists[type][event][i][1]]+'",';
                    }
                }

                jsonEvent = jsonEvent.substring(0,jsonEvent.length-1);
                jsonEvent += '}';

                that.database.addEvent(jsonEvent,that.eventId);
                that.eventId++;
            }
        };

        this[type+'MemoMany'] = function(event){
            var that = this;
            return function(e){
                //e.preventDefault();

                var n = 100;

                var jsonEvent = '{';

                jsonEvent += '"_id":"' + that.database.session + '' + that.eventId + '",';
                jsonEvent += '"session":"' + that.database.session + '",';

                for(var i=0; i<that.database.eventsLists[type][event].length; i++){
                    if(typeof that.database.eventsLists[type][event][i] === 'string'){
                        jsonEvent += '"'+that.database.eventsLists[type][event][i]+'":"'+e[that.database.eventsLists[type][event][i]]+'",';
                    }
                    else {
                        jsonEvent += '"'+that.database.eventsLists[type][event][i][0]+'.'+that.database.eventsLists[type][event][i][1]+'":"'+e[that.database.eventsLists[type][event][i][0]][that.database.eventsLists[type][event][i][1]]+'",';
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
    }

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