function initGame() {
    $("#game #back").click(goBack);

    function goBack() {
        $("#mainMenu").fadeIn();
        $("#game").fadeOut();
    }
}

function gameStart(troll) {
    var start = new Date();

    // Get the trivia question
    $.ajax({
        url: "http://crossorigin.me/https://opentdb.com/api.php?amount=1",
        method: "get"
    }).done(function(response) {
        console.log(response);
    });

    // Get the background photo
    var params = {
        method: "flickr.photos.search",
        api_key: "028f570aae18bf9462e7f1e85ea9598e",
        tags: troll.location,
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
                    $("#game #gameBackground").attr("src", "");
                    // Image is loaded
                    $("#loading .content").fadeOut();
                    $("#game").fadeIn();
                }, timeLeft);
            });
            $("#game #gameBackground").attr("src", response.sizes.size[response.sizes.size.length - 3].source);
            $("#game #gameBackground").css("background-image", "url(" + response.sizes.size[response.sizes.size.length - 3].source + ")");
        });
    });
}
