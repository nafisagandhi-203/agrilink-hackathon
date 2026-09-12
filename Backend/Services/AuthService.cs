using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Data;
using DTOs;
using DTOs.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Models;

namespace Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<User> _passwordHasher;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
        _passwordHasher = new PasswordHasher<User>();
    }

    public async Task<ApiResponse<int>> RegisterAsync(RegisterRequestDTO request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return ApiResponse<int>.ErrorResponse("Email is already registered.");
        }

        if (await _context.Users.AnyAsync(u => u.PhoneNumber == request.PhoneNumber))
        {
            return ApiResponse<int>.ErrorResponse("Phone number is already registered.");
        }

        var normalizedRole = request.Role?.Trim() ?? string.Empty;
        var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name.ToLower() == normalizedRole.ToLower());
        if (role == null)
        {
            return ApiResponse<int>.ErrorResponse("Invalid role.");
        }

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            RoleId = role.RoleId,
            IsVerified = false,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        if (string.Equals(role.Name, "Farmer", StringComparison.OrdinalIgnoreCase))
        {
            _context.Farmers.Add(new Farmer { UserId = user.UserId });
        }
        else if (string.Equals(role.Name, "Buyer", StringComparison.OrdinalIgnoreCase))
        {
            _context.Buyers.Add(new Buyer { UserId = user.UserId });
        }
        await _context.SaveChangesAsync();

        return ApiResponse<int>.SuccessResponse(user.UserId, "Registration successful");
    }

    public async Task<ApiResponse<LoginResponseDTO>> LoginAsync(LoginRequestDTO request)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !user.IsActive)
        {
            return ApiResponse<LoginResponseDTO>.ErrorResponse("Invalid credentials.");
        }

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            return ApiResponse<LoginResponseDTO>.ErrorResponse("Invalid credentials.");
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var keyString = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured.");
        var issuer = _configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer is not configured.");
        var audience = _configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience is not configured.");
        var expiryMinutes = int.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "10080");

        var key = Encoding.UTF8.GetBytes(keyString);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.Name)
            }),
            Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        var response = new LoginResponseDTO
        {
            Token = tokenString,
            UserId = user.UserId,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.Name
        };

        return ApiResponse<LoginResponseDTO>.SuccessResponse(response, "Login successful");
    }
}
