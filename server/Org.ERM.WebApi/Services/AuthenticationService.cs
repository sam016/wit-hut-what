using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Org.ERM.WebApi.Enums;
using Org.ERM.WebApi.Exceptions;
using Org.ERM.WebApi.Models.Domain;
using Org.ERM.WebApi.Models.Dtos;
using Org.ERM.WebApi.Models.Requests.Auth;
using Org.ERM.WebApi.Persistence.Repositories;
using Org.ERM.WebApi.Utils;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System;

namespace Org.ERM.WebApi.Services
{
    public interface IAuthenticationService
    {
        AuthUserTokenDto GenerateToken(Employee employee);
        int GetLoggedInUserId();
        int GetLoggedInUserOrgId();
        UserRole GetLoggedInUserRole();
    }

    public class AuthenticationService : IAuthenticationService
    {
        private readonly IConfiguration Configuration;
        private readonly IMapper Mapper;
        private readonly IHttpContextAccessor HttpContextAccessor;

        public AuthenticationService(
            IConfiguration configuration,
            IMapper mapper,
            IHttpContextAccessor httpContextAccessor)
        {
            Configuration = configuration;
            Mapper = mapper;
            HttpContextAccessor = httpContextAccessor;
        }

        public AuthUserTokenDto GenerateToken(Employee employee)
        {
            var secretKey = Encoding.ASCII.GetBytes(Configuration.GetValue<string>("Auth:Secret"));
            var expiresAt = DateTime.UtcNow.AddDays(Configuration.GetValue<int>("Auth:ExpiresInDays"));

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, employee.Id.ToString()),
                    new Claim(ClaimTypes.Role, employee.Role.ToString("g")),
                    new Claim(ClaimTypes.UserData, employee.OrganizationId.ToString()),
                }),
                Expires = expiresAt,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            var dto = new AuthUserTokenDto()
            {
                Id = employee.Id,
                Name = employee.Name,
                Email = employee.Email,
                Role = employee.Role,
                Token = tokenHandler.WriteToken(token),
                ExpiresAt = expiresAt,
            };

            return dto;
        }

        public int GetLoggedInUserId()
        {
            return int.Parse(HttpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name).Value);
        }

        public int GetLoggedInUserOrgId()
        {
            return int.Parse(HttpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.UserData).Value);
        }

        public UserRole GetLoggedInUserRole()
        {
            var role = HttpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Role).Value;
            return (UserRole)Enum.Parse(typeof(UserRole), role);
        }

    }
}
