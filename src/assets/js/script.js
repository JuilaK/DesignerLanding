'use strict';
const $ = require('jquery');
require('slick-carousel');

$(document).ready(() => {

    const nav = $('.nav');
    const menuBtn = $('.nav__burger');
    const menu = $('.nav__menu');
  
    function closeMenu(){
        menuBtn.removeClass('show');
        menu.removeClass('show');
        document.body.style.overflow = '';
    }

    // Menu icon toggle on mobile
    menuBtn.on('click', () => {
        menuBtn.toggleClass('show');
        menu.toggleClass('show');
        document.body.style.overflow = menuBtn.hasClass('show') ? 'hidden' : '';    
    })

    $(document).on('keydown', (e) => {
        if (e.code === "Escape" && menuBtn.hasClass('show')) { 
            closeMenu()
        }
    });
    // End Menu icon toggle on mobile

    const menuItems = nav.find('[data-close]');
    const menuLinks = nav.find('.nav__menu-link, .nav__submenu-link');
    const headerHeight = nav.height();

    function moveToBlock(e) {
        const target = $(e.target).attr('href');
        const parent = e.currentTarget.offsetParent;
        
        $('html, body').animate({
            scrollTop: $(target).offset().top - headerHeight
        }, 500);

        menuLinks.removeClass('active');
        $(e.target).addClass('active');

        if (parent.classList.contains('nav__submenu-wrapper')) {
            $(parent.previousElementSibling).addClass('active');
        }
    }

    menuItems.on('click', (e) => {
        moveToBlock(e);        
        closeMenu();
    });

    $(window).on('scroll', () => {
        $('main section').each((i, element) => {
            const top  = $(element).offset().top-100;
            const bottom = top + $(element).height();
            const scroll = $(window).scrollTop();
            const id = $(element).attr('id');
            if( scroll > top && scroll < bottom){
                const parent = menuLinks.filter(`[href="#${id}"]`);
                menuLinks.filter('.active').removeClass('active');
                parent.addClass('active');
                if ($(parent).hasClass('nav__submenu-link')) {
                    $(parent.prevObject[2]).addClass('active');
                }
            }
        });

        if ($(window).scrollTop() > 10) {
            nav.addClass('scroll')
        } else {
            nav.removeClass('scroll')
        }
        
    });
});

// Slick-carousel settings

$('.reviews-block__carousel').slick({
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    prevArrow: '<button type="button" class="prev-arrow"><svg><use xlink:href="assets/images/sprite.svg#chevron-left"></use></svg></button>',
    nextArrow: '<button type="button" class="next-arrow"><svg><use xlink:href="assets/images/sprite.svg#chevron-right"></use></svg></button>',
    responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
});