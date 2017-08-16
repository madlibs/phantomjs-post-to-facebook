var page = new WebPage();
var args = require('system').args;
var p_title = args[1];
var p_link = args[2];

//YOUR CREDENTIALS
var email = "YOUR_EMAIL";
var passwd = "YOUR_PASSWORD";
//AND PAGE ID
var page_id = "YOUR_PAGE_ID";

//spoof it as opera mini
page.settings.userAgent = 'Opera/9.80 (Android; Opera Mini/8.0.1807/36.1609; U; en) Presto/2.12.423 Version/12.16';

function login(){
    page.evaluate(function(e, p){
        document.querySelectorAll('[name="email"]')[0].value = e;
        document.querySelectorAll('[name="pass"]')[0].value = p;

        document.querySelectorAll("[value=\'Log In\']")[0].click();
    }, email, passwd);
}

function visitPage(){
    page.open("https://m.facebook.com/" + page_id);
}

function post(title, link){
    page.evaluate(function(t, l) {
        document.querySelectorAll('[name="xc_message"]')[0].value = t + "\n\nRead more: " + l;
        document.querySelectorAll('[name="view_post"]')[0].click();
    }, title, link);
}

page.onLoadFinished = function(status){
    console.log( (!phantom.state ? "no-state" : phantom.state) + ": " + status + " :: " + page.url);
    if(status === "success"){
        if( !phantom.state ){
            login();
            phantom.state = "logged-in";
        } else if(phantom.state === "logged-in"){
            //page.render('loggedin.png');
            visitPage();
            phantom.state = "visited-page";
        }else if(phantom.state === "visited-page") {
            //page.render('page.png');
            post(p_title, p_link);
            phantom.state = "done";
        } else if(phantom.state == "done"){
            //page.render('done.png');
            phantom.exit(0);
        }
    }
};

//clearing cache
page.evaluate(function(){
    localStorage.clear();
});

page.onConsoleMessage = function (message){
    console.log("msg: " + message);
};

page.open("http://m.facebook.com/");
