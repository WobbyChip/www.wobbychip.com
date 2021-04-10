var splitted = "https://github.com/wobbychip/playlist/tree/main/lofi%20hip%20hop".split("/");
var playlist;
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

function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
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
        xhr.onload = function(e) {
            resolve(xhr.response);
        };
        xhr.send();
    });
}

async function LoadFile(sha) {
    return await new Promise(resolve => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.github.com/repos/${splitted[3]}/${splitted[4]}/git/blobs/${sha}`);
        xhr.onload = function(e) {
            resolve(xhr.response);
        };
        xhr.send();
    });
}

async function ShuffleMusic() {
    document.getElementById("button").disabled = true;
    var num = RandomInt(playlist.tree.length);
    var respone = JSON.parse(await LoadFile(playlist.tree[num].sha));

    console.log(`Playing '${playlist.tree[num].path}' | Size: ${bytesToSize(respone.size)}`)
    PlaySound(respone.content, `audio/${name.split('.').pop()}`);
}

function PlaySound(base64, type) {
    var blob = Base64ToBlob(base64, type);
    console.log("Converted audio to blob.")
    LoadTags(blob);

    audio.onended = function() {
        ShuffleMusic();
    };

    audio.src = "data:audio/mp3;base64," + base64;
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
            marqueeSong = $('.song').marquee({
                direction: 'left',
                duplicated: true,
                startVisible: true
            });
        }
    
        if (isElementOverflowing(document.getElementsByClassName("artist")[0])) {
            marqueeSong = $('.artist').marquee({
                direction: 'left',
                duplicated: true,
                startVisible: true
            });
        }
    }, 1000);
}

function LoadTags(blob) {
    jsmediatags.read(blob, {
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

                base64 = "data:" + tags.picture.format + ";base64," + window.btoa(base64);
                document.getElementById('coverLeft').setAttribute('src', base64);
                document.getElementById('coverRight').setAttribute('src', base64);
            } else {
                document.getElementById('coverLeft').setAttribute('src', '..\resources\cover.png');
                document.getElementById('coverRight').setAttribute('src', '..\resources\cover.png');
            }

            document.getElementById("button").disabled = false;
            console.log("Loaded metadata.")
        },
        onError: function(error) {
            console.log(error);
        }
    });
}

(async () => {
    playlist = JSON.parse(await LoadPlaylist());
    ShuffleMusic();
})();

