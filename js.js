function onSignIn(googleUser) {
  document.getElementById("log").className = "logOut";
  document.getElementById("log").setAttribute("onclick", "logOut();");
  document.getElementById("log").innerHTML = "Ausloggen";

  closeAlertBox();
}

function alertBox() {
    document.getElementById("alertBox").style.display = "block";
    document.getElementById("banner").style.opacity = "0.1";
    document.getElementById("contentHolder").style.opacity = "0.1";

    setTimeout(function timeout() {
        document.getElementById("contentHolder").addEventListener("click", closeAlertBox);
    }, 100);
}

function logOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut();

  //auth2.disconnect();
  setTimeout(function timeout() {
    location.reload();
  }, 100);
}

function closeAlertBox() {
    document.getElementById("alertBox").style.display = "none";
    document.getElementById("banner").style.opacity = "1";
    document.getElementById("contentHolder").style.opacity = "1";
    document.getElementById("contentHolder").removeEventListener("click", closeAlertBox);
}

window.onload = function (event) {
    document.getElementById("contentHolder").style.height = window.innerHeight - 102 + "px";
}

window.onresize = function (event) {
    document.getElementById("contentHolder").style.height = window.innerHeight - 102 + "px";
}
