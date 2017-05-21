var toggle1 = document.querySelectorAll(".catalog-item__text-toggle--1");
var toggle2 = document.querySelectorAll(".catalog-item__text-toggle--2")

toggle1.forEach(function(toggle, i) {
  toggle.addEventListener("click", function() {
  toggle1[i].classList.toggle("toggle-hid");
  toggle2[i].classList.toggle("toggle-hid");
})})

toggle2.forEach(function(toggle, i) {
  toggle.addEventListener("click", function() {
  toggle1[i].classList.toggle("toggle-hid");
  toggle2[i].classList.toggle("toggle-hid");
})})
