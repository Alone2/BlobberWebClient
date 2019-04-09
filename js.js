var upvoteButton = "./img/light/upvote.svg"
var upvoteButtonPress = "./img/light/upvoted.svg"
var downvoteButton = "./img/light/downvote.svg"
var downvoteButtonPress = "./img/light/downvoted.svg"

var isMobile = false;
var isSignedIn = false;
var isWindowsApp = false;

var currentScrollPos = 0;
var scrollPosForNew = 14;
var canScroll = true;

var maxBlobs = 0;
var current_sorting = "new";

function onSignIn(googleUser) {
    document.getElementById("log").className = "logOut";
    document.getElementById("log").setAttribute("onclick", "logOut();");
    document.getElementById("log").innerHTML = '<img height="40px" src="img/signOut.svg">';
    
    closeAlertBox();
    isSignedIn = true;
    getOwnUsername()
    getBlobber(current_sorting, true);
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
        $("#alertBoxClose").addClass("nodisplay");
        $("#alertBoxContent").css("padding-top", $("#alertBoxContent").css("padding-left"));
        return
    }
    $("#alertBoxClose").removeClass("nodisplay");
    $("#alertBoxContent").css("padding-top", "")
    setTimeout(function timeout() {
        $('body').click(function (e) {
            console.log($(e.target));

            if ($("#alertBox").find(e.target).length || $(e.target).attr('id') == "alertBox") { return }

            console.log("ok");
            closeAlertBox();
            $('body').unbind("click");

        });
        document.getElementById("alertBox").onclick = function (event) {
            closeAlertBox();
            $('body').unbind("click");
        }
    }, 100);
}

