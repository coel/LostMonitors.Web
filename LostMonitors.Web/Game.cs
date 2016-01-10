using System;
using LostMonitors.Core;
using LostMonitors.Core.Engine;

namespace LostMonitors.Web
{
    public class Game
    {
        public Game(IPlayer player1, IPlayer player2)
        {
            Id = Guid.NewGuid();
            Player1 = player1;
            Player2 = player2;

            Engine = new Engine();
            Engine.Init(player1, player2);
        }

        public Guid Id { get; set; }
        public IPlayer Player1 { get; set; }
        public IPlayer Player2 { get; set; }
        public IEngine Engine { get; set; }
    }
}