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
        let currentVW = $(window).width();
        model.divPos.forEach(o => {
            let pos = $(`#${o.name}`).offset().top;
            if(currentVW < 600){
                pos -= 120;
            }
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
        $('form').submit(function(e) {
            e.preventDefault();
            let obj = {};
            obj.name = $('#name').val();
            obj.email = $('#email').val();
            obj.message = $('#message').val();
            $.ajax({
                url: '/email', 
                method: 'POST',  
                data: JSON.stringify(obj),  
                contentType:"application/json",
                dataType: 'json',
                beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json')},
                success: cv.formSuccess,
                error: cv.formError
            });
        });
        $('.formBox').on('click', 'button', function(e){
            e.stopPropagation();
            $(`.${e.currentTarget.parentNode.className}`).hide();
        });
    },
    formSuccess: function(o){
        cv.resetForm();
        $('.success').show();
    },
    formError: function(e){
        cv.resetForm();
        $('.formerror').show();
    },
    resetForm: function(){
        $('#name').val('');
        $('#email').val('');
        $('#message').val('');
    }
}

$(cv.onPageLoad());