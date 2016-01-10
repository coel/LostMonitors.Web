using System;
using LostMonitors.Core;
using LostMonitors.Core.Engine;

namespace LostMonitors.Web
{
    public class Game
    {
        public Game(string player1, string player2)
        {
            Id = Guid.NewGuid();
            Player1 = player1;
            Player2 = player2;

            _engine = new Engine();
        }

        public GlobalBoardState Init(IPlayer player1, IPlayer player2)
        {
            return _engine.Init(player1, player2);
        }

        public GlobalBoardTurn Play()
        {
            return _engine.Play();
        }
        
        private readonly IEngine _engine;
        public Guid Id { get; set; }
        public string Player1 { get; set; }
        public string Player2 { get; set; }
    }
}