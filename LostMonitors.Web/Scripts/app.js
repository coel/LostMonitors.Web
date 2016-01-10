$(function () {

    var game = $.connection.playHub;

    var id;

    $('#board').hide();

    game.client.start = function (gameId, initialState) {
        console.log(initialState);
        id = gameId;
    };

    game.client.turn = function (turn) {
        console.log(turn);
    };

    $.connection.hub.start().done(function () {
        $('#start').click(function () {
            game.server.start($('#player1').val(), $('#player2').val());
            $('#selection').hide();
            $('#board').show();
        });

        $('#turn').click(function () {
            game.server.play(id);
        });
    });
});