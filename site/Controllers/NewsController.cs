using System.Collections.Generic;
using Microsoft.AspNet.Mvc;

namespace site.Controllers
{
    [Route("api/[controller]")]
    public class NewsController : Controller
    {
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new [] { "value1", "value2" };
        }
    }
}
