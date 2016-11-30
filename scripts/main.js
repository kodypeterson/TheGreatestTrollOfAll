var applicationLoading = true;
var audioElement = document.createElement('audio');
var maxVolume = 1;

var trolls = [
    {
        x: 477,
        y: 448,
        name: "Mr. Troll Troll",
        location: "Orlando, FL, USA",
        difficulty: "easy",
        skipCost: 4
    },
    {
        x: 255,
        y: 356,
        name: "Another Troll",
        location: "California, CA, USA",
        difficulty: "easy",
        skipCost: 4
    },
    {
        x: 1024,
        y: 529,
        name: "Another Other Troll",
        location: "Some Other Place",
        difficulty: "hard",
        skipCost: 20
    },
    {
        x: 1512,
        y: 200,
        name: "Another Other Troll",
        location: "Some Other Place",
        difficulty: "hard",
        skipCost: 20
    }
];

$(document).ready(function() {
    initGameApplication();
});


/**
 * Initializes the game application (can also be used as a hard refresh)
 * @return void
 */
function initGameApplication() {
    var views = ['loading', 'introLogo', 'mainMenu', 'game', 'hud'];
    var count = 0;

    applicationLoading = true;
    // Get the views

    views.forEach(function(view) {
        $.ajax('views/' + view + '.html').done(function(data, textStatus, jqXHR) {
            $('#' + view).html(data);
            count ++;

            if (count === views.length) {
                var timer = setInterval(function(){
                    if ($("#gameReady").length) {
                        clearInterval(timer);

                        initGame();
                        initMainMenu();
                        initIntroLogo();
                    }
                }, 200);
            }
        });
    });
}

function activateView(view) {
    $('.gameView.active').removeClass('active');
    $('.gameView#' + view).addClass('active');
}

function playAudio(src, repeat, ae) {
    ae = ae || audioElement;
    ae.setAttribute('src', src);
    ae.currentTime = 0;
    ae.volume = maxVolume;
    ae.loop = repeat || false;
    ae.play();

    return ae;
}

function lowerVolume(requestedVolume, speed, cb) {
    var volume = audioElement.volume;
    if (!speed) {
        speed = 300;
    }
    var int = setInterval(function() {
        if (audioElement.volume > requestedVolume) {
            volume -= 0.1;
        } else {
            volume += 0.1;
        }
        if (volume < 0) {
            volume = 0;
        }
        if (volume > 1) {
            volume = 1;
        }
        audioElement.volume = volume;
        if (volume <= requestedVolume) {
            clearInterval(int);
            if (cb) {
                cb();
            }
        }
    }, speed);
}

function stopAudio(fade, speed) {
    if (fade) {
        lowerVolume(0, speed, function() {
            audioElement.pause();
        });
    } else {
        audioElement.pause();
    }
}
