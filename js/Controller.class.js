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
        //this.window.addEventListener('click',this.clickMemo(),false);
        this.window.addEventListener('click',this.clickMemoMany(),false);
        this.show.addEventListener('click',this.showAll(),false);
    };

    this.clickMemo = function(){
        var that = this;
        return function(e){
            e.preventDefault();

            that.database.addEvent("click",e,that.eventId);
            that.eventId++;
        }
    };

    this.clickMemoMany = function(){
        var that = this;
        return function(e){
            e.preventDefault();

            var n = 3;
            var date = new Date();
            var time = date.getTime();

            that.eventsArray[that.eventId % n] = '{"_id":"event'+that.eventId+'","time":"'+time+'","type":"click","pageX":"'+e.pageX+'","pageY":"'+e.pageY+'"}';
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