var menu = document.querySelector(".page-menu__items");

function hideMenu() {

  if (menu.classList.contains("page-menu__items--show")) {
    menu.classList.remove("page-menu__items--show");
  }
}
hideMenu();

var open = document.querySelector(".page-header__toggle--open");

open.addEventListener("click", function(event){
    event.preventDefault();
    menu.classList.add("page-menu__items--show");
  }
);

var close = document.querySelector(".page-header__toggle--close");

close.addEventListener("click", function (event){
  event.preventDefault();
  menu.classList.remove("page-menu__items--show");
}
);


function hideMap() {
  var map = document.querySelector(".map");
  if (map.classList.contains("map--open")){
    map.classList.add("map--close");
  }
}
hideMap();

function staticIframe() {
  var iframe = document.querySelector(".map__iframe");
  if (iframe.classList.contains("map__iframe--absolute")){
    iframe.classList.remove("map__iframe--absolute");
  }
}

staticIframe();
