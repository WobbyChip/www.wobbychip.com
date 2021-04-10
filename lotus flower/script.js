var loc = window.location.href.toLowerCase().split("#").pop();
var audio = new Audio();
audio.loop = true;

function PlaySound(FileName) {
    audio.src = FileName;
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

if (loc == "music") {
    PlaySound("Lotus Flower.mp3");
    document.getElementById("musicContainer").style = null;
}

if (loc == "video") {
    document.body.style.backgroundColor = "#000";
    document.getElementById("videoContainer").style = null;
    document.getElementById("video").src = "https://www.youtube.com/embed/2eHfvp4oI3I?VQ=HD720&autoplay=1&mute=1&loop=1&playlist=2eHfvp4oI3I";
}

