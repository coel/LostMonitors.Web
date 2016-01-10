$(function () {

    var game = $.connection.playHub;

    game.client.start = function (message) {
        $('#board').append(message);
    };

    $.connection.hub.start().done(function () {
        $('#start').click(function () {
            game.server.start($('#player1').val(), $('#player2').val());
            $('#selection').hide();
        });
        /*
        $('p.join').click(function (e) {
            game.server.join($(e.target).data('id'));
            $('#selection').hide();
        });
        */
    });
});