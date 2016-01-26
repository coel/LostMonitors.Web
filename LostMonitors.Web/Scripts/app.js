$(function() {

    var game = $.connection.playHub;

    var id;

    const PLAYER1 = 0;
    const PLAYER2 = 1;
    const MAX_HAND = 8;
    var hands = [[], []];
    var expeditions = [[[], [], [], [], []], [[], [], [], [], []]];
    var turn = PLAYER1;
    var deck = 60;
    var scores = [0, 0];
    var discards = [[], [], [], [], []];

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

    function disableNext() {
        $('#deck').off();
        $('body').off();
    }

    function enableNext() {
        disableNext();

        $('#deck').click(function () {
            game.server.play(id);
        });

        $('body').keyup(function (evt) {
            if (evt.which == 32) {
                game.server.play(id);
            }
        });
    }

    function deal(player, card) {
        var value = card.Value == 0 ? '⚒' : card.Value;
        var el = $('<div class="card"><span>' + value + '</span></div>');
        el.addClass('d' + card.Destination);
        var deckPos = $('#deck .card').offset();
        el.css({
            position: 'absolute',
            top: deckPos.top,
            left: deckPos.left
        });
        $('#play').append(el);

        var spotIndex = getSpotInHand(player, card);
        var spot = $($('.spot', handContainer(player))[spotIndex]);
        var spotPos = spot.offset();

        deck--;
        enableNext();

        el.animate({
            top: spotPos.top,
            left: spotPos.left
        }, 1000, function () {
            el.remove();
            el.css({ position: 'inherit' });
            spot.append(el);
        });

        $('#deck span').text(deck);
    }

    game.client.start = function (gameId, initialState) {
        disableNext();
        $('#selection').hide();
        $('#board').show();

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

    function updateScore(player) {
        var playerExpeditions = expeditions[player];
        var totalScore = 0;
        playerExpeditions.forEach(function (expedition) {
            var score = 0;
            var multiplier = 1;
            var bonus = 0;
            if (expedition.length > 0) {
                score -= 20;
            }
            if (expedition.length >= 10) {
                bonus += 20;
            }
            expedition.forEach(function(card) {
                if (card.Value == 0) {
                    multiplier++;
                } else {
                    score += card.Value;
                }
            });

            totalScore = totalScore + (score * multiplier) + bonus;
        });

        scores[player] = totalScore;
        $('#player' + (player + 1) + 'info .score').text(totalScore);
    }

    function discardContainer(destination) {
        return $($('#discards .pile')[destination]);
    }

    function takeDiscard(player, destination) {
        var target = $('.card', discardContainer(destination)).last();
        var targetPos = target.offset();
        target.remove();
        $('#play').append(target);
        target.css({
            position: 'absolute',
            top: targetPos.top,
            left: targetPos.left
        });

        var card = discards[destination].pop();

        var spotIndex = getSpotInHand(player, card);
        var spot = $($('.spot', handContainer(player))[spotIndex]);
        var spotPos = spot.offset();

        enableNext();
        target.animate({
            top: spotPos.top,
            left: spotPos.left
        }, 1000, function () {
            target.remove();
            target.css({ position: 'inherit' });
            spot.append(target);
        });
    }

    function play(player, move) {
        disableNext();

        var hand = hands[player];
        for (var i = 0; i < MAX_HAND; i++) {
            if (hand[i].Destination == move.PlayCard.Destination && hand[i].Value == move.PlayCard.Value) {
                hand[i] = null;
                break;
            }
        }
        var spot = $($('.spot', handContainer(player))[i]);
        var el = $('.card', spot);
        var spotPos = spot.offset();
        el.remove();
        $('#play').append(el);
        el.css({
            position: 'absolute',
            top: spotPos.top,
            left: spotPos.left
        });

        function draw() {
            if (move.DrawLocation != null) {
                takeDiscard(player, move.DrawLocation);
            } else {
                deal(player, move.DrawCard);
            }
        }

        if (move.PlayIsDiscard) {
            var discard = discardContainer(move.PlayCard.Destination);
            var discardPos = discard.offset();

            discards[move.PlayCard.Destination].push(move.PlayCard);

            el.animate({
                top: discardPos.top,
                left: discardPos.left
            }, 1000, function () {
                el.remove();
                el.css({ position: 'absolute', top: 0, left: 0 });
                discard.append(el);

                draw();
            });
        } else {

            var destIndex = getSpotInExpedition(player, move.PlayCard);
            var dest = $($('.card', expeditionContainer(player, move.PlayCard.Destination))[destIndex]);
            var destPos = dest.offset();

            el.animate({
                top: destPos.top,
                left: destPos.left
            }, 1000, function() {
                el.remove();
                el.css({ position: 'inherit' });
                dest.replaceWith(el);

                updateScore(player);

                draw();
            });
        }
    }

    game.client.turn = function (move) {
        console.log(move);
        if (move == null)
            return;

        play(turn, move);
        if (turn == PLAYER1) {
            turn = PLAYER2;
        } else {
            turn = PLAYER1;
        }

        if ($('#auto').is(':checked')) {
            setTimeout(function() {
                $('#deck').click();
            }, 3000);
        }
    };

    $.connection.hub.start().done(function () {
        $('#start').click(function () {
            game.server.start($('#player1').val(), $('#player2').val());

            $('#player1info .name').text($('#player1').val());
            $('#player2info .name').text($('#player2').val());
        });

        enableNext();
    });
});