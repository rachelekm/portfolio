'use strict';

const model = {
    divPos: [
        {name: 'webDev'},
        {name: 'art'},
        {name: 'resume'},
        {name: 'contact'}
    ],
    webProjects: [
        {name: 'Blue Dot Crafts',
        tech: ['HTML', 'CSS', 'JS', 'jQuery', 'Shopify Liquid', 'Node.js', 'Express', 'MongoDB', 'AWS S3', 'Autodesk SketchBook'],
        text: 'This is a side project, currently active on Shopify with back-end API deployed on Heroku. All graphics created with Sketchbook. Users can desgin a custom map embroidery pattern by choosing a location, map style, shape, size, or by adding text. After purchase, their embroidery pattern is generated as part of a custom PDF, inlcuding: dynamic instructions, color guides, and stitch guides. After the PDF is built and stored, the customer is automatically emailed a private download link for their custom pattern PDF, available for 24 hours.',
        img_alt: 'Blue Dot Crafts Mobile And Desktop Website',
        img_url: 'imgs/tempImage.jpg',
        link: 'https://bluedotcrafts.com/'},
        {name: 'Parks & Rex App',
        tech: ['HTML', 'CSS', 'JS', 'jQuery', 'Autodesk SketchBook'],
        text: 'This is a personal project, I developed a recommendation application for fossil-collecting. A geology major and former environmental educator, I wanted to create an easy, interactive way to learn about local geologic history for educational contexts and amateur naturalists. Users submit their address and preferred search radius, and ten public parks are recommended and displayed along with local fossil and geologic history. Park recommendations are made based on local prominence and distance. All graphics created with Sketchbook.',
        img_alt: 'Parks & Rex Mobile And Desktop Website',
        img_url: 'imgs/tempImage.jpg',
        link: 'https://github.com/rachelekm/ParksAndRex'},
        {name: 'Goodnight App',
        tech: ['HTML', 'CSS', 'JS', 'jQuery', 'Node.js', 'Express', 'Mocha/Chai', 'Passport.js', 'MongoDB', 'Mongoose', 'Autodesk SketchBook'],
        text: "This is a personal project, I developed a diary application for better dream journaling: users create an account to enter dreams; view their previous entries; search by tags, life events, emotion; or use the interactive homepage calendar to discover relationships between their dream life and waking life. Featues: CRUD application (add new dream, read all dreams, update, delete); enter a unique dream once per day; search dreams by keywords, moods, or content; see most commonly dreamt symbols in the last 30 days and interact with homepage calendar. All graphics created with Sketchbook.",
        img_alt: 'Goodnight App Mobile And Desktop Website',
        img_url: 'imgs/tempImage.jpg',
        link: 'https://github.com/rachelekm/GoodnightApp/blob/master/README.md'},
        {name: 'Egg Quiz App',
        tech: ['HTML', 'CSS', 'JS', 'jQuery', 'Autodesk SketchBook'],
        text: 'This is a personal project I developed while gaining familiarity with JavaScript. This is a quiz app that tests user knowledge of odd egg facts, and populates the egg carton for every correct answer. All graphics created with Sketchbook.',
        img_alt: 'Egg Quiz Mobile And Desktop Website',
        img_url: 'imgs/tempImage.jpg',
        link: 'https://rachelekm.github.io/EggQuizUpdates/'}
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
    },
    buildZoomBox: function(target){
        let select = $(target).find('.webItemHeader')[0].innerText;
        let obj = model.webProjects.find(o => o.name === select);
        let techSection = obj.tech.map(elem => `<div class="techBox">${elem}</div>`)
        let html = `<button role="button" aria-label="Close Zoom" aria-pressed="true" class="closeZoom"></button>
        <div class="zoomContents">
            <div class="zoomWebImg"><img alt="${obj.img_alt} Zoomed In" src=${obj.img_url}></div>
            <div class="zoomTextBox">
                <div class="zoomHeader"><h1 class="vAlign">${obj.name}</h1></div>
                <div class="zoomTech">
                    <div class="vAlign">${techSection.join(' ')}</div>
                </div>
                <div class="zoomSummary"><p>${obj.text}</p></div>
            </div>
            <div class="zoomLinkToWeb">
                <a href="${obj.link}" class="vAlign" target="_blank" role="button" aria-label="Click To Open Web Project">Open Project</a>
            </div>
        </div>`
        $('.zbWeb').append(html);
        $('.zbWeb').show();
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
        $('.webItem').hover(function(e){
            e.stopPropagation();
            $(this).find('.hoverPrompt').slideToggle();
        });
        $('.webItem').on('click', function(e){
            e.stopPropagation();
            if(e.target.nodeName !== 'A'){
                mv.buildZoomBox(this);
            }
        });
        $('.artItem').on('click', 'button', function(e){
            e.stopPropagation();
            let url = e.currentTarget.previousElementSibling.src;
            let alt = e.currentTarget.previousElementSibling.alt;
            $('.zbArt').append(`<button role='button' aria-label='Close Zoom' aria-pressed='true' class='closeZoom'></button><img alt='${alt} Zoomed In' src=${url}>`);
            $('.zbArt').show();
        }),
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
        $('.zbWeb').on('click', '.closeZoom', function(e){
            e.stopPropagation();
            $('.zbWeb').empty();
            $('.zbWeb').hide();
        });
        $('.zbArt').on('click', '.closeZoom', function(e){
            e.stopPropagation();
            $('.zbArt').empty();
            $('.zbArt').hide();
        });
        $('.scrollTop').on('click', 'button', function(e){
            e.stopPropagation();
            $('main').animate({ scrollTop: `${$("#home").offset().top}`}, 1000);
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