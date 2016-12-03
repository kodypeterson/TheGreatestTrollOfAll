function initMainMenu() {
    var allowGlobeDrag = true;
    var isZoomedIn = false;
    var imgOrigWidth = 1960;
    var imgOrigHeight = 1094;
    var widthDif = imgOrigWidth/imgOrigHeight;

    var mapImg = $('#mainMenu .globe .contents .map img');
    var resetWidth = mapImg.width();
    var resetHeight = mapImg.height();
    var widthScale = mapImg.width() / imgOrigWidth;
    var heightScale = mapImg.height() / imgOrigHeight;

    $("#trollInfo #battle").click(goToBattle);

    trolls.reverse();
    trolls.forEach(function(troll, idx) {
        troll.idx = idx;
        var div = $('<div>');
        div.attr('id', 'troll' + idx);
        div.addClass('spot');
        div.data('origX', troll.x);
        div.data('origY', troll.y);
        div.css('left', (troll.x * widthScale) - 12.5);
        div.css('top', (troll.y * heightScale) - 25);
        div.data('resetX', (troll.x * widthScale) - 12.5);
        div.data('resetY', (troll.y * heightScale) - 25);
        troll.img = "images/trolls/" + (Math.floor(Math.random() * 4) + 1) + ".gif?c=4";
        div.data('trollInfo', troll);
        div.click(markerClick);
        $('#mainMenu .globe .contents .map').prepend(div);
    });

    $("#mainMenu .globe .contents .map").draggable({
        axis: "x",
        drag: function( event, ui ) {
            if (!allowGlobeDrag) {
                return false;
            }
            // Keep the left edge of the element
            // at least 100 pixels from the container
            ui.position.left = Math.min( 0, ui.position.left );
            ui.position.left = Math.max( -474, ui.position.left );
        }
    });

    $("#mainMenu .globe #trollInfo #tryLater").click(resetGlobeMenu);

    function markerClick() {
        if (!isZoomedIn && !$(this).hasClass('defeated')) {
            isZoomedIn = true;
            allowGlobeDrag = false;
            var marker = $(this);
            var amountToZoom = 3000;
            var widthScaleNew = (mapImg.width() + (amountToZoom * widthDif)) / imgOrigWidth;
            var heightScaleNew = (mapImg.height() + amountToZoom) / imgOrigHeight;

            // Center & enlarge the map on the clicked marker
            var newMarkerLocX = ((marker.data('origX') * widthScaleNew) - 12.5); // left
            var newMarkerLocY = ((marker.data('origY') * heightScaleNew) - 25); // top

            $("#mainMenu .globe .contents .map img").animate({
                marginTop: "-=" + (newMarkerLocY - 300),
                marginLeft: "-=" + (newMarkerLocX - (300 - parseFloat($("#mainMenu .globe .contents .map").css("left").replace('px', '')))),
                width: "+=" + amountToZoom * widthDif,
                height: "+=" + amountToZoom
            });

            // Ensure the markers stay in place per scale
            $("#mainMenu .globe .contents .map .spot").each(function (idx, elem) {
                var e = $(elem);
                var widthDiff = ((e.data('origX') * widthScaleNew) - 12.5) - parseFloat(e.css("left").replace('px', ''));
                var heightDiff = ((e.data('origY') * heightScaleNew) - 25) - parseFloat(e.css("top").replace('px', ''));

                e.animate({
                    left: "+=" + (widthDiff - (newMarkerLocX - (300 - parseFloat($("#mainMenu .globe .contents .map").css("left").replace('px', ''))))),
                    top: "+=" + (heightDiff - (newMarkerLocY - 300))
                });
            });

            var troll = marker.data("trollInfo");
            $("#trollInfo #trollName").text(troll.name);
            $("#trollInfo #trollLocation").text(troll.location);
            $("#trollInfo #trollDifficulty").text(troll.difficulty);
            $("#trollInfo #trollSkipCost").text(troll.skipCost);
            $("#trollInfo #trollImg").attr("src", troll.img);
            $("#trollInfo #battle").data("trollInfo", troll);
            $("#trollInfo").fadeIn();
        }
    }

    function resetGlobeMenu() {
        mapImg.animate({
            marginTop: 0,
            marginLeft: 0,
            width: resetWidth,
            height: resetHeight
        });

        // Ensure the markers stay in place per scale
        $("#mainMenu .globe .contents .map .spot").each(function (idx, elem) {
            var e = $(elem);

            e.animate({
                left: e.data('resetX'),
                top: e.data('resetY')
            });
        });

        $("#trollInfo").fadeOut();
        isZoomedIn = false;
        allowGlobeDrag = true;
    }

    function goToBattle() {
        var troll = $(this).data("trollInfo");

        $(".hud .status").text("Traveling To " + troll.location + "...");
        $(".hud .item.trollInfo #trollName").text(troll.name);
        $(".hud .item.trollInfo img").attr("src", troll.img);
        $(".hud .item.trollInfo").show();
        $("#mainMenu").fadeOut(400, function() {
            resetGlobeMenu();
        });
        $("#loading .content").fadeIn();
        lowerVolume(0);
        gameStart(troll);
    }
}

function playMainMenuMusic() {
    maxVolume = 0.4;
    playAudio('sounds/mainMenu.mp3', true);
}
