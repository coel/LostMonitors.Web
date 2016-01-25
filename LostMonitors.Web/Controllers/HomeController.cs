using System.Linq;
using System.Web.Mvc;
using LostMonitors.Core.Services;
using LostMonitors.Web.Models;

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
