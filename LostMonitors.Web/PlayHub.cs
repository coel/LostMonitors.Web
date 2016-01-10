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

            var game = new Game(player1Instance, player2Instance);
            var gameId = game.Id.ToString();
            Groups.Add(Context.ConnectionId, gameId);
            Games.Add(game);
            Clients.Group(gameId).start("started: " + game.Id);
        }
        /*
        public void Join(string gameId)
        {
            Groups.Add(Context.ConnectionId, gameId);
            Clients.OthersInGroup(gameId).hello("joined: " + gameId);
        }
        */
    }
}