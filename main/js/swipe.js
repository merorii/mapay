var swiper = new Swiper('.swiper-container', {
    pagination: {
    el: '.swiper-pagination',
    clickable: true,
    },
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    speed : 1000,
    loop: true,
});