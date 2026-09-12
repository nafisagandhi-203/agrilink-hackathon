
using Data;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Scalar.AspNetCore;
using Services;
using HackathonProject.Services.AI;
using System.Text;

namespace HackathonProject
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });
            
            // Register FluentValidation
            builder.Services.AddFluentValidationAutoValidation();
            builder.Services.AddValidatorsFromAssemblyContaining<Program>();

            builder.Services.Configure<Microsoft.AspNetCore.Mvc.ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var errors = context.ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    var response = global::DTOs.ApiResponse<object>.ErrorResponse("Validation Failed", errors);
                    return new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(response);
                };
            });

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            //builder.Services.AddOpenApi();

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

            builder.Services.AddScoped<IAuthService, AuthService>();

            // AI Service - HttpClient for Python FastAPI AI backend
            builder.Services.AddHttpClient<IAIService, AIService>(client =>
            {
                var aiBaseUrl = builder.Configuration["AI:BaseUrl"] ?? "http://localhost:8000";
                client.BaseAddress = new Uri(aiBaseUrl);
                client.Timeout = TimeSpan.FromSeconds(30);
            });

            builder.Services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    var jwtKey = builder.Configuration["Jwt:Key"];
                    var jwtIssuer = builder.Configuration["Jwt:Issuer"];
                    var jwtAudience = builder.Configuration["Jwt:Audience"];

                    if (string.IsNullOrWhiteSpace(jwtKey))
                        throw new InvalidOperationException("JWT Key is not configured.");

                    if (string.IsNullOrWhiteSpace(jwtIssuer))
                        throw new InvalidOperationException("JWT Issuer is not configured.");

                    if (string.IsNullOrWhiteSpace(jwtAudience))
                        throw new InvalidOperationException("JWT Audience is not configured.");

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwtKey)),

                        ValidateIssuer = true,
                        ValidIssuer = jwtIssuer,

                        ValidateAudience = true,
                        ValidAudience = jwtAudience,

                        ValidateLifetime = true,

                        ClockSkew = TimeSpan.Zero
                    };
                });

            builder.Services.AddAuthorization();


            builder.Services.AddOpenApi(options =>
            {
                options.AddDocumentTransformer((document, context, cancellationToken) =>
                {
                    document.Components ??= new();
                    document.Components.SecuritySchemes ??=
                        new Dictionary<string, IOpenApiSecurityScheme>();

                    document.Components.SecuritySchemes.Add("Bearer", new OpenApiSecurityScheme
                    {
                        Type = SecuritySchemeType.Http,
                        Scheme = "bearer",
                        BearerFormat = "JWT",
                        In = ParameterLocation.Header,
                        Description = "Enter your JWT token here (no need to type 'Bearer' prefix)"
                    });

                    return Task.CompletedTask;
                });
            });



            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowAll");

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
