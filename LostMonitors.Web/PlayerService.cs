using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LostMonitors.Core;

namespace LostMonitors.Web
{
    public class Player
    {
        public Player(Type playerType)
        {
            PlayerType = playerType;
            Name = GetInstance().GetFriendlyName();
        }

        public Type PlayerType { get; set; }
        public string Name { get; set; }

        public IPlayer GetInstance()
        {
            var instance = Activator.CreateInstance(PlayerType);
            return instance as IPlayer;
        }
    }

    public static class PlayerService
    {
        private static readonly List<Player> Players; 

        static PlayerService()
        {
            var type = typeof(IPlayer);
            var players = AppDomain.CurrentDomain.GetAssemblies()
                .SelectMany(s => s.GetTypes())
                .Where(p => type.IsAssignableFrom(p) && p.IsClass);

            Players = players.Select(x => new Player(x)).ToList();
        }

        public static List<Player> GetPlayers()
        {
            return Players.ToList();
        }

        public static Player GetPlayer(string name)
        {
            return Players.FirstOrDefault(x => x.Name == name);
        }
    }
}