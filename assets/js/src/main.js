//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// Your scripts live here
//////////////////////////////////////////////////////////////////////////////

var elem = document.querySelector("header");
// construct an instance of Headroom, passing the element
var headroom = new Headroom(elem, {
  "offset": 205,
  "tolerance": 5,
  "classes": {
    "initial": "animated",
    "pinned": "slideDown",
    "unpinned": "slideUp"
  }
});
headroom.init();

window.viewportUnitsBuggyfill.init();

var menuOpen = false;
$(".menu-btn").on("click", function(){
  if(menuOpen){
    $(document.body).removeClass("show-menu");
  }
  else{
    $(document.body).addClass("show-menu");  
  }
  menuOpen = !menuOpen;
});

var hasDropdown = $('.nav li:has(ul)');
hasDropdown.addClass('parent');
$(".nav li.parent > a").click(function(e){
    e.preventDefault();
});

var menuDown = false;
$(".mobile-menu .menu>li.parent").click(function(e){
  if(menuDown){
    $(this).toggleClass('open');
  }
  else{
    $(this).toggleClass('open');
  }
  menuDown = !menuDown;
});

$('.popup-youtube, .popup-vimeo').magnificPopup({
  disableOn: 0,
  type: 'iframe',
  mainClass: 'mfp-fade',
  removalDelay: 160,
  preloader: false,
  fixedContentPos: false
});

$(function() {
    $('.package-item__info,.feature-item, .costBox').matchHeight();
  	$('.collapse-card').paperCollapse()
});
$(document).ready(function(){
    $(".testimonial-carousel").owlCarousel({
        items:1,
        loop:true,
        margin:10,
        autoplay:true,
        autoplayTimeout:5000,
        autoplayHoverPause:true
    });

	$('.project-item, .package-item, .process, .colour-blocks, .footer, .seo-reporting').viewportChecker({
		offset: 1
	});
	  $('.cms-video').viewportChecker({
	offset: 20
	});

	var login = $(".menu>li:last-child a");
	login.removeAttr("href");
	login.attr("data-target","#myModal");
	login.attr("data-toggle","modal");

  $(".project-link, split-image, .imgliquid").imgLiquid();
});