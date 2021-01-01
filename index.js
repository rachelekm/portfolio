'use strict';

const clientView = {
    onPageLoad: function(){
        $('.navList').on('click', e => {
            e.preventDefault();
            e.stopPropagation();
            alert('clicked@');
        });
    }
}

$(clientView.onPageLoad());