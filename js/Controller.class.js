Controller = function(){

    this.view = new View();
    this.database = new Database();

    this.eventId = 0;

    this.init = function(){

        this.window = window;
        this.show = document.getElementById('showClicks');

        this.bindMouseEvents();

    };

    this.bindMouseEvents = function() {
        this.window.addEventListener('click',this.clickMemo(),false);
        this.show.addEventListener('click',this.showAll(),false);
    };

    this.clickMemo = function(){
        var that = this;
        return function(e){
            e.preventDefault();

            that.eventId++;
            that.database.addEvent("click",e,that.eventId);
        }
    };

    this.showAll = function(){
        var that = this;
        return function(e){
            e.preventDefault();

            that.view.clearShow();

            for(var i=0; i<that.eventId; i++){

                var text = that.database.showEvent(i+1);
                that.view.appendShow(text);

            }

        }
    };

    this.init();

};