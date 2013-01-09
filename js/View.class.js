View = function(){

    this.init = function(){

        this.htmlShow = document.getElementById('allClicks');

    };

    this.clearShow = function(){

        this.htmlShow.innerHTML = '';

    };

    this.appendShow = function(text){

        this.htmlShow.innerHTML += text;

    };

    this.init();

};