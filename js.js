var upvoteButton = "./img/light/upvote.svg"
var upvoteButtonPress = "./img/light/upvoted.svg"
var downvoteButton = "./img/light/downvote.svg"
var downvoteButtonPress = "./img/light/downvoted.svg"

var isMobile = false;
var isSignedIn = false;
var isWindowsApp = false;

var currentScrollPos = 0;
var scrollPosForNew = 20;
var canScroll = true;

var maxBlobs = 0;
var current_sorting = "new";
var hereAmI = window.location.href


//
// SIGN IN STUFF
let client = new jso.JSO({
    providerID: "google",
    client_id: "275158525519-85frhpipfiqpn0414mhnaaookojo5g0j.apps.googleusercontent.com",
    authorization: "https://accounts.google.com/o/oauth2/auth",
    redirect_uri: location.protocol + '//' + location.host + location.pathname + "popUp.html",
    scopes: { 
        request: ["https://www.googleapis.com/auth/userinfo.profile"]
    },
    request: {
		prompt: "select_account"
	}
});
client.callback();

function authorizePopup() {
    client.setLoader(jso.Popup)
    client.getToken({})
		.then((token) => {
            onSignIn();
		})
		.catch((err) => {
			console.error("Error from passive loader", err)
    })
}

function onSignIn() {
    document.getElementById("log").className = "logOut";
    document.getElementById("log").setAttribute("onclick", "logOut();");
    document.getElementById("log").innerHTML = '<img height="40px" src="img/signOut.svg">';
    
    closeAlertBox();
    isSignedIn = true;
    getOwnUsername();
    handleParameters(true);
    setSignedInState(true);
    console.log("signed in")
}

function getToken() {
    var token = client.getToken({})["_v"]["id_token"]
    return token
}

function logOut() {
    setSignedInState(false);
    client.wipeTokens();
    location.reload();

}
function setSignedInState(signedIn) {
    var date = new Date();
    tage = 365 
    date.setTime(date.getTime() + (tage*24*60*60*1000));
    document.cookie = 'isSignedIn='+ signedIn +'; expires=' + date.toUTCString() + '; path=/';
}

function getSignedInState() {
    cook = document.cookie;
    try {
        split = cook.split("; ");
    } catch (error) {
        console.log("Error: No Cookies D=")
    }
    for (i = 0; i < split.length; i++) {
        parameter = split[i].split("=");
        if (parameter[0] == "isSignedIn") {
            if (parameter[1] == "true") {
                console.log(parameter)
                onSignIn();
            } 
            return
        }
    }
}
// SIGN IN STUFF END
//


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

function closeAlertBox() {
    document.getElementById("alertBox").style.display = "none";
    document.getElementById("banner").style.opacity = "1";
    document.getElementById("contentHolder").style.opacity = "1";
    document.getElementById("derGradient").style.opacity = "1";
}

window.onresize = function (event) {
    stuffToTheRightPlace();
}
window.onload = function (event) {
    //stuffToTheRightPlace();
}

function stuffToTheRightPlace() {
    document.getElementById("contentHolder").style.height = window.innerHeight - 102 + "px";
    document.getElementById("contentHolder").style.paddingLeft = (window.innerWidth- 1200)/2 + "px";
    document.getElementById("contentHolder").style.paddingRight = (window.innerWidth- 1200)/2 + "px";
    if ((window.innerWidth - 1200)/2 < 20) {
        document.getElementById("news").className = "nodisplay";
        document.getElementById("theRealStuff").style.width = "100%";
            
        var the_width = window.innerWidth - 500;
        if (the_width < 0) {
            the_width = 0;
        }
        if (the_width <= 16) {
            document.getElementById("contentHolder").style.paddingTop = the_width + "px";
            document.getElementById("contentHolder").style.paddingBottom = the_width+ "px";
            document.getElementById("contentHolder").style.height = (window.innerHeight - the_width - $("#banner").height() - 1) + "px";
        } else {
            document.getElementById("contentHolder").style.paddingTop = 16 + "px";
            document.getElementById("contentHolder").style.paddingBottom = 16+ "px";
        }
        document.getElementById("contentHolder").style.paddingLeft = the_width /2 + "px";
        document.getElementById("contentHolder").style.paddingRight = the_width /2 + "px";
    } else {
        document.getElementById("news").className = "";
        document.getElementById("theRealStuff").style.width = "60%";
    }
    document.getElementById("derGradient").style.width = window.innerWidth + "px";
    document.getElementById("blobInput").style.width = $("#theRealStuff").width() - 110 + "px";
}

