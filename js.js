function onSignIn(googleUser) {
    document.getElementById("log").className = "logOut";
    document.getElementById("log").setAttribute("onclick", "logOut();");
    document.getElementById("log").innerHTML = '<img height="40px" src="img/signOut.svg">';

    closeAlertBox();
    getBlobber("new", true);
}

function init() {
    getBlobber("new", true);
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
    //auth2.disconnect();
    auth2.signOut().then(function () {
        location.reload();
    });
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

    $.get(blobberPath + "putText.py", { "idTkn": id_token, "text": document.getElementById("blobInput").value }, function (data) {
        console.log("put Blobber:" + data);
        document.getElementById("blobInput").value = "";
    });

}

function getBlobber(sorting, isNew = false) {
    var GoogleAuth = gapi.auth2.getAuthInstance();
    var GoogleUsr = GoogleAuth.currentUser.get();
    // Wenn der Nutzer nicht eingeloggt ist.
    if (!GoogleUsr.isSignedIn()) {
        $.get(blobberPath + "getText.py", { "sorting": sorting, "von": 0, "bis": 100 }, function (data) {
            //console.log(data);
            if (isNew == true) {
                document.getElementById("blobs").innerHTML = "";
            }
            data = JSON.parse(data);
            data.reverse();
            for (i = 0; i < data.length; i++) {
                a = '<div id="' + data[i]["id"] + '" class="content">' + " &lt;" + data[i]["OP"].replace(new RegExp("<", 'g'), '&lt;') + "> <br />" + data[i]["text"].replace(new RegExp("<", 'g'), '&lt;') + " <br />";
                bsrc1 = "./img/upvote.svg";
                bsrc2 = "./img/downvote.svg";
                b = '<img class="pointerStyle" id="upvote" src="' + bsrc1 + '" style="width:20px;height:20px;" onclick="voteBlobber(\'up\',\'' + data[i]["id"] + '\')">&nbsp;' + data[i]["upvotes"] + '&nbsp;<img src="' + bsrc2 + '" class="pointerStyle" id="downvote" style="width:20px;height:20px;" onclick="voteBlobber(\'down\',\'' + data[i]["id"] + '\')"><br>';
                c = '</div>';
                document.getElementById("blobs").innerHTML += a + b + c;
            }
            return;
        });
    }
    // Wenn der Nutzer eingeloggt ist.
    var id_token = GoogleUsr.getAuthResponse().id_token;
    $.get(blobberPath + "getText.py", { "idTkn": id_token, "sorting": sorting, "von": 0, "bis": 100 }, function (data) {
        //console.log(data); 
        if (isNew == true) {
            document.getElementById("blobs").innerHTML = "";
        }
        data = JSON.parse(data);
        data.reverse();
        for (i = 0; i < data.length; i++) {
            a = '<div id="' + data[i]["id"] + '" class="content">' + " &lt;" + data[i]["OP"].replace(new RegExp("<", 'g'), '&lt;') + "> <br />" + data[i]["text"].replace(new RegExp("<", 'g'), '&lt;') + " <br />";
            bsrc1 = "./img/upvote.svg";
            bsrc2 = "./img/downvote.svg";
            if (data[i]["isUpvoted"] == true) {
                bsrc1 = "./img/upvoted.svg";
            }
            if (data[i]["isDownvoted"] == true) {
                bsrc2 = "./img/downvoted.svg";
            }
            b = '<img class="pointerStyle" id="upvote" src="' + bsrc1 + '" style="width:20px;height:20px;" onclick="voteBlobber(\'up\',\'' + data[i]["id"] + '\')">&nbsp;' + data[i]["upvotes"] + '&nbsp;<img src="' + bsrc2 + '" class="pointerStyle" id="downvote" style="width:20px;height:20px;" onclick="voteBlobber(\'down\',\'' + data[i]["id"] + '\')"><br>';
            c = '</div>';
            document.getElementById("blobs").innerHTML += a + b + c;
        }
    });

}

function voteBlobber(vote, postId) {
    var GoogleAuth = gapi.auth2.getAuthInstance();
    var GoogleUsr = GoogleAuth.currentUser.get();
    // Wenn der Nutzer nicht eingeloggt ist, kann er nicht upvoten
    if (!GoogleUsr.isSignedIn()) {
        return;
    }

    if (vote == "up") {
        $("#" + postId).find("#downvote").attr("src", "./img/downvote.svg");
        if ($("#" + postId).find("#upvote").attr("src") == "./img/upvoted.svg") {
            $("#" + postId).find("#upvote").attr("src", "./img/upvote.svg");
        } else {
            $("#" + postId).find("#upvote").attr("src", "./img/upvoted.svg");
        }

    }
    if (vote == "down") {
        $("#" + postId).find("#upvote").attr("src", "./img/upvote.svg");
        if ($("#" + postId).find("#downvote").attr("src") == "./img/downvoted.svg") {
            $("#" + postId).find("#downvote").attr("src", "./img/downvote.svg");
        } else {
            $("#" + postId).find("#downvote").attr("src", "./img/downvoted.svg");
        }
    }

    var GoogleAuth = gapi.auth2.getAuthInstance();
    var GoogleUsr = GoogleAuth.currentUser.get();
    var id_token = GoogleUsr.getAuthResponse().id_token;

    $.get(blobberPath + "vote.py", { "idTkn": id_token, "postId": postId, "vote": vote }, function (data) {
        console.log(data)
    });

}
