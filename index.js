'use strict';

const model = {
    divPos: [
        {name: 'webDev'},
        {name: 'art'},
        {name: 'resume'},
        {name: 'contact'}
    ]
}

const mv = {
    debounce: function(func, wait, immediate){
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    populateDivPos: function(){
        model.divPos.forEach(o => {
            let pos = $(`#${o.name}`).offset().top;
            o.top = pos;
        });
    }
}

const cv = {
    onPageLoad: function(){
        mv.populateDivPos();
        window.addEventListener('resize', mv.debounce(function() {
            $('main').scrollTop(0);
            mv.populateDivPos();
        }, 250));
        $('main').on('scroll', function() {
            $('.scrollPrompt').hide();
        });
        $('a[href^="#"]').on('click', function(){
            console.log(model.divPos);
            let dest = this.href.split('#', 2)[1];
            let obj = model.divPos.find(o => o.name === dest);
            $('main').animate({ scrollTop: `${obj.top}px`}, 1000);
        });
    }
}

$(cv.onPageLoad());