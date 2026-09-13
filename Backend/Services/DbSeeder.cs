using System;
using System.Linq;
using System.Threading.Tasks;
using Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Models;
using Models.Enums;

namespace Services;

/// <summary>
/// Ensures baseline data exists when the application starts:
/// - The three roles (Farmer=1, Buyer=2, Admin=3).
/// - A bootstrap admin account so the first Administrator login is possible
///   (Admin self-registration is intentionally blocked for regular users).
/// The seed is idempotent and safe to run on every startup.
/// </summary>
public class DbSeeder
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;
    private readonly IHostEnvironment _environment;
    private readonly ILogger<DbSeeder> _logger;

    public DbSeeder(ApplicationDbContext context, IConfiguration config, IHostEnvironment environment, ILogger<DbSeeder> logger)
    {
        _context = context;
        _config = config;
        _environment = environment;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        await SeedRolesAsync();
        await SeedAdminAsync();
        await SeedDemoUsersAsync();
        await SeedBaselineCropsAsync();
        await SeedBaselineTransportProvidersAsync();
        await SeedMarketPricesAsync();
        await SeedAdditionalUsersAsync();
        await SeedBaselineListingsRequirementsOffersAndTransactionsAsync();
    }

    private async Task SeedBaselineCropsAsync()
    {
        if (await _context.Crops.AnyAsync())
        {
            return;
        }

        var crops = new[]
        {
            new Crop { CropName = "Tomato", CommodityGroup = "Vegetables", Description = "Fresh field tomato", IsActive = true },
            new Crop { CropName = "Wheat", CommodityGroup = "Cereals", Description = "Premium wheat grain", IsActive = true },
            new Crop { CropName = "Onion", CommodityGroup = "Vegetables", Description = "Red onion", IsActive = true },
            new Crop { CropName = "Cotton", CommodityGroup = "Fibre", Description = "Raw cotton", IsActive = true },
            new Crop { CropName = "Potato", CommodityGroup = "Vegetables", Description = "Table potato", IsActive = true }
        };

        _context.Crops.AddRange(crops);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded {Count} baseline crops.", crops.Length);
    }

    private async Task SeedBaselineTransportProvidersAsync()
    {
        if (await _context.TransportProviders.AnyAsync())
        {
            return;
        }

        var providers = new[]
        {
            new TransportProvider { Name = "Agro Express Logistics", PhoneNumber = "+91 91234 10001", VehicleType = "Tata 407", VehicleNumber = "GJ-03-AB-1234", VehicleCapacity = 2000, ServiceArea = "Saurashtra & Mumbai", Rating = 4.6m, IsAvailable = true },
            new TransportProvider { Name = "Gujarat Cargo Movers", PhoneNumber = "+91 91234 10002", VehicleType = "Large Truck", VehicleNumber = "GJ-05-CV-5678", VehicleCapacity = 8000, ServiceArea = "Gujarat, Maha & MP", Rating = 4.4m, IsAvailable = true },
            new TransportProvider { Name = "Kisan Haulage Co-Op", PhoneNumber = "+91 91234 10003", VehicleType = "Mini Truck", VehicleNumber = "GJ-11-DX-9012", VehicleCapacity = 1200, ServiceArea = "Rajkot & Junagadh", Rating = 4.8m, IsAvailable = true },
            new TransportProvider { Name = "FarmFresh Carriers", PhoneNumber = "+91 91234 10004", VehicleType = "Pickup", VehicleNumber = "GJ-22-KL-3456", VehicleCapacity = 800, ServiceArea = "Saurashtra", Rating = 4.2m, IsAvailable = false }
        };

        _context.TransportProviders.AddRange(providers);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded {Count} baseline transport providers.", providers.Length);
    }

    private async Task SeedRolesAsync()
    {
        var existing = await _context.Roles.AsNoTracking().ToDictionaryAsync(r => r.RoleId);

        var roles = new[]
        {
            new Role { RoleId = 1, Name = "Farmer" },
            new Role { RoleId = 2, Name = "Buyer" },
            new Role { RoleId = 3, Name = "Admin" }
        };

        foreach (var role in roles)
        {
            if (existing.TryGetValue(role.RoleId, out var roleRow))
            {
                if (roleRow.Name != role.Name)
                {
                    roleRow.Name = role.Name;
                    _context.Roles.Update(roleRow);
                }
            }
            else
            {
                _context.Roles.Add(role);
            }
        }

        await _context.SaveChangesAsync();
    }

    private async Task SeedAdminAsync()
    {
        var adminRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin") 
            ?? await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == 3);

        if (adminRole == null)
        {
            _logger.LogWarning("Admin role not found; skipping admin bootstrap.");
            return;
        }

        var anyAdmin = await _context.Admins.AnyAsync() || await _context.Users.AnyAsync(u => u.RoleId == adminRole.RoleId);
        if (anyAdmin)
            return;

        if (_config.GetValue<bool>("SeedAdmin:Disabled"))
        {
            _logger.LogWarning("Admin account auto-seeding disabled via SeedAdmin:Disabled.");
            return;
        }

        var email = _config["SeedAdmin:Email"] ?? "admin@agrilink.local";
        var password = _config["SeedAdmin:Password"] ?? "Admin@123";

        _logger.LogInformation("Seeding default admin account '{Email}' (env '{Env}'). Configure via SeedAdmin:Email / SeedAdmin:Password.", email, _environment.EnvironmentName);

        var hasher = new PasswordHasher<User>();
        var user = new User
        {
            FullName = "Platform Administrator",
            Email = email,
            PhoneNumber = string.Empty,
            PasswordHash = string.Empty,
            RoleId = adminRole.RoleId,
            IsVerified = true,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        user.PasswordHash = hasher.HashPassword(user, password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _context.Admins.Add(new Admin
        {
            UserId = user.UserId,
            Department = "Platform Administration",
            CreatedAt = DateTime.UtcNow
        });

        _context.UserVerifications.Add(new UserVerification
        {
            UserId = user.UserId,
            VerificationStatus = VerificationStatus.Approved,
            VerifiedAt = DateTime.UtcNow,
            Remarks = "Bootstrapped admin account (seeded)."
        });

        await _context.SaveChangesAsync();

        var adminId = await _context.Users
            .Where(u => u.UserId == user.UserId)
            .Select(u => u.Admin!.AdminId)
            .FirstOrDefaultAsync();

        _logger.LogInformation("Bootstrapped admin account created (AdminId={AdminId}, Email={Email}). Change the password before deploying to a shared environment.", adminId, email);
    }

    private async Task SeedDemoUsersAsync()
    {
        var hasher = new PasswordHasher<User>();

        // 1. Seed Demo Farmer: farmer@demo.com
        var demoFarmer = await _context.Users.Include(u => u.Farmer).FirstOrDefaultAsync(u => u.Email == "farmer@demo.com");
        if (demoFarmer == null)
        {
            var farmerUser = new User
            {
                FullName = "Ramesh Patel",
                Email = "farmer@demo.com",
                PhoneNumber = "+91 98765 43210",
                RoleId = 1, // Farmer
                IsVerified = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            farmerUser.PasswordHash = hasher.HashPassword(farmerUser, "Farmer@123");
            _context.Users.Add(farmerUser);
            await _context.SaveChangesAsync();

            _context.Farmers.Add(new Farmer
            {
                UserId = farmerUser.UserId,
                FarmName = "Patel Organic Farms",
                FarmLocation = "Survey No. 42, Gondal Road, Rajkot",
                District = "Rajkot",
                State = "Gujarat",
                Pincode = "360004",
                FarmSize = 12.5m,
                CreatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded demo farmer user (farmer@demo.com / Farmer@123).");
        }

        // 2. Seed Demo Buyer: buyer@demo.com
        var demoBuyer = await _context.Users.Include(u => u.Buyer).FirstOrDefaultAsync(u => u.Email == "buyer@demo.com");
        if (demoBuyer == null)
        {
            var buyerUser = new User
            {
                FullName = "Rajesh Shah",
                Email = "buyer@demo.com",
                PhoneNumber = "+91 98250 12345",
                RoleId = 2, // Buyer
                IsVerified = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            buyerUser.PasswordHash = hasher.HashPassword(buyerUser, "Buyer@123");
            _context.Users.Add(buyerUser);
            await _context.SaveChangesAsync();

            _context.Buyers.Add(new Buyer
            {
                UserId = buyerUser.UserId,
                BuyerType = "Agricultural Wholesaler & Processing",
                BusinessName = "Shree Fresh Foods Pvt Ltd",
                District = "Ahmedabad",
                State = "Gujarat",
                Pincode = "380001",
                PhoneNumber = "+91 98250 12345",
                PreferredCommodity = "Tomato",
                CommodityGroup = "Vegetables",
                MinQuantity = 100m,
                MaxQuantity = 5000m,
                AcceptedGrades = "Grade A, Grade B",
                MaxSourcingDistance = 300m,
                Rating = 4.8m,
                TotalTransactions = 24,
                CreatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded demo buyer user (buyer@demo.com / Buyer@123).");
        }

        // 3. Seed Demo Admin alias: admin@demo.com
        var demoAdmin = await _context.Users.Include(u => u.Admin).FirstOrDefaultAsync(u => u.Email == "admin@demo.com");
        if (demoAdmin == null)
        {
            var adminUser = new User
            {
                FullName = "SIH Platform Admin",
                Email = "admin@demo.com",
                PhoneNumber = "+91 90000 11111",
                RoleId = 3, // Admin
                IsVerified = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            adminUser.PasswordHash = hasher.HashPassword(adminUser, "Admin@123");
            _context.Users.Add(adminUser);
            await _context.SaveChangesAsync();

            _context.Admins.Add(new Admin
            {
                UserId = adminUser.UserId,
                Department = "Platform Administration",
                CreatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded demo admin user (admin@demo.com / Admin@123).");
        }
    }

    private async Task SeedMarketPricesAsync()
    {
        if (await _context.MarketPrices.AnyAsync())
        {
            return;
        }

        var tomato = await _context.Crops.FirstOrDefaultAsync(c => c.CropName == "Tomato");
        var wheat = await _context.Crops.FirstOrDefaultAsync(c => c.CropName == "Wheat");
        var cotton = await _context.Crops.FirstOrDefaultAsync(c => c.CropName == "Cotton");
        var onion = await _context.Crops.FirstOrDefaultAsync(c => c.CropName == "Onion");
        var potato = await _context.Crops.FirstOrDefaultAsync(c => c.CropName == "Potato");

        var prices = new List<MarketPrice>
        {
            new MarketPrice
            {
                CropId = tomato?.CropId ?? 1,
                MarketName = "Rajkot APMC",
                Location = "Rajkot",
                District = "Rajkot",
                State = "Gujarat",
                MinPrice = 2300,
                MaxPrice = 2600,
                ModalPrice = 2450,
                Unit = "Quintal",
                PriceDate = DateTime.UtcNow,
                Source = "Agmarknet / e-NAM Live API",
                CreatedAt = DateTime.UtcNow
            },
            new MarketPrice
            {
                CropId = wheat?.CropId ?? 2,
                MarketName = "Kondali APMC",
                Location = "Nagpur",
                District = "Nagpur",
                State = "Maharashtra",
                MinPrice = 2350,
                MaxPrice = 2500,
                ModalPrice = 2420,
                Unit = "Quintal",
                PriceDate = DateTime.UtcNow,
                Source = "MSAMB APMC Feed",
                CreatedAt = DateTime.UtcNow
            },
            new MarketPrice
            {
                CropId = cotton?.CropId ?? 4,
                MarketName = "Kadi Mandi",
                Location = "Mehsana",
                District = "Mehsana",
                State = "Gujarat",
                MinPrice = 6900,
                MaxPrice = 7300,
                ModalPrice = 7100,
                Unit = "Quintal",
                PriceDate = DateTime.UtcNow,
                Source = "CCI Market Dispatch",
                CreatedAt = DateTime.UtcNow
            },
            new MarketPrice
            {
                CropId = onion?.CropId ?? 3,
                MarketName = "Lasalgaon APMC",
                Location = "Nashik",
                District = "Nashik",
                State = "Maharashtra",
                MinPrice = 1700,
                MaxPrice = 2000,
                ModalPrice = 1850,
                Unit = "Quintal",
                PriceDate = DateTime.UtcNow,
                Source = "Agmarknet / e-NAM Live API",
                CreatedAt = DateTime.UtcNow
            },
            new MarketPrice
            {
                CropId = potato?.CropId ?? 5,
                MarketName = "Agra APMC",
                Location = "Agra",
                District = "Agra",
                State = "Uttar Pradesh",
                MinPrice = 1350,
                MaxPrice = 1600,
                ModalPrice = 1450,
                Unit = "Quintal",
                PriceDate = DateTime.UtcNow,
                Source = "UP Mandi Parishad Live",
                CreatedAt = DateTime.UtcNow
            }
        };

        _context.MarketPrices.AddRange(prices);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Seeded {Count} baseline APMC market prices.", prices.Count);
    }

    private async Task SeedAdditionalUsersAsync()
    {
        var hasher = new PasswordHasher<User>();

        var extraFarmers = new[]
        {
            ("Devji Bhai Patel", "devji@farm.in", "+91 98234 11223", "Devji Agri Estate", "Survey 18, Gondal Highway", "Rajkot", "Gujarat", "360311", 18.0m),
            ("Kanji Bhai Vala", "kanji@farm.in", "+91 98234 44556", "Gir Kesar & Grain Farms", "Talala Road", "Junagadh", "Gujarat", "362001", 22.5m),
            ("Hasmukh Patel", "hasmukh@farm.in", "+91 98234 77889", "Charotar Vegetable Greens", "Boriavi Crossing", "Anand", "Gujarat", "388001", 10.0m)
        };

        foreach (var (name, email, phone, farmName, loc, dist, state, pin, size) in extraFarmers)
        {
            if (!await _context.Users.AnyAsync(u => u.Email == email))
            {
                var user = new User
                {
                    FullName = name,
                    Email = email,
                    PhoneNumber = phone,
                    RoleId = 1, // Farmer
                    IsVerified = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-10)
                };
                user.PasswordHash = hasher.HashPassword(user, "Farmer@123");
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                _context.Farmers.Add(new Farmer
                {
                    UserId = user.UserId,
                    FarmName = farmName,
                    FarmLocation = loc,
                    District = dist,
                    State = state,
                    Pincode = pin,
                    FarmSize = size,
                    CreatedAt = DateTime.UtcNow.AddDays(-10)
                });
                await _context.SaveChangesAsync();
            }
        }

        var extraBuyers = new[]
        {
            ("Gujarat Agro Processors Ltd", "gujagro@procure.in", "+91 98251 22334", "Wholesale Food Processor", "Ahmedabad", "Gujarat", "382445", "Tomato, Potato", 200m, 10000m, 4.9m),
            ("Saurashtra Spices & Grains", "saurashtragrains@trade.in", "+91 98251 55667", "APMC Licensed Commission Trader", "Rajkot", "Gujarat", "360003", "Wheat, Cotton", 500m, 20000m, 4.7m)
        };

        foreach (var (bName, email, phone, bType, dist, state, pin, commodity, minQ, maxQ, rating) in extraBuyers)
        {
            if (!await _context.Users.AnyAsync(u => u.Email == email))
            {
                var user = new User
                {
                    FullName = bName,
                    Email = email,
                    PhoneNumber = phone,
                    RoleId = 2, // Buyer
                    IsVerified = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-8)
                };
                user.PasswordHash = hasher.HashPassword(user, "Buyer@123");
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                _context.Buyers.Add(new Buyer
                {
                    UserId = user.UserId,
                    BusinessName = bName,
                    BuyerType = bType,
                    District = dist,
                    State = state,
                    Pincode = pin,
                    PhoneNumber = phone,
                    PreferredCommodity = commodity,
                    CommodityGroup = "Grains & Vegetables",
                    MinQuantity = minQ,
                    MaxQuantity = maxQ,
                    AcceptedGrades = "Grade A, Grade B",
                    MaxSourcingDistance = 400m,
                    Rating = rating,
                    TotalTransactions = 35,
                    CreatedAt = DateTime.UtcNow.AddDays(-8)
                });
                await _context.SaveChangesAsync();
            }
        }
    }

    private async Task SeedBaselineListingsRequirementsOffersAndTransactionsAsync()
    {
        var farmer = await _context.Farmers.Include(f => f.User).FirstOrDefaultAsync();
        var buyer = await _context.Buyers.Include(b => b.User).FirstOrDefaultAsync();
        var tomato = await _context.Crops.FirstOrDefaultAsync(c => c.CropName == "Tomato") ?? await _context.Crops.FirstOrDefaultAsync();
        var wheat = await _context.Crops.FirstOrDefaultAsync(c => c.CropName == "Wheat") ?? tomato;

        if (farmer == null || buyer == null || tomato == null || wheat == null)
        {
            return;
        }

        // 1. Seed Available CropListing if none exists
        CropListing? activeListing = await _context.CropListings.FirstOrDefaultAsync(c => c.Status == CropListingStatus.Available);
        if (activeListing == null)
        {
            activeListing = new CropListing
            {
                FarmerId = farmer.FarmerId,
                CropId = tomato.CropId,
                Quantity = 1500,
                AvailableQuantity = 1500,
                Unit = "kg",
                QualityGrade = "Grade A",
                Location = farmer.FarmLocation,
                District = farmer.District,
                State = farmer.State,
                Pincode = farmer.Pincode,
                AskingPrice = 28,
                ImageUrl = "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600",
                ExpectedSellingDate = DateTime.UtcNow.AddDays(7),
                Status = CropListingStatus.Available,
                CreatedAt = DateTime.UtcNow
            };
            _context.CropListings.Add(activeListing);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded active baseline crop listing for {Crop}.", tomato.CropName);
        }

        // 2. Seed BuyerRequirements if empty
        if (!await _context.BuyerRequirements.AnyAsync())
        {
            _context.BuyerRequirements.AddRange(
                new BuyerRequirement
                {
                    BuyerId = buyer.BuyerId,
                    CropId = tomato.CropId,
                    RequiredQuantity = 2000,
                    MinQuantity = 500,
                    MaxQuantity = 5000,
                    QualityGrade = "Grade A",
                    Location = buyer.District,
                    District = buyer.District,
                    State = buyer.State,
                    OfferedPrice = 26,
                    PurchaseDate = DateTime.UtcNow.AddDays(10),
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow
                },
                new BuyerRequirement
                {
                    BuyerId = buyer.BuyerId,
                    CropId = wheat.CropId,
                    RequiredQuantity = 5000,
                    MinQuantity = 1000,
                    MaxQuantity = 10000,
                    QualityGrade = "Grade A",
                    Location = buyer.District,
                    District = buyer.District,
                    State = buyer.State,
                    OfferedPrice = 24,
                    PurchaseDate = DateTime.UtcNow.AddDays(15),
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow
                }
            );
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded baseline buyer requirements.");
        }

        // 3. Seed Offers if empty
        Offer? sampleOffer = await _context.Offers.FirstOrDefaultAsync();
        if (sampleOffer == null)
        {
            sampleOffer = new Offer
            {
                CropListingId = activeListing.CropListingId,
                BuyerId = buyer.BuyerId,
                OfferedByUserId = buyer.UserId,
                Quantity = 500,
                OfferedPrice = 27,
                DeliveryDate = DateTime.UtcNow.AddDays(5),
                DeliveryConditions = "Direct farmgate pickup via insured logistics corridor",
                Status = OfferStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };
            _context.Offers.Add(sampleOffer);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded sample buyer offer.");
        }

        // 4. Seed Transaction if empty
        if (!await _context.Transactions.AnyAsync())
        {
            var tx = new Transaction
            {
                CropListingId = activeListing.CropListingId,
                FarmerId = farmer.FarmerId,
                BuyerId = buyer.BuyerId,
                OfferId = sampleOffer.OfferId,
                CropId = tomato.CropId,
                Quantity = 500,
                AgreedPrice = 27,
                TotalAmount = 500 * 27,
                DeliveryDate = DateTime.UtcNow.AddDays(4),
                TransactionStatus = TransactionStatus.Confirmed,
                CreatedAt = DateTime.UtcNow
            };
            _context.Transactions.Add(tx);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded baseline transaction.");
        }

        // 5. Seed AbnormalPriceAlert if empty
        if (!await _context.AbnormalPriceAlerts.AnyAsync())
        {
            _context.AbnormalPriceAlerts.Add(new AbnormalPriceAlert
            {
                CropListingId = activeListing.CropListingId,
                BuyerId = buyer.BuyerId,
                OfferId = sampleOffer.OfferId,
                ExpectedPrice = 30,
                OfferedPrice = 18,
                DifferencePercentage = -40,
                AlertType = "PredatoryPricing",
                Message = "Offered rate ₹18/kg is 40% below fair Mandi equilibrium price.",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
            _logger.LogInformation("Seeded baseline abnormal price alert.");
        }
    }
}