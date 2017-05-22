var button = document.querySelector(".form-button");
var popup_success = document.querySelector(".popup--success");
var success_btn = document.querySelector(".popup-button--success");

button.addEventListener("click", function(event){
  event.preventDefault();
  popup_success.classList.add("popup--success__show");
});

success_btn.addEventListener("click", function (event) {
  event.preventDefault();
  popup_success.classList.remove("popup--success__show");
});

window.addEventListener("keydown", function(event){
  if (event.keyCode === 27) {
    if(popup_success.classList.contains("popup--success__show")){
      popup_success.classList.remove("popup--success__show");
    }
  }
});
