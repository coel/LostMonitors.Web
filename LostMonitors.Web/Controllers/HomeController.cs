using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;
using LostMonitors.Core;
using LostMonitors.Web.Models;
using Microsoft.AspNet.SignalR;

namespace LostMonitors.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var players = PlayerService.GetPlayers();

            var model = new GamesModel();
            model.AvailablePlayers = players.Select(x => new PlayerModel { Name = x.Name }).ToList();

            return View(model);
        }
    }
}
