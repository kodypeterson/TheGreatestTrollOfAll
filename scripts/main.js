var applicationLoading = true;
var audioElement = document.createElement('audio');
var maxVolume = 1;

initGameApplication();

/**
 * Initializes the game application (can also be used as a hard refresh)
 * @return void
 */
function initGameApplication() {
    var views = ['introLogo', 'mainMenu', 'game'];
    var promises = [];

    applicationLoading = true;
    // Get the views

    views.forEach(function(view) {
        var promise = $.ajax({
            method: 'get',
            url: 'views/' + view + '.html'
        });
        promises.push(promise);
    });

    $.when(promises).then(function(results) {
        views.forEach(function(view, idx) {
            $('#' + view).html(results[idx].responseText);
        });

        initIntroLogo();
        initMainMenu();
    });
}

function activateView(view) {
    $('.gameView.active').removeClass('active');
    $('.gameView#' + view).addClass('active');
}

function transitionAudio(src, speed, repeat) {
    if (!speed) {
        speed = 600;
    }

    var newAudioElement = document.createElement('audio');
    newAudioElement.setAttribute('src', src);
    newAudioElement.volume = 0;
    newAudioElement.loop = repeat || false;
    newAudioElement.play();
    var volume = 0;
    var int = setInterval(function() {
        volume += 0.1 * maxVolume;
        if (volume > 1) {
            volume = 1;
        }
        newAudioElement.volume = volume;
        if (volume >= maxVolume) {
            clearInterval(int);
            $(audioElement).remove();
            setTimeout(function() {
                audioElement = newAudioElement;
            }, 0);
        }
    }, speed);
    stopAudio(true, 600);
}

function playAudio(src, repeat) {
    audioElement.setAttribute('src', src);
    audioElement.currentTime = 0;
    audioElement.volume = maxVolume;
    audioElement.loop = repeat || false;
    audioElement.play();
}

function stopAudio(fade, speed) {
    if (!speed) {
        speed = 300;
    }
    if (fade) {
        var volume = 1;
        var int = setInterval(function() {
            volume -= 0.1;
            if (volume < 0) {
                volume = 0;
            }
            audioElement.volume = volume;
            if (volume === 0) {
                clearInterval(int);
                audioElement.pause();
            }
        }, speed);
    } else {
        audioElement.pause();
    }
}