function textAlertBoxDelay(text, delay) {
    document.getElementById("alertBox").style.display = "block";
    $("#alertBoxContent").html(text+"<br />")
    $("#alertBoxClose").addClass("nodisplay");
    $("#alertBoxContent").css("padding-top", $("#alertBoxContent").css("padding-left"));

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

window.onresize = function (event) {
    stuffToTheRightPlace();
}

function stuffToTheRightPlace() {
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

document.getElementsByTagName("link").item(7).onload = function(ev) {
    stuffToTheRightPlace();
};
document.getElementsByTagName("link").item(8).onload = function(ev) {
    stuffToTheRightPlace();
};

function moveOn() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        isMobile = true;
    } else {
        getNews();
    }
    var mode = "light";
    if (window.Windows) {
        //isMobile = true;
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
    set_cookie_theme(mode);
    getBlobber(current_sorting, true);

    if (isWindowsApp) {
        //$("#sendImg").attr("padding-right", "10px");
        //$("#numbers a").css("padding-right","10px");
        //$("#contentHolder").css("overflow","hidden");
    }

    stuffToTheRightPlace();
    //searchForNew();

    document.getElementById("contentHolder").onscroll = function(ev) {
        var wind = document.getElementById("contentHolder");
        //console.log((wind.clientHeight + wind.scrollTop) + " " + wind.scrollHeight)
        if ((wind.clientHeight + wind.scrollTop) >= wind.scrollHeight - $("#contentHolder").height()/2 && canScroll) {
            canScroll = false;
            currentScrollPos -= scrollPosForNew;
            if (currentScrollPos > 0) {
                getBlobber(current_sorting, false);
                console.log("load new..")
            }
        }

        /*var bar = document.getElementById("news");
        if ((wind.clientHeight + wind.scrollTop) >= bar.offsetHeight) {
            $("#news").css("position", "fixed");
        } else {
            $("#news").css("position", "");
        }*/
    };

}

function searchForNew() {
    setTimeout(function () {
        $.getJSON(blobberPath + "getText.py", {"sorting": current_sorting, "von": 0, "bis": 0, "getLenght":"True"}, function (data) {
            if (maxBlobs > data["lenght"]) {
                console.log("Tree")
            }
            searchForNew();
        }); 
    }, 10000);
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
    if (isNew) {
        $.getJSON(blobberPath + "getText.py", {"sorting": sorting, "von": 0, "bis": 0, "getLenght":"True"}, function (data) {
            currentScrollPos = data["lenght"];
            maxBlobs = data["lenght"];
            document.getElementById("blobs").innerHTML = ""; 
            callBlobber(sorting);
        });
        return
    }
    callBlobber(sorting)
}

function callBlobber(sorting) {
    if (!isSignedIn) {
        getBlobberSignedOut(sorting);
        return;
    }
    getBlobberSignedIn(sorting);
}

function getBlobberSignedOut(sorting) {
    $.get(blobberPath + "getText.py", { "sorting": sorting, "von": currentScrollPos - scrollPosForNew, "bis": currentScrollPos }, function (data) {
        data = getBlobberHandler(data);
        for (i = 0; i < data.length; i++) {
            a = getBlobberHandlerFor(data[i]);
            bsrc1 = upvoteButton;
            bsrc2 = downvoteButton;
            b = '<img class="pointerStyle" id="upvote" src="' + bsrc1 + '" style="width:20px;height:20px;" onclick="voteBlobber(\'up\',\'' + data[i]["id"] + '\')">&nbsp;<upvoteNum>' + data[i]["upvotes"] + '</upvoteNum>&nbsp;<img src="' + bsrc2 + '" class="pointerStyle" id="downvote" style="width:20px;height:20px;" onclick="voteBlobber(\'down\',\'' + data[i]["id"] + '\')"><br>';
            c = '</div>';
            document.getElementById("blobs").innerHTML += a + b + c;
        }
        canScroll = true;
    });
}

function getBlobberSignedIn(sorting) {
    var GoogleAuth = gapi.auth2.getAuthInstance();
    var GoogleUsr = GoogleAuth.currentUser.get();
    // Wenn der Nutzer eingeloggt ist.
    var id_token = GoogleUsr.getAuthResponse().id_token;
    $.get(blobberPath + "getText.py", { "idTkn": id_token, "sorting": sorting, "von": currentScrollPos - scrollPosForNew, "bis": currentScrollPos}, function (data) {
        data = getBlobberHandler(data);
        for (i = 0; i < data.length; i++) {
            a = getBlobberHandlerFor(data[i]);
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
        canScroll = true;
    });
}

function getBlobberHandler(data) {
    data = JSON.parse(data);
    data.reverse();
    return data
}

function getBlobberHandlerFor(dat) {
    unix_timestamp = dat["unxTime"];
    var heute = new Date();
    var date = new Date(unix_timestamp*1000);
    var monate = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
    var formattedTime = ""
    if ((heute - date) / 1000 < 60) {
        formattedTime = Math.round((heute - date) / 1000) + "s"
    } else if ((heute - date) / 1000 / 60 < 60) {
        formattedTime = Math.round((heute - date) / 1000 / 60) + "m"
    } else if ((heute - date) / 1000 / 60 / 60 <= 24) {
        formattedTime = Math.round((heute - date) / 1000 / 60 / 60) + "h"
    } else if (date.getFullYear() == heute.getFullYear()) {
        formattedTime = date.getDate() +  ". " + monate[date.getMonth()];
    } else {
        formattedTime = date.getDate() +  ". " + monate[date.getMonth()] + " " + date.getFullYear();
    }

    return '<div id="' + dat["id"] + '" class="content">' + "<small class='date'>" + formattedTime + "</small>" +  "<b>" + dat["OP"].replace(new RegExp("<", 'g'), '&lt;') + "</b> <br />" + dat["text"].replace(new RegExp("<", 'g'), '&lt;') + " <br />";
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
            $("#alertBoxContent").html(text+"<br />");
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
        document.getElementsByTagName("link").item(8).href = "css/mobile.css";
    }
    document.getElementsByTagName("link").item(7).href = "css/" + theme + ".css";
    
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
            $("#news").html($("#news").html() + '<div class="content newscontent"><small class="date">' + new_dat["date"] + '</small><medium style="font-size:medium">' + new_dat["header"] + "</medium><br />" + new_dat["message"] + "<br />")
        }

    });
}

$.ajaxSetup ({
    // Disable caching of AJAX responses
    // Nicht mehr im cache gespeichert
    cache: false
});