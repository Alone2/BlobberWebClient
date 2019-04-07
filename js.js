var upvoteButton = "./img/light/upvote.svg"
var upvoteButtonPress = "./img/light/upvoted.svg"
var downvoteButton = "./img/light/downvote.svg"
var downvoteButtonPress = "./img/light/downvoted.svg"

var isMobile = false;
var isSignedIn = false;
var isWindowsApp = false;

var currentScrollPos = 0;

function onSignIn(googleUser) {
    document.getElementById("log").className = "logOut";
    document.getElementById("log").setAttribute("onclick", "logOut();");
    document.getElementById("log").innerHTML = '<img height="40px" src="img/signOut.svg">';
    
    closeAlertBox();
    isSignedIn = true;
    getOwnUsername()
    getBlobber("new", true);
}

function init() {
    gapi.load('auth2', function () {
        /*setTimeout(function timeout() {
            var GoogleAuth = gapi.auth2.getAuthInstance();
            var GoogleUsr = GoogleAuth.currentUser.get();
            if (!GoogleUsr.isSignedIn()) {
                getBlobber("new", true);
            }
        }, 300);*/
    });
}

function alertBox(isClosable = true) {
    document.getElementById("alertBox").style.display = "block";
    document.getElementById("banner").style.opacity = "0.3";
    document.getElementById("contentHolder").style.opacity = "0.3";
    document.getElementById("derGradient").style.opacity = "0.3";

    if (!isClosable) {
        return
    }
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

function textAlertBoxDelay(text, delay) {
    document.getElementById("alertBox").style.display = "block";
    $("#alertBox").html(text+"<br />")

    setTimeout(function timeout() {
        closeAlertBox();
    }, delay);
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
    if (isMobile) {
        document.getElementById("contentHolder").style.height = window.innerHeight - 70 + "px";
    } else {
        document.getElementById("contentHolder").style.height = window.innerHeight - 102 + "px";
        document.getElementById("contentHolder").style.paddingLeft = (window.innerWidth / 4)/2 + "px";
        document.getElementById("contentHolder").style.paddingRight = (window.innerWidth / 4)/2 + "px";
    }
    document.getElementById("derGradient").style.width = window.innerWidth + "px";
    document.getElementById("blobInput").style.width = $("#theRealStuff").width() - 110 + "px";
}

window.onresize = function (event) {
    if (isMobile) {
        document.getElementById("contentHolder").style.height = window.innerHeight - 70 + "px";
    } else {
        document.getElementById("contentHolder").style.height = window.innerHeight - 102 + "px";
        document.getElementById("contentHolder").style.paddingLeft = (window.innerWidth / 4)/2 + "px";
        document.getElementById("contentHolder").style.paddingRight = (window.innerWidth / 4)/2 + "px";
    }
    document.getElementById("derGradient").style.width = window.innerWidth + "px";
    document.getElementById("blobInput").style.width = $("#theRealStuff").width() - 110 + "px";
}

var blobberPath = ""
$(document).ready(function () {
    $.getJSON("files.json", function (data) {
        blobberPath = data["web"];
        moveOn();
    });

});
function moveOn() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        isMobile = true;
    } else {
        getNews();
    }
    var mode = "light";
    if (window.Windows) {
        isMobile = true;
        isWindowsApp = true;
        var uiSettings = new Windows.UI.ViewManagement.UISettings();
        var color = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.background);
        if (color["b"] != 255) {
            mode = "dark";
        }
        /*var appView = Windows.UI.ViewManagement.ApplicationView.getForCurrentView();
        var theBar = appView.titleBar;
        theBar.backgroundColor = Windows.UI.Colors.aliceBlue;

        theBar.backgroundColor = uiSettings.getColorValue(Windows.UI.ViewManagement.UIColorType.background);*/
    }
    set_cookie_theme(mode)
    getBlobber("new", true);

    if (isWindowsApp) {
        //$("#sendImg").attr("padding-right", "10px");
        $("#numbers a").css({"padding-right":"10px"});
        $("#contentHolder").attr("overflow","hidden");
    }

    document.getElementById("contentHolder").onscroll = function(ev) {
        var wind = document.getElementById("contentHolder");
        if ((wind.clientHeight + wind.scrollTop) >= wind.scrollHeight) {
            currentScrollPos += 100;
            getBlobber("new", false);
        }

        /*var bar = document.getElementById("news");
        if ((wind.clientHeight + wind.scrollTop) >= bar.offsetHeight) {
            $("#news").css("position", "fixed");
        } else {
            $("#news").css("position", "");
        }*/
    };

    /*
    Für Hover
    $("#sendImg").hover(function(){
        console.log("yey");
        $("#sendImg").attr("src", "./img/sendHover.svg");
    }, function(){
        $("#sendImg").attr("src", "./img/send.svg");
    });*/
}

