function initIntroLogo() {
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
                $("#introLogo .content .troll_intro button").fadeIn({
                    duration: 2000
                });
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
        var introText = $("#introText");
        var script = [
            "All around the globe trolls are hiding...",
            "quietly waiting for the people of the world...",
            "to cross their bridge.",
            "This is the story of one player...",
            "out to defeat all of the trolls...",
            "and take back the bridges once and for all!"
        ];
        var currentIdx = 0;

        enlargeGlobe();

        var int = setInterval(showText, 4000);
        showText();

        function showText() {
            introText.text(script[currentIdx]);
            introText.fadeIn({
                duration: 500
            });
            setTimeout(function() {
                introText.fadeOut({
                    duration: 500
                });
            }, 3000);
            currentIdx++;
            if (currentIdx === script.length) {
                clearInterval(int);

                $("#introLogo .content .troll_intro").fadeIn({
                    duration: 5000
                });

                setTimeout(transitionToMenu, 8000);
            }
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
            duration: 25000,
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

        lowerVolume(0.4, 600);

        setTimeout(function() {
            $('#mainMenu .globe .contents .map .spot').each(function(idx, spot) {
                $(spot).delay(idx * 500).toggle("bounce", { times: 3 }, "slow" );
            });
            activateView('mainMenu');
        }, 3000);
    }
}
