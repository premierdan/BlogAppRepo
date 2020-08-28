const bodyParser = require("body-parser");

// let checkbox = document.querySelector("#checkbox");
let password = document.querySelector("#password");
let remove = document.querySelector("#remove");
let ps = document.querySelector(".ps");
let checkbox = document.querySelector("#checkbox")

// checkbox.addEventListener("click", function () {
//   password.style.display = "inline"
// })

function myFunction() {
  var checkBox = document.getElementById("myCheck");
  var password = document.getElementById("password");
  if (checkBox.checked == true) {
    password.style.display = "block";
  } else {
    password.style.display = "none";
  }
}

function openNav() {
  document.getElementById("mySidenav").style.width = "50%";
  document.getElementById("main").style.marginLeft = "50%";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
}









// Get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}




// let body = document.querySelector("body")
let body = document.getElementsByTagName("body")
document.querySelector("span.navbar-toggler-icon").addEventListener("click", function () { body.style.backgroundColor = rgba(0, 0, 0, 0.4) })

// "rgba(0,0,0,0.4)"








// var chk = document.querySelector("#checkbox").checked = true;
// var unchk = document.querySelector("#checkbox").checked = false;
// if (chk) {
//   password.style.display = "inline"
// } else if (unchk) { password.style.display = "none" }

// ps.addEventListener("click", function () {
//   password.style.display = "inline"
//   alert("Checkbox clicked")
// })


// checkbox.addEventListener("click", function () {
//   password.style.display = "inline"
//   alert("Checkbox clicked")
// })

// password.addEventListener("click", function () {
//   alert("Do you want to remove this post")
// })

// if (checkbox.value == checked) {
//   password.style.display = "none"
// }
