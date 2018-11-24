function onSignIn(googleUser) {
    document.getElementById("log").className = "logOut";
    document.getElementById("log").setAttribute("onclick", "logOut();");
    document.getElementById("log").innerHTML = "⊝";

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

    $.get(blobberPath + "putText.py", { "idTkn": id_token, "text": document.getElementById("blobInput").value }, function (data) {
        console.log("put Blobber:" + data);
        document.getElementById("blobInput").value = "";
    });

}

function getBlobber(sorting) {
    var GoogleAuth = gapi.auth2.getAuthInstance();
    var GoogleUsr = GoogleAuth.currentUser.get();
    var id_token = GoogleUsr.getAuthResponse().id_token;

    $.get(blobberPath + "getText.py", { "idTkn": id_token, "sorting": sorting, "von": 0, "bis": 100}, function (data) {
        console.log(data);
        data = JSON.parse(data);
        data.reverse();
        for (i = 0; i < data.length; i++) {
            a = '<div id="' + data[i]["id"] + '" class="content">' + " &lt;" + data[i]["OP"].replace(new RegExp("<", 'g'), '&lt;') + "> <br />" + data[i]["text"].replace(new RegExp("<", 'g'), '&lt;') + " (" + data[i]["upvotes"] + " upvotes) ";
            bsrc1 = "./img/upvote.svg";
            bsrc2 = "./img/downvote.svg";
            if (data[i]["isUpvoted"] == true) {
                bsrc1 = "./img/upvoted.svg";
            }
            if (data[i]["isDownvoted"] == true) {
                bsrc2 = "./img/downvoted.svg";
            }
            b = '<br/><img class="pointerStyle" id="upvote" src="' + bsrc1 + '" style="width:20px;height:20px;" onclick="voteBlobber(\'up\',\'' + data[i]["id"] + '\')">&nbsp;&nbsp;<img src="' + bsrc2 + '" class="pointerStyle" id="downvote" style="width:20px;height:20px;" onclick="voteBlobber(\'down\',\'' + data[i]["id"] + '\')"><br>';
            c = '</div>';
            document.getElementById("contentHolder").innerHTML += a + b + c;

            /*if (data[i]["isUpvoted"] == true) {
                //$("#"+newData[i]["id"]).find( "#upvote" ).attr("src", "./img/upvoted.svg");
            }
            if (data[i]["isDownvoted"] == true) {
                //$("#"+newData[i]["id"]).find( "#upvote" ).attr("src", ./img/upvoted.svg);
            }*/
        }
    });

}

function voteBlobber(vote, postId) {
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
