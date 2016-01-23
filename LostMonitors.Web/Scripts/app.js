$(function() {

    var game = $.connection.playHub;

    var id;

    $('#board').hide();

    const PLAYER1 = 0;
    const PLAYER2 = 1;
    const MAX_HAND = 8;
    var hands = [[], []];

    function getSpotInHand(player) {
        var hand = hands[player];
        for (var i = 0; i < MAX_HAND; i++) {
            if (!hand[i]) {
                hand[i] = true;
                break;
            }
        }
        return i;
    }

    function handContainer(player) {
        if (player == PLAYER1)
            return $('#player1hand');

        return $('#player2hand');
    }

    function deal(player, card) {
        var value = card.Value == 0 ? '⚒' : card.Value;
        var el = $('<div class="card"><span>' + value + '</span></div>');
        el.addClass('d' + card.Destination);
        var deckPos = $('#deck .card').offset();
        el.css({
            position: 'absolute',
            top: deckPos.top,
            left: deckPos.left,
            display: 'none'
        });
        $('#play').append(el);
        el.fadeIn(1000, function() {
            var spotIndex = getSpotInHand(player);
            var spot = $($('.spot', handContainer(player))[spotIndex]);
            var spotPos = spot.offset();

            el.animate({
                top: spotPos.top,
                left: spotPos.left
            }, 1000, function() {
                el.remove();
                el.css({position: 'inherit'});
                spot.append(el);
            });
        });
    }

    game.client.start = function (gameId, initialState) {
        console.log(initialState);
        id = gameId;
        console.assert(initialState.Player1Cards.length == MAX_HAND && initialState.Player2Cards.length == MAX_HAND, MAX_HAND + " cards weren't delt each!?");
        for (var i = 0; i < MAX_HAND; i++) {
            deal(PLAYER1, initialState.Player1Cards[i]);
            deal(PLAYER2, initialState.Player2Cards[i]);
        }
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