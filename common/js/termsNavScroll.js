//nav scroll event
$(function () {
  $(window).scroll(function () {
    var navbar = $(this).scrollTop();
    if (navbar > 0) {
      $('.nav_img').attr('src', '../common/img/nav_scroll.png');
    } else {
      $('.nav_img').attr('src', '../common/img/nav.png');
    }
  })
})

//가맹신청 버튼
function nav_apply() {

  $('.nav_btn').toggleClass('nav_on');

  if ($('.nav_btn').hasClass('nav_on')) {
    TweenMax.to('.nav_btn', 0.5, { y: 260 })
  } else {
    TweenMax.to('.nav_btn', 0.5, { y: 0 })
  }

}