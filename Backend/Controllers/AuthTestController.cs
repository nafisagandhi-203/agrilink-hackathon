using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthTestController : ControllerBase
{
    [HttpGet]
    [Authorize]
    public IActionResult GetAuthenticatedUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = User.FindFirstValue(ClaimTypes.Email);
        var role = User.FindFirstValue(ClaimTypes.Role);

        return Ok(new
        {
            UserId = userId,
            Email = email,
            Role = role,
            Message = "You have successfully authenticated."
        });
    }

    [HttpGet("farmer")]
    [Authorize(Roles = "Farmer")]
    public IActionResult GetFarmerOnly()
    {
        return Ok(new
        {
            Message = "You have successfully accessed a Farmer-only endpoint."
        });
    }

    [HttpGet("buyer")]
    [Authorize(Roles = "Buyer")]
    public IActionResult GetBuyerOnly()
    {
        return Ok(new
        {
            Message = "You have successfully accessed a Buyer-only endpoint."
        });
    }
}
