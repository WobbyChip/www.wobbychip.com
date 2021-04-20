var splitted = "https://github.com/Temporaly001/playlist/tree/main/lofi%20hip%20hop".split("/");
var playlist;
var preload = {};
var audio = new Audio();
var marqueeSong;
var marqueeArtist;

function RandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function isElementOverflowing(element) {
    var overflowX = element.offsetWidth < element.scrollWidth,
        overflowY = element.offsetHeight < element.scrollHeight;

    return (overflowX || overflowY);
}

function BytesToSize(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes)/Math.log(1024)));
    return Math.round(bytes/Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function Base64ToBlob(base64, type) {
    var byteString = atob(base64);
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var uintArray = new Uint8Array(arrayBuffer);

    for (var i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], {type});
}

async function LoadPlaylist() {
    return await new Promise(resolve => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.github.com/repos/${splitted[3]}/${splitted[4]}/git/trees/${splitted[6]}:${splitted[7]}`);
        xhr.onload = function() {
            resolve(xhr.response);
        };
        xhr.send();
    });
}

async function LoadFile(sha) {
    return await new Promise(resolve => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.github.com/repos/${splitted[3]}/${splitted[4]}/git/blobs/${sha}`);
        xhr.onload = function() {
            resolve(xhr.response);
        };
        xhr.send();
    });
}

async function Preload() {
    var num = RandomInt(playlist.tree.length);
    var response = JSON.parse(await LoadFile(playlist.tree[num].sha));
    var name = playlist.tree[num].path;
    var type = `audio/${name.split('.').pop()}`;

    preload = {
        name: name,
        size: BytesToSize(response.size),
        type: type,
        base64: response.content,
    }

    console.log(`Preloaded '${preload.name}' | Size: ${preload.size}`);
}

async function ShuffleMusic() {
    document.getElementById("button").disabled = true;

    if (Object.entries(preload).length === 0) {
        await Preload();
    }

    await PlaySound(preload);
    await Preload();

    document.getElementById("button").disabled = false;
}

async function PlaySound(preload) {
    console.log(`Playing '${preload.name}' | Size: ${preload.size}`);
    await LoadTags(Base64ToBlob(preload.base64, preload.type));

    audio.onended = function() {
        ShuffleMusic();
    };

    audio.src = `data:${preload.type};base64,${preload.base64}`;
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

function CheckMarquee() {
    if (marqueeSong) {
        marqueeSong.marquee("destroy");
    }

    if (marqueeArtist) {
        marqueeArtist.marquee("destroy");
    }

    setTimeout(function() {
        if (isElementOverflowing(document.getElementsByClassName("song")[0])) {
            marqueeSong = $(".song").marquee({
                direction: "left",
                duplicated: true,
                startVisible: true
            });
        }

        if (isElementOverflowing(document.getElementsByClassName("artist")[0])) {
            marqueeArtist = $(".artist").marquee({
                direction: "left",
                duplicated: true,
                startVisible: true
            });
        }
    }, 1000);
}

async function LoadTags(blob) {
    return await new Promise(resolve => {
        new jsmediatags.Reader(blob)
            .setTagsToRead(["title", "album", "artist", "picture"])
            .read({
                onSuccess: function(tag) {
                    var tags = tag.tags;

                    if ((tags.title) && (tags.album)) {
                        var name = `${tags.title}${" - "}${tags.album}`
                    } else if ((tags.title) && !(tags.album)) {
                        var name = tags.title;
                    } else if (!(tags.title) && (tags.album)) {
                        var name = tags.album;
                    } else {
                        var name = "Unknown name";
                    }

                    document.getElementById('songLeft').textContent = name;
                    document.getElementById('songRight').textContent = name;

                    document.getElementById('artistLeft').textContent = tags.artist || "Unknown artist";
                    document.getElementById('artistRight').textContent = tags.artist || "Unknown artist";

                    CheckMarquee();

                    if (tags.picture) {
                        var base64 = "";
                        for (var i = 0; i < tags.picture.data.length; i++) {
                            base64 += String.fromCharCode(tags.picture.data[i]);
                        }

                        base64 = `data:${tags.picture.format};base64,${window.btoa(base64)}`;
                        document.getElementById('coverLeft').setAttribute('src', base64);
                        document.getElementById('coverRight').setAttribute('src', base64);
                    } else {
                        document.getElementById('coverLeft').setAttribute('src', '..\resources\cover.png');
                        document.getElementById('coverRight').setAttribute('src', '..\resources\cover.png');
                    }

                    console.log("Loaded metadata.\n ");
                    resolve();
                },
                onError: function(error) {
                    console.log(error);
                    resolve();
                }
            });
    });
}

(async () => {
    playlist = JSON.parse(await LoadPlaylist());
    ShuffleMusic();
})();

