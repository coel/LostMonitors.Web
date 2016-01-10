using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace LostMonitors.Web
{
    public class PlayHub : Hub
    {
        public static List<Game> Games = new List<Game>();

        public void Start(string player1, string player2)
        {
            var player1Instance = PlayerService.GetPlayer(player1).GetInstance();
            var player2Instance = PlayerService.GetPlayer(player2).GetInstance();

            var game = new Game(player1Instance.GetFriendlyName(), player2Instance.GetFriendlyName());
            var state = game.Init(player1Instance, player2Instance);
            Games.Add(game);

            var gameId = game.Id.ToString();
            Groups.Add(Context.ConnectionId, gameId);

            Clients.Group(gameId).start(gameId, state);
        }

        public void Play(string gameId)
        {
            var game = Games.First(x => x.Id.ToString() == gameId);
            var turn = game.Play();
            Clients.Group(gameId).turn(turn);
        }
    }
}