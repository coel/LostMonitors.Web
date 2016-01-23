$(function() {

    var game = $.connection.playHub;

    var id;

    $('#board').hide();

    const PLAYER1 = 0;
    const PLAYER2 = 1;
    const MAX_HAND = 8;
    var hands = [[], []];
    var expeditions = [[[], [], [], [], []], [[], [], [], [], []]];
    var turn = PLAYER1;

    function getSpotInHand(player, card) {
        var hand = hands[player];
        for (var i = 0; i < MAX_HAND; i++) {
            if (!hand[i]) {
                hand[i] = card;
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
            var spotIndex = getSpotInHand(player, card);
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

    function getSpotInExpedition(player, card) {
        var cards = expeditions[player][card.Destination];
        var position = cards.length;
        cards.push(card);
        return position;
    }

    function expeditionContainer(player, destination) {
        if (player == PLAYER1)
            return $($('#player1expedition .row')[destination]);

        return $($('#player2expedition .row')[destination]);
    }

    function play(player, move) {
        var hand = hands[player];
        for (var i = 0; i < MAX_HAND; i++) {
            if (hand[i].Destination == move.PlayCard.Destination && hand[i].Value == move.PlayCard.Value) {
                hand[i] = null;
                break;
            }
        }
        var spot = $($('.spot', handContainer(player))[i]);
        var el = $('.card', spot);
        console.log(spot);
        console.log(el);
        var spotPos = spot.offset();
        el.remove();
        console.log(spotPos);
        $('#play').append(el);
        el.css({
            position: 'absolute',
            top: spotPos.top,
            left: spotPos.left
        });

        //if (move.PlayIsDiscard)

        var destIndex = getSpotInExpedition(player, move.PlayCard);
        console.log(destIndex);
        console.log(expeditionContainer(player, move.PlayCard.Destination));
        var dest = $($('.card', expeditionContainer(player, move.PlayCard.Destination))[destIndex]);
        var destPos = dest.offset();
        console.log(dest);
        console.log(destPos);
        el.animate({
            top: destPos.top,
            left: destPos.left
        }, 1000, function () {
            el.remove();
            el.css({ position: 'inherit' });
            dest.replaceWith(el);
        });
        
    }

    game.client.turn = function (move) {
        console.log(move);

        play(turn, move);
        if (turn == PLAYER1) {
            turn = PLAYER2;
        } else {
            turn = PLAYER1;
        }
    };

    $.connection.hub.start().done(function () {
        $('#start').click(function () {
            game.server.start($('#player1').val(), $('#player2').val());
            $('#selection').hide();
            $('#board').show();
        });

        $('#deck').click(function () {
            game.server.play(id);
        });
    });
});