'use strict';
const $ = require('jquery');
require('svgxuse');

$(() => {
    const documentHeight = $(document).height();
    const windowHeight = $(window).height();

    const nav = $('.nav');
    const menuBtn = $('.nav__burger');
    const menu = $('.nav__menu');
  
    function closeMenu(){
        menuBtn.removeClass('show');
        menu.removeClass('show');
        document.body.style.overflow = '';
    }

    menuBtn.on('click', () => {
        menuBtn.toggleClass('show');
        menu.toggleClass('show');
        document.body.style.overflow = menuBtn.hasClass('show') ? 'hidden' : '';    
    })

    const menuLinks = nav.find('.nav__menu-link');

    function moveToBlock(e) {
        const target = $(e.target).attr('href');
        
        $('html, body').animate({
            scrollTop: $(target).offset().top - 80
        }, 500);

        menuLinks.removeClass('active');
        $(e.target).addClass('active');
    }

    menuLinks.on('click', e =>  {
        moveToBlock(e);        
        closeMenu();
    });

    $(window).on('scroll', () => {
        const scroll = $(window).scrollTop();

        $('main section').each((i, element) => {
            const top  = $(element).offset().top-100;
            const bottom = top + $(element).height();            
            const id = $(element).attr('id');

            if ((scroll > top && scroll < bottom) || (scroll >= documentHeight - windowHeight - 100)){                
                const parent = menuLinks.filter(`[href="#${id}"]`);
                menuLinks.filter('.active').removeClass('active');
                parent.addClass('active');
            }
        });

        if (scroll > 10) {
            nav.addClass('scroll')
        } else {
            nav.removeClass('scroll')
        }
    })
});