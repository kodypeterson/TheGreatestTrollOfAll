function initMainMenu() {
    $("#mainMenu .globe .contents img").draggable({
        axis: "x",
        drag: function( event, ui ) {

            // Keep the left edge of the element
            // at least 100 pixels from the container
            ui.position.left = Math.min( 0, ui.position.left );
            ui.position.left = Math.max( -474, ui.position.left );
        }
    });
}
