function initIntroLogo() {
    activateView('introLogo');
    $("#hud").hide();
    $("#introLogo .overlay").css("display", "block");
    var increaseBy = 800;
    playAudio("sounds/intro.mp3", true);

    $('#mainMenu .globe .contents .map .spot').css('display', 'none');

    setTimeout(function () {
        $("#introLogo .content .troll_intro img").fadeIn({
            duration: 5000
        });
        setTimeout(function () {
            $("#introLogo .content .troll_intro .text").fadeIn({
                duration: 6000
            });
            setTimeout(function () {
                startGame();
            }, 3000);
        }, 6000);
    }, 500);

    $("#introLogo .content .troll_intro button").click(startGame);
    function startGame() {
        $("#introLogo .content .troll_intro").fadeOut({
            duration: 5000
        });
        $("#introLogo .content .troll_intro button").fadeOut({
            duration: 5000
        });
        setTimeout(playIntroScene, 2000);
    }

    function playIntroScene() {
        var morganAudioElement = document.createElement('audio');
        var introText = $("#introText");
        var script = [
            "All around the globe trolls are hiding...",
            "quietly waiting for the people of the world to cross their bridge.",
            "This is the story of an audacious player...",
            "out to defeat all of the trolls...",
            "and take back the bridges once and for all!",
            "It's your duty to succeed!",
            "Go forth,",
            "CONQUER!!!"
        ];
        var currentIdx = 0;

        enlargeGlobe();
        showText();
        lowerVolume(0.5, 600);

        function showText() {
            introText.text(script[currentIdx]);
            introText.fadeIn(500, function() {
                playAudio("sounds/morgan/morgan_0" + (currentIdx + 1) + ".mp3", false, morganAudioElement);
                morganAudioElement.onended = function() {
                    setTimeout(function () {
                        introText.fadeOut(500, function () {
                            currentIdx++;
                            if (currentIdx === script.length) {
                                $("#introLogo .content .troll_intro").fadeIn({
                                    duration: 5000
                                });

                                setTimeout(transitionToMenu, 8000);
                            } else {
                                showText();
                            }
                        });
                    }, 500);
                };
            });
        }
    }

    function enlargeGlobe() {
        $("#mainMenu .globe").animate({
            height: "+=" + increaseBy,
            width: "+=" + increaseBy,
            borderRadius: "+=" + increaseBy,
            marginLeft: "-=" + (increaseBy/2),
            marginTop: "-=" + (increaseBy/2)
        }, {
            duration: 35000,
            easing: "linear"
        });

        $("#mainMenu .globe img").animate({
            marginLeft: "-=400"
        }, {
            duration: 25000,
            easing: "linear"
        });
    }

    function transitionToMenu() {
        $("#introLogo").fadeOut(3000);

        $("#mainMenu .globe").animate({
            height: "-=" + increaseBy,
            width: "-=" + increaseBy,
            borderRadius: "-=" + increaseBy,
            marginLeft: "+=" + (increaseBy/2),
            marginTop: "+=" + (increaseBy/2)
        }, {
            duration: 3000,
            easing: "linear"
        });



        $("#mainMenu .globe img").animate({
            marginLeft: "+=400"
        }, {
            duration: 3000,
            easing: "linear"
        });

        lowerVolume(0, 2800);

        setTimeout(function() {
            $('#mainMenu .globe .contents .map .spot').each(function(idx, spot) {
                $(spot).delay(idx * 500).toggle("bounce", { times: 3 }, "slow" );
            });
            $("#hud").fadeIn();
            activateView('mainMenu');
        }, 3000);
    }
}
