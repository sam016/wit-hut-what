using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoMapper;

namespace Org.ERM.WebApi.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        protected readonly ILogger<BaseController> Logger;
        // protected readonly DatabaseContext DBContext;
        protected readonly IMapper Mapper;

        public BaseController(
            ILogger<BaseController> logger,
            // DatabaseContext context,
            IMapper mapper)
        {
            Logger = logger;
            // DBContext = context;
            Mapper = mapper;
        }
    }
}
