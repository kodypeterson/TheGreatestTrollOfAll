function initGame() {
    setInterval(function() {
        $('#game .correct').css('color', randomColor());
    }, 500);
}

function gameStart(troll) {
    function getQuestion() {
        $.ajax({
            url: "http://cors-anywhere.herokuapp.com/https://opentdb.com/api.php?amount=1&difficulty=" + troll.difficulty + "&type=multiple",
            method: "GET",
            crossOrigin: true
        }).done(function(response) {
            $("#game .question .answer").remove();
            $("#game .question .quest").html(response.results[0].question);

            response.results[0].incorrect_answers.push(response.results[0].correct_answer);
            function shuffleArray(array) {
                for (var i = array.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
                return array;
            }

            var answers = shuffleArray(response.results[0].incorrect_answers);
            answers.forEach(function(answer) {
                var btn = $("<button>").addClass('answer').text(answer).click(function() {
                    if ($(this).text() === response.results[0].correct_answer) {
                        defeatTroll();
                    } else {
                        damagePlayer();
                    }
                });
                $("#game .question").append(btn);
            });

            $('#game .question').fadeIn();
        });
    }

    function defeatTroll() {
        $(".hud #gp").text(parseInt($(".hud #gp").text()) + 10);
        if (parseInt($(".hud #hp").text()) !== 100) {
            $(".hud #hp").text(parseInt($(".hud #hp").text()) + 10);
        }

        $(".hud .item.trollInfo").fadeOut();
        $('#game .question').fadeOut();
        $('.spot#troll' + troll.idx).addClass('defeated');
        $("#game #troll").animate({
            bottom: "+=200"
        }, function() {
            $("#game #troll").animate({
                bottom: "-=700"
            }, function() {
                $('.pyro').fadeIn();
                $('#game .correct').fadeIn();

                $("#game #player_run").show();
                $("#game #player").hide();
                $("#game #player_run").animate({
                    left: "+=" + ($('body').width() + 50)
                }, 2000, function() {
                    setTimeout(function() {
                        $("#loading .content").fadeIn();
                        lowerVolume(0, 300, function() {
                            setTimeout(function (){
                                $("#game").hide();
                                $(".hud .status").text("Select A Troll To Battle!");
                                $("#mainMenu").fadeIn();
                                $("#loading .content").fadeOut();
                                playMainMenuMusic();
                            }, 1300);
                        });
                    }, 2000);
                })
            })
        });
    }

    function damagePlayer() {
        $('#game .question').fadeOut();

        $(".hud #hp").text(parseInt($(".hud #hp").text()) - 10);
        $("#game #player_dizzy").css('bottom', $("#game #player").css('bottom'));
        $("#game #player_dizzy").show();
        $("#game #player").hide();

        if (parseInt($(".hud #hp").text()) !== 0 && parseInt($(".hud #hp").text()) !== 0) {
            $(".hud #gp").text(parseInt($(".hud #hp").text()) - 10);
        }

        setTimeout(function() {
            if (parseInt($(".hud #hp").text()) === 0) {
                $("#game").fadeOut(4000);
                $(".hud").fadeOut(4000);

                setTimeout(function() {
                    $(".spot.defeated").removeClass("defeated");
                    $(".hud .item.trollInfo").hide();
                    $(".hud #hp").text('100');
                    $(".hud #gp").text('0');
                    $(".hud .status").text("Select A Troll To Battle!");
                    $("#mainMenu").fadeIn();
                    $(".hud").fadeIn();
                }, 7000);
            } else {
                $("#game #player").show();
                $("#game #player_dizzy").hide();

                getQuestion();
            }
        }, 3000);
    }

    $('.pyro').hide();
    $('#game .correct').hide();
    var start = new Date();

    // Get the trivia question
    getQuestion();

    // Get the background photo
    var params = {
        method: "flickr.photos.search",
        api_key: "028f570aae18bf9462e7f1e85ea9598e",
        tags: 'landscape ' + troll.location,
        sort: "relevance",
        dimension_search_mode: "min",
        height: 2048,
        width: 2048,
        orientation: "landscape",
        media: "photos",
        content_type: 7,
        format: "json",
        nojsoncallback: 1,
        parse_tags: 1
    };

    $.ajax({
        url: "https://api.flickr.com/services/rest/?" + $.param(params),
        method: "get"
    }).done(function(response) {
        $('#game .question').hide();
        var photo = response.photos.photo[Math.floor(Math.random()*response.photos.photo.length)];

        params = {
            method: "flickr.photos.getSizes",
            api_key: "028f570aae18bf9462e7f1e85ea9598e",
            photo_id: photo.id,
            format: "json",
            nojsoncallback: 1
        };

        $.ajax({
            url: "https://api.flickr.com/services/rest/?" + $.param(params),
            method: "get"
        }).done(function(response) {
            $("#game #gameBackground").one("load", function() {
                var now = new Date();
                var diff = now - start;
                // Have the loading be at least 4 seconds
                var timeLeft = 4000 - diff;
                if (timeLeft < 0) {
                    timeLeft = 0;
                }

                setTimeout(function() {
                    maxVolume = 0.7;
                    playAudio('sounds/battle.mp3', true);

                    $("#game #gameBackground").attr("src", "");
                    // Image is loaded
                    $("#loading .content").fadeOut();
                    $("#game").fadeIn(doAnimations);
                    drawBridge();
                    $(".hud .status").text("BATTLE!!!");
                }, timeLeft);
            });
            $("#game #gameBackground").attr("src", response.sizes.size[response.sizes.size.length - 3].source);
            $("#game #gameBackground").css("background-image", "url(" + response.sizes.size[response.sizes.size.length - 3].source + ")");

            $("#game #troll").attr("src", troll.img);
        });
    });

    function doAnimations() {
        // Troll
        $("#game #troll").css('bottom', '10%');
        var bottomExpectation = parseFloat($("#game #troll").css('bottom').replace('px', ''));
        bottomExpectation += $("#game .bridgeWrapper").height();
        $("#game #troll").css("bottom", '-500px');
        $("#game #troll").animate({
            bottom: "+=" + (bottomExpectation + 700)
        }, function() {
            $("#game #troll").animate({
                bottom: "-=200"
            }, function() {
                console.log('done');
            })
        });

        $("#game #player_run").css('bottom', '10%');
        var bottom = parseFloat($("#game #player_run").css('bottom').replace('px', ''));
        bottom += $("#game .bridgeWrapper").height();
        $("#game #player_run").css('bottom', bottom + 'px');
        $("#game #player").css('bottom', bottom + 'px');

        $("#game #player_run").css("left", "-450px");
        setTimeout(function() {
            $("#game #player_run").animate({
                left: "+=550"
            }, function() {
                $("#game #player_run").hide();
                $("#game #player").show();


                $('#game .question').fadeIn();
            })
        }, 150);
    }
}

var bridgeTileWidth = 30;

function getBridgeCalc(){
    var bridgeWidth = $('body').width();
    return Math.round(bridgeWidth/bridgeTileWidth) + 1;
}

function drawBridge() {
    var calc = getBridgeCalc();
    var bridgeHull = $('.bridgeWrapper');
    bridgeHull.empty();

    for (var i = 0; i < calc; i++) {
        bridgeHull.append(
            '<div class="bridgeWalkwayWrapper">' +
            '<div class="arrow-down"></div>' +
            '<div class="arrow-left"></div>' +
            '<div class="arrow-right"></div>' +
            '<div class="arrow-up"></div>' +
            '</div>'
        )
    }

    //struts
    for (var i = 4; i > 0; i--) {
        var style = '';

        if (i !== 1) {
            bridgeHull.append(
                '<div class="bridgeWalkwayWrapper strutLeft" style="margin-left:' + (i - 2) * bridgeTileWidth + 'px; clear: both;">' +
                '<div class="arrow-up"></div>' +
                '<div class="arrow-left"></div>' +
                '</div>'
            );
        } else {
            style = 'clear: both;';
        }

        bridgeHull.append(
            '<div class="bridgeWalkwayWrapper strutLeft" style="' + style + '">' +
            '<div class="arrow-down"></div>' +
            '<div class="arrow-right"></div>' +
            '</div>'
        );
    }

    var c = 1;
    for (var i = 4; i > 0; i--) {
        style = '';


            bridgeHull.append(
                '<div class="bridgeWalkwayWrapper strutRight" style="margin-right:' + ((c + 2) * bridgeTileWidth) + 'px; margin-top:' + (i * bridgeTileWidth) + 'px; clear: both;">' +
                '<div class="arrow-down"></div>' +
                '<div class="arrow-left"></div>' +
                '</div>'
            );


        style += 'margin-right: ' + (((c + 2)  * bridgeTileWidth) - bridgeTileWidth) + 'px; margin-top:' + (i * bridgeTileWidth) + 'px';
        bridgeHull.append(
            '<div class="bridgeWalkwayWrapper strutRight" style="' + style + '">' +
            '<div class="arrow-up"></div>' +
            '<div class="arrow-right"></div>' +
            '</div>'
        );
        c++;
    }

    changeWalkway();
}

function randomColor() {
    return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';;
}

function changeWalkway(){
    var rgb;
    var triangles = $('.bridgeWalkwayWrapper').children();

    for(var i =0; i<triangles.length; i++){
        if($(triangles[i])[0].className == 'arrow-down') {
            $(triangles[i]).css("border-top-color", randomColor());
        } else if($(triangles[i])[0].className == 'arrow-left'){
            $(triangles[i]).css("border-right-color", randomColor());

        }else if($(triangles[i])[0].className == 'arrow-right'){
            $(triangles[i]).css("border-left-color", randomColor());

        }else if($(triangles[i])[0].className == 'arrow-up'){
            $(triangles[i]).css("border-bottom-color", randomColor());

        }
    }
}