var blobberPath = "";
var commentUrl = "";
var userUrl = "";
$(document).ready(function () {
    $.getJSON("files.json", function (data) {
        blobberPath = data["web"];
        commentUrl = data["commentUrl"];
        userUrl = data["userUrl"];
        moveOn();
    });

});

function moveOn() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        isMobile = true;
    }
    getNews();
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
    handleParameters(true);

    if (isWindowsApp) {
        //$("#sendImg").attr("padding-right", "10px");
        //$("#numbers a").css("padding-right","10px");
        //$("#contentHolder").css("overflow","hidden");
    }

    stuffToTheRightPlace();
    //searchForNew();

    getSignedInState();

    document.getElementById("contentHolder").onscroll = function(ev) {
        var wind = document.getElementById("contentHolder");
        //console.log((wind.clientHeight + wind.scrollTop) + " " + wind.scrollHeight)
        if ((wind.clientHeight + wind.scrollTop) >= wind.scrollHeight - $("#contentHolder").height() && canScroll) {
            canScroll = false;
            if (currentScrollPos <= 0) {
                return;
            }
            newCurrentScrollPos = currentScrollPos - scrollPosForNew;
            if (newCurrentScrollPos > 0) {
                currentScrollPos = newCurrentScrollPos;
                handleParameters(false);
            } else {
                scrollPosForNew = currentScrollPos;
                handleParameters(false);
                currentScrollPos = 0;
            }
            console.log("load new..")
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

function newBlobber(comment = "") {
    value = document.getElementById("blobInput").value;
    if (value == "") {
        return;
    }
    document.getElementById("blobInput").value = "";

    var id_token = getToken();

    //wenn der Nutzer nicht angemeldet ist, kann er nichts senden
    if (id_token == null) {
        authorizePopup();
        return;
    }

    $.get(blobberPath + "putText.py", { "idTkn": id_token, "text": value, "comment":comment }, function (data) {
        console.log("put Blobber:" + data);
        textAlertBoxDelay("gesendet", 2000); 
    });

}

function getBlobber(sorting, appendTo, isNew = false, getComment="", userId="") {
    // Wenn der Nutzer nicht eingeloggt ist.
    if (isNew) {
        $.getJSON(blobberPath + "getText.py", {"sorting": sorting, "von": 0, "bis": 0, "getLenght":"True", "comment":getComment, "userId":userId}, function (data) {
            currentScrollPos = data["lenght"];
            maxBlobs = data["lenght"];
            document.getElementById("blobs").innerHTML = ""; 
            callBlobber(sorting, appendTo, getComment, userId);
        });
        return
    }
    callBlobber(sorting, appendTo, getComment, userId)
}

function callBlobber(sorting, appendTo, getComment, userId) {
    if (!isSignedIn) {
        getBlobberSignedOut(sorting, appendTo, getComment, userId);
        return;
    }
    getBlobberSignedIn(sorting, appendTo, getComment, userId);
}

function getBlobberSignedOut(sorting, appendTo, getComment, userId) {
    $.get(blobberPath + "getText.py", { "sorting": sorting, "von": currentScrollPos - scrollPosForNew, "bis": currentScrollPos, "comment":getComment, "userId":userId }, function (data) {
        getBlobberHandler(data, appendTo);
    });
}

function getBlobberSignedIn(sorting, appendTo, getComment, userId) {
    // Wenn der Nutzer eingeloggt ist.
    var id_token = getToken();
    $.get(blobberPath + "getText.py", { "idTkn": id_token, "sorting": sorting, "von": currentScrollPos - scrollPosForNew, "bis": currentScrollPos, "comment":getComment, "userId": userId}, function (data) {
        getBlobberHandler(data, appendTo);
    });
}

function getBlobberHandler(data, appendTo) {
    data = JSON.parse(data);
    if (data["comments"]) {
        $("#comment").html(printBlobs(data["originalBlob"]));
        data = data["comments"];
    }
    if (data.lenght < 1) {return []}
    //console.log(data)
    data.reverse();

    for (i = 0; i < data.length; i++) {
        appendTo.innerHTML += printBlobs(data[i]); 
    }
    canScroll = true;
}

function printBlobs(dat) {
    unix_timestamp = dat["unxTime"];
    var heute = new Date();
    var date = new Date(unix_timestamp*1000);
    var monate = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
    var formattedTime = ""
    if ((heute - date) / 1000 < 60) {
        formattedTime = Math.floor((heute - date) / 1000) + "s"
    } else if ((heute - date) / 1000 / 60 < 60) {
        formattedTime = Math.floor((heute - date) / 1000 / 60) + "m"
    } else if ((heute - date) / 1000 / 60 / 60 <= 24) {
        formattedTime = Math.floor((heute - date) / 1000 / 60 / 60) + "h"
    } else if (date.getFullYear() == heute.getFullYear()) {
        formattedTime = date.getDate() +  ". " + monate[date.getMonth()];
    } else {
        formattedTime = date.getDate() +  ". " + monate[date.getMonth()] + " " + date.getFullYear();
    }

    a = '<div id="' + dat["id"] + '" onclick="showComments(true, id)" class="content">' + "<small class='date'>" + formattedTime + "</small>" +  "<b>" + dat["OP"].replace(new RegExp("<", 'g'), '&lt;') + "</b> <br />" + dat["text"].replace(new RegExp("<", 'g'), '&lt;') + " <br />";

    bsrc1 = upvoteButton;
    bsrc2 = downvoteButton;
    if (isSignedIn) {
        if (dat["isUpvoted"] == true) {
            bsrc1 = upvoteButtonPress;
        }
        if (dat["isDownvoted"] == true) {
            bsrc2 = downvoteButtonPress;
        }
    }
    b = '<img class="pointerStyle" id="upvote" src="' + bsrc1 + '" style="width:20px;height:20px;" onclick="voteBlobber(\'up\',\'' + dat["id"] + '\')">&nbsp;<upvoteNum>' + dat["upvotes"] + '</upvoteNum>&nbsp;<img src="' + bsrc2 + '" class="pointerStyle" id="downvote" style="width:20px;height:20px;" onclick="voteBlobber(\'down\',\'' + dat["id"] + '\')"><br>';
    c = '</div>';
    return a + b + c;
}

function voteBlobber(vote, postId) {
    // Wenn der Nutzer nicht eingeloggt ist, kann er nicht upvoten
    if (getToken() == null) {
        authorizePopup();
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

    var id_token = getToken();

    $.get(blobberPath + "vote.py", { "idTkn": id_token, "postId": postId, "vote": vote }, function (data) {
        console.log(data)
    });

}

function getOwnUsername() {
    var id_token = getToken();
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
    var id_token = getToken();
    $.get(blobberPath + "saveUserDat.py", { "idTkn": id_token, "data":"name", "dataValue":name}, function (data) {
        console.log(data)
    });
}

function change_theme(theme, setcookie = true) {
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

function showComments(cNew, id) {
    noShowUser();
    window.history.pushState('Comments', 'Blobber', location.protocol + '//' + location.host + location.pathname + commentUrl + id);
    new_html = $("#" + id).wrap('<div>').parent().html();
    $("#comment").html(new_html);
    $("#the_list_item").unwrap();
    $("#blobInput").attr("placeHolder", "Neuer Kommentar");
    $("#sendImg").attr("onclick","newBlobber("+ id +")");
    $("#comment").removeClass("nodisplay");
    getBlobber("new", document.getElementById("blobs"), cNew, id);
}
function noShowComments() {
    $("#blobInput").attr("placeHolder", "Neuer Blob");
    $("#sendImg").attr("onclick","newBlobber()");
}

function showBlobs(cNew) {
    $("#comment").addClass("nodisplay");
    noShowUser();
    noShowComments();
    window.history.pushState('Comments', 'Blobber', location.protocol + '//' + location.host + location.pathname);
    getBlobber(current_sorting, document.getElementById("blobs"), cNew);
}

function showUser(cNew, user) {
    noShowComments();
    $("#comment").removeClass("nodisplay");
    window.history.pushState('Comments', 'Blobber', location.protocol + '//' + location.host + location.pathname + userUrl + user);
    $("#comment").html("<div class='content'><b>Nutzer</b></div>");
    $("#theSender").addClass("nodisplay");
    getBlobber("user", document.getElementById("blobs"), cNew, "", user);
}
function noShowUser() {
    $("#comment").html("");
    $("#theSender").removeClass("nodisplay");
}

$.ajaxSetup ({
    // Disable caching of AJAX responses
    // Nicht mehr im cache gespeichert
    cache: false
});

window.onpopstate = function(event) {
    handleParameters(true);
}

function handleParameters(cNew) {
    comment = GetURLParameter("comment");
    user = GetURLParameter("user");
    if (comment) {
        showComments(cNew, comment);
        return;
    } else if (user) {
        showUser(cNew, user);
        return;
    }
    showBlobs(cNew);
}

//Nächste Funktion wurde dreist kopiert von: http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}