function newBlobber() {
    value = document.getElementById("blobInput").value;
    if (value == "") {
        return;
    }
    document.getElementById("blobInput").value = "";

    var GoogleAuth = gapi.auth2.getAuthInstance();
    var GoogleUsr = GoogleAuth.currentUser.get();
    var id_token = GoogleUsr.getAuthResponse().id_token;

    //wenn der Nutzer nicht angemeldet ist, kann er nichts senden
    if (!GoogleUsr.isSignedIn()) {
        alertBox();
        return;
    }

    $.get(blobberPath + "putText.py", { "idTkn": id_token, "text": value }, function (data) {
        console.log("put Blobber:" + data);
        textAlertBoxDelay("gesendet", 2000); 
    });

}

function getBlobber(sorting, isNew = false) {
    //var GoogleAuth = gapi.auth2.getAuthInstance();
    //var GoogleUsr = GoogleAuth.currentUser.get();
    // Wenn der Nutzer nicht eingeloggt ist.
    if (!isSignedIn) {
        $.get(blobberPath + "getText.py", { "sorting": sorting, "von": currentScrollPos, "bis": currentScrollPos + 99 }, function (data) {
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
        return;
    }
    var GoogleAuth = gapi.auth2.getAuthInstance();
    var GoogleUsr = GoogleAuth.currentUser.get();
    // Wenn der Nutzer eingeloggt ist.
    var id_token = GoogleUsr.getAuthResponse().id_token;
    $.get(blobberPath + "getText.py", { "idTkn": id_token, "sorting": sorting, "von": currentScrollPos, "bis": currentScrollPos + 99}, function (data) {
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

function getOwnUsername() {
    var GoogleAuth = gapi.auth2.getAuthInstance();
    var GoogleUsr = GoogleAuth.currentUser.get();
    var id_token = GoogleUsr.getAuthResponse().id_token;
    $.getJSON(blobberPath + "getUserDat.py", { "idTkn": id_token, "data":"name" }, function (data) {
        console.log(data);
        if (data["data"] == "unnamed") {
            text = "Setze deinen Nutzernamen:<br/><input type='text' id='username'> <input type='button' value='ok' onclick='changeName($(\"#username\").val()); closeAlertBox();'/>";
            $("#alertBox").html(text+"<br />");
            alertBox(false);
        }
    });
}

function changeName(name) {
    var GoogleAuth = gapi.auth2.getAuthInstance();
    var GoogleUsr = GoogleAuth.currentUser.get();
    var id_token = GoogleUsr.getAuthResponse().id_token;
    $.get(blobberPath + "saveUserDat.py", { "idTkn": id_token, "data":"name", "dataValue":name}, function (data) {
        console.log(data)
    });
}

function change_theme(theme, setcookie = true) {
    if (isMobile) {
        document.getElementsByTagName("link").item(6).href = "css/" + theme + "M.css";
    } else {
        document.getElementsByTagName("link").item(6).href = "css/" + theme + ".css";
    }
    
    var date = new Date();
    tage = 365 
    date.setTime(date.getTime() + (tage*24*60*60*1000));
    if (setcookie) {
        document.cookie = 'theme=' + theme + '; expires=' + date.toUTCString() + '; path=/'
    }
    upvoteButton = "./img/" + theme + "/upvote.svg"
    upvoteButtonPress = "./img/" + theme + "/upvoted.svg"
    downvoteButton = "./img/" + theme + "/downvote.svg"
    downvoteButtonPress = "./img/" + theme + "/downvoted.svg"
    $("#sendImg").attr("src", "./img/" + theme + "/send.svg")
}

function set_cookie_theme(defaultMode) {
    cook = document.cookie;
    try {
        split = cook.split("; ");
    } catch (error) {
        split = "theme=" + defaultMode + ";"
    }
    for (i = 0; i < split.length; i++) {
        theme = split[i].split("=");
        if (theme[0] == "theme") {
            change_theme(theme[1]);
            changeButtonsTheme(theme[1]);
            return
        }
    }
    change_theme(defaultMode, false);
    changeButtonsTheme(defaultMode);
}

function changeButtonsTheme(theme) {
    if (theme == "dark") {
        $("#theme_switcher").attr("onclick","change_theme('light'); location.reload(); ");
    } else {
        $("#theme_switcher").attr("onclick","change_theme('dark'),  location.reload(); ");
    }
    $("#theme_switcher_img").attr("src","img/"+ theme + "/change_theme.svg")
}

function getNews(){
    document.getElementById("news").className = "";
    $.getJSON("news.json", function (data) {
        for (i = 0; i < data.length; i++) {
            new_dat = data[i]
            $("#news").html($("#news").html() + '<div class="content newscontent">' + "<small>" + new_dat["header"] + "</small> <br />" + new_dat["message"] + "<br />")
        }

    });
}

$.ajaxSetup ({
    // Disable caching of AJAX responses
    // Nicht mehr im cache gespeichert
    cache: false
});