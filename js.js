function onSignIn(googleUser) {
    document.getElementById("log").className = "logOut";
    document.getElementById("log").setAttribute("onclick", "logOut();");
    document.getElementById("log").innerHTML = "Ausloggen";

    closeAlertBox();
    getBlobber("new");
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
    document.getElementById("derGradient").style.width = window.innerWidth + "px";
    document.getElementById("blobInput").style.width = window.innerWidth - 75 + "px";
}

window.onresize = function (event) {
    document.getElementById("contentHolder").style.height = window.innerHeight - 102 + "px";
    document.getElementById("derGradient").style.width = window.innerWidth + "px";
    document.getElementById("blobInput").style.width = window.innerWidth - 75 + "px";
}

var blobberPath = ""
$(document).ready(function () {
    $.getJSON("files.json", function (data) {
        blobberPath = data["web"];
    });
});

function newBlobber() {
    var GoogleAuth = gapi.auth2.getAuthInstance();
    var GoogleUsr = GoogleAuth.currentUser.get();
    var id_token = GoogleUsr.getAuthResponse().id_token;

    $.get(blobberPath + "putText.py", { "idTkn": id_token, "text": document.getElementById("blobInput").innerHTML }, function (data) {
        console.log("put Blobber:" + data);
        document.getElementById("blobInput").innerHTML = "";
    });

}

function getBlobber(sorting) {
    $.get(blobberPath + "getText.py", { "sorting": sorting, "von": 0, "bis": 100 }, function (data) {
        console.log(data);
        newData = JSON.parse(data.replace(new RegExp("'", 'g'), '"'));
        for (i = 0; i < newData.length; i++) {
            a = '<br/><div class="content">' + " &lt;" + newData[i]["OP"].replace(new RegExp("<", 'g'), '&lt;') + "> <br />" + newData[i]["text"].replace(new RegExp("<", 'g'), '&lt;') + " (" + newData[i]["upvotes"] + " upvotes) ";
            b = '<br/><input type="button" value="upvote" onclick="voteBlobber(\'up\',\'' + newData[i]["id"] + '\')"> <input type="button" value="downvote" onclick="voteBlobber(\'down\',\'' + newData[i]["id"] + '\')"><br>';
            c = '</div>';
            document.getElementById("contentHolder").innerHTML += a + b + c;
        }

    });

}
