var upvoteButton = "./img/light/upvote.svg"
var upvoteButtonPress = "./img/light/upvoted.svg"
var downvoteButton = "./img/light/downvote.svg"
var downvoteButtonPress = "./img/light/downvoted.svg"


function onSignIn(googleUser) {
    document.getElementById("log").className = "logOut";
    document.getElementById("log").setAttribute("onclick", "logOut();");
    document.getElementById("log").innerHTML = '<img height="40px" src="img/signOut.svg">';

    closeAlertBox();
    getBlobber("new", true);
}

function init() {
    gapi.load('auth2', function () {
        setTimeout(function timeout() {
            var GoogleAuth = gapi.auth2.getAuthInstance();
            var GoogleUsr = GoogleAuth.currentUser.get();
            if (!GoogleUsr.isSignedIn()) {
                getBlobber("new", true);
            }
        }, 300);
    });
}

function alertBox() {
    document.getElementById("alertBox").style.display = "block";
    document.getElementById("banner").style.opacity = "0.3";
    document.getElementById("contentHolder").style.opacity = "0.3";
    document.getElementById("derGradient").style.opacity = "0.3";


    setTimeout(function timeout() {
        $('body').click(function (e) {
            console.log($(e.target));

            if ($("#alertBox").find(e.target).length || $(e.target).attr('id') == "alertBox") { return }

            console.log("ok");
            closeAlertBox();
            $('body').unbind("click");

        });
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
    document.getElementById("derGradient").style.opacity = "1";
}

window.onload = function (event) {
    document.getElementById("contentHolder").style.height = window.innerHeight - 102 + "px";
    document.getElementById("derGradient").style.width = window.innerWidth + "px";
    document.getElementById("blobInput").style.width = window.innerWidth - 140 + "px";
}

window.onresize = function (event) {
    document.getElementById("contentHolder").style.height = window.innerHeight - 102 + "px";
    document.getElementById("derGradient").style.width = window.innerWidth + "px";
    document.getElementById("blobInput").style.width = window.innerWidth - 140 + "px";
}

var blobberPath = ""
$(document).ready(function () {
    $.getJSON("files.json", function (data) {
        blobberPath = data["web"];
    });
    try {
        set_cookie_theme()
    } catch (error) {
        console.log("No Theme selected")
    }
        

    /*
    Für Hover
    $("#sendImg").hover(function(){
        console.log("yey");
        $("#sendImg").attr("src", "./img/sendHover.svg");
    }, function(){
        $("#sendImg").attr("src", "./img/send.svg");
    });*/

});

function newBlobber() {
    var GoogleAuth = gapi.auth2.getAuthInstance();
    var GoogleUsr = GoogleAuth.currentUser.get();
    var id_token = GoogleUsr.getAuthResponse().id_token;

    //wenn der Nutzer nicht angemeldet ist, kann er nichts senden
    if (!GoogleUsr.isSignedIn()) {
        alertBox();
        return;
    }

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
                a = '<div id="' + data[i]["id"] + '" class="content">' + "<b>" + data[i]["OP"].replace(new RegExp("<", 'g'), '&lt;') + "</b> <br />" + data[i]["text"].replace(new RegExp("<", 'g'), '&lt;') + " <br />";
                bsrc1 = upvoteButton;
                bsrc2 = downvoteButton;
                b = '<img class="pointerStyle" id="upvote" src="' + bsrc1 + '" style="width:20px;height:20px;" onclick="voteBlobber(\'up\',\'' + data[i]["id"] + '\')">&nbsp;<upvoteNum>' + data[i]["upvotes"] + '</upvoteNum>&nbsp;<img src="' + bsrc2 + '" class="pointerStyle" id="downvote" style="width:20px;height:20px;" onclick="voteBlobber(\'down\',\'' + data[i]["id"] + '\')"><br>';
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
            a = '<div id="' + data[i]["id"] + '" class="content">' + "<b>" + data[i]["OP"].replace(new RegExp("<", 'g'), '&lt;') + "</b> <br />" + data[i]["text"].replace(new RegExp("<", 'g'), '&lt;') + " <br />";
            bsrc1 = upvoteButton;
            bsrc2 = downvoteButton;
            if (data[i]["isUpvoted"] == true) {
                bsrc1 = upvoteButtonPress;
            }
            if (data[i]["isDownvoted"] == true) {
                bsrc2 = downvoteButtonPress;
            }
            b = '<img class="pointerStyle" id="upvote" src="' + bsrc1 + '" style="width:20px;height:20px;" onclick="voteBlobber(\'up\',\'' + data[i]["id"] + '\')">&nbsp;<upvoteNum>' + data[i]["upvotes"] + '</upvoteNum>&nbsp;<img src="' + bsrc2 + '" class="pointerStyle" id="downvote" style="width:20px;height:20px;" onclick="voteBlobber(\'down\',\'' + data[i]["id"] + '\')"><br>';
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
        alertBox();
        return;
    }

    if (vote == "up") {
        if ($("#" + postId).find("#upvote").attr("src") == upvoteButtonPress) {
            $("#" + postId).find("#upvote").attr("src", upvoteButton);
            $("#" + postId).find("upvoteNum").html(Number($("#" + postId).find("upvoteNum").html()) - 1);
        } else {
            $("#" + postId).find("#upvote").attr("src", upvoteButtonPress);
            //wenns downgevotet ist wirds zwei mal upgevotet
            if ($("#" + postId).find("#downvote").attr("src") == downvoteButtonPress) {
                $("#" + postId).find("upvoteNum").html(Number($("#" + postId).find("upvoteNum").html()) + 1);
            }
            $("#" + postId).find("upvoteNum").html(Number($("#" + postId).find("upvoteNum").html()) + 1);
        }
        $("#" + postId).find("#downvote").attr("src", downvoteButton);

    }
    if (vote == "down") {
        if ($("#" + postId).find("#downvote").attr("src") == downvoteButtonPress) {
            $("#" + postId).find("#downvote").attr("src", downvoteButton);
            $("#" + postId).find("upvoteNum").html(Number($("#" + postId).find("upvoteNum").html()) + 1);
        } else {
            $("#" + postId).find("#downvote").attr("src", downvoteButtonPress);
            //wenns upgevotet ist wirs einmal downgevotet und dann noch einmal
            if ($("#" + postId).find("#upvote").attr("src") == upvoteButtonPress) {
                $("#" + postId).find("upvoteNum").html(Number($("#" + postId).find("upvoteNum").html()) - 1);
            }
            $("#" + postId).find("upvoteNum").html(Number($("#" + postId).find("upvoteNum").html()) - 1);
        }
        $("#" + postId).find("#upvote").attr("src", upvoteButton);
    }

    var GoogleAuth = gapi.auth2.getAuthInstance();
    var GoogleUsr = GoogleAuth.currentUser.get();
    var id_token = GoogleUsr.getAuthResponse().id_token;

    $.get(blobberPath + "vote.py", { "idTkn": id_token, "postId": postId, "vote": vote }, function (data) {
        console.log(data)
    });

}

function change_theme(theme) {
    document.getElementsByTagName("link").item(6).href = theme + ".css";
    var date = new Date();
    tage = 1000 
    date.setTime(date.getTime() + (tage*24*60*60*1000));
    document.cookie = 'theme=' + theme + '; expires=' + date.toUTCString() + '; path=/'
    upvoteButton = "./img/" + theme + "/upvote.svg"
    upvoteButtonPress = "./img/" + theme + "/upvoted.svg"
    downvoteButton = "./img/" + theme + "/downvote.svg"
    downvoteButtonPress = "./img/" + theme + "/downvoted.svg"
}

function set_cookie_theme() {
    cook = document.cookie;
    split = cook.split("; ");
    for (i = 0; i < split.length; i++) {
        theme = split[i].split("=");
        if (theme[0] == "theme") {
            change_theme(theme[1]);
            if (theme[1] == "dark") {
                $("#theme_switcher").attr("onclick","change_theme('light'); location.reload(); ");
            } else {
                $("#theme_switcher").attr("onclick","change_theme('dark'),  location.reload(); ");
            }
            $("#theme_switcher_img").attr("src","img/"+ theme[1] + "/change_theme.svg")
            return
        }
    }        
}
    