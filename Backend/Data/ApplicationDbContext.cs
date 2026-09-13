using Microsoft.EntityFrameworkCore;
using Models;

namespace Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Farmer> Farmers { get; set; } = null!;
    public DbSet<Buyer> Buyers { get; set; } = null!;
    public DbSet<Admin> Admins { get; set; } = null!;
    
    public DbSet<Crop> Crops { get; set; } = null!;
    public DbSet<CropListing> CropListings { get; set; } = null!;
    public DbSet<BuyerRequirement> BuyerRequirements { get; set; } = null!;
    
    public DbSet<MarketPrice> MarketPrices { get; set; } = null!;
    public DbSet<PricePrediction> PricePredictions { get; set; } = null!;
    public DbSet<SellingInsight> SellingInsights { get; set; } = null!;
    public DbSet<AbnormalPriceAlert> AbnormalPriceAlerts { get; set; } = null!;
    public DbSet<BuyerRecommendation> BuyerRecommendations { get; set; } = null!;
    public DbSet<DemandForecast> DemandForecasts { get; set; } = null!;
    
    public DbSet<Conversation> Conversations { get; set; } = null!;
    public DbSet<Message> Messages { get; set; } = null!;
    public DbSet<Offer> Offers { get; set; } = null!;
    
    public DbSet<Transaction> Transactions { get; set; } = null!;
    public DbSet<TransactionReceipt> TransactionReceipts { get; set; } = null!;
    
    public DbSet<TransportProvider> TransportProviders { get; set; } = null!;
    public DbSet<TransportBooking> TransportBookings { get; set; } = null!;
    
    public DbSet<Notification> Notifications { get; set; } = null!;
    public DbSet<VoiceInteraction> VoiceInteractions { get; set; } = null!;
    public DbSet<UserVerification> UserVerifications { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- Decimal Precision Configurations ---
        foreach (var property in modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
        {
            property.SetColumnType("decimal(18,2)");
        }

        // Add 6 precision for Lat/Lng
        modelBuilder.Entity<TransportBooking>().Property(t => t.PickupLatitude).HasColumnType("decimal(9,6)");
        modelBuilder.Entity<TransportBooking>().Property(t => t.PickupLongitude).HasColumnType("decimal(9,6)");
        modelBuilder.Entity<TransportBooking>().Property(t => t.DeliveryLatitude).HasColumnType("decimal(9,6)");
        modelBuilder.Entity<TransportBooking>().Property(t => t.DeliveryLongitude).HasColumnType("decimal(9,6)");

        // --- Relationships & Behaviors ---

        // User - Farmer (1:1)
        modelBuilder.Entity<Farmer>()
            .HasOne(f => f.User)
            .WithOne(u => u.Farmer)
            .HasForeignKey<Farmer>(f => f.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // User - Buyer (1:1)
        modelBuilder.Entity<Buyer>()
            .HasOne(b => b.User)
            .WithOne(u => u.Buyer)
            .HasForeignKey<Buyer>(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // User - Admin (1:1)
        modelBuilder.Entity<Admin>()
            .HasOne(a => a.User)
            .WithOne(u => u.Admin)
            .HasForeignKey<Admin>(a => a.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Transaction - Receipt (1:1)
        modelBuilder.Entity<TransactionReceipt>()
            .HasOne(tr => tr.Transaction)
            .WithOne(t => t.TransactionReceipt)
            .HasForeignKey<TransactionReceipt>(tr => tr.TransactionId)
            .OnDelete(DeleteBehavior.Cascade);

        // UserVerification
        modelBuilder.Entity<UserVerification>()
            .HasOne(uv => uv.User)
            .WithOne(u => u.UserVerification)
            .HasForeignKey<UserVerification>(uv => uv.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<UserVerification>()
            .HasOne(uv => uv.VerifiedByUser)
            .WithMany(u => u.VerificationsPerformed)
            .HasForeignKey(uv => uv.VerifiedByUserId)
            .OnDelete(DeleteBehavior.SetNull);

        // Disable cascade delete for Transaction to prevent multiple cascade paths
        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Farmer)
            .WithMany(f => f.Transactions)
            .HasForeignKey(t => t.FarmerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Buyer)
            .WithMany(b => b.Transactions)
            .HasForeignKey(t => t.BuyerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.CropListing)
            .WithMany(c => c.Transactions)
            .HasForeignKey(t => t.CropListingId)
            .OnDelete(DeleteBehavior.Restrict);
            
        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Offer)
            .WithMany(o => o.Transactions)
            .HasForeignKey(t => t.OfferId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Crop)
            .WithMany(c => c.Transactions)
            .HasForeignKey(t => t.CropId)
            .OnDelete(DeleteBehavior.Restrict);

        // Conversations
        modelBuilder.Entity<Conversation>()
            .HasOne(c => c.Farmer)
            .WithMany(f => f.Conversations)
            .HasForeignKey(c => c.FarmerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Conversation>()
            .HasOne(c => c.Buyer)
            .WithMany(b => b.Conversations)
            .HasForeignKey(c => c.BuyerId)
            .OnDelete(DeleteBehavior.Restrict);
            
        modelBuilder.Entity<Conversation>()
            .HasOne(c => c.CropListing)
            .WithMany(cl => cl.Conversations)
            .HasForeignKey(c => c.CropListingId)
            .OnDelete(DeleteBehavior.Restrict);

        // Messages
        modelBuilder.Entity<Message>()
            .HasOne(m => m.SenderUser)
            .WithMany(u => u.Messages)
            .HasForeignKey(m => m.SenderUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Offers
        modelBuilder.Entity<Offer>()
            .HasOne(o => o.ParentOffer)
            .WithMany(o => o.CounterOffers)
            .HasForeignKey(o => o.ParentOfferId)
            .OnDelete(DeleteBehavior.Restrict);
            
        modelBuilder.Entity<Offer>()
            .HasOne(o => o.CropListing)
            .WithMany(cl => cl.Offers)
            .HasForeignKey(o => o.CropListingId)
            .OnDelete(DeleteBehavior.Restrict);
            
        modelBuilder.Entity<Offer>()
            .HasOne(o => o.Buyer)
            .WithMany(b => b.Offers)
            .HasForeignKey(o => o.BuyerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Offer>()
            .HasOne(o => o.OfferedByUser)
            .WithMany(u => u.OffersMade)
            .HasForeignKey(o => o.OfferedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Buyer Recommendation
        modelBuilder.Entity<BuyerRecommendation>()
            .HasIndex(br => new { br.CropListingId, br.BuyerId })
            .IsUnique();

        // Transport Booking
        modelBuilder.Entity<TransportBooking>()
            .HasOne(tb => tb.Transaction)
            .WithMany(t => t.TransportBookings)
            .HasForeignKey(tb => tb.TransactionId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TransportBooking>()
            .HasOne(tb => tb.TransportProvider)
            .WithMany(tp => tp.TransportBookings)
            .HasForeignKey(tb => tb.TransportProviderId)
            .OnDelete(DeleteBehavior.Restrict);

        // Transaction Receipt Unique
        modelBuilder.Entity<TransactionReceipt>()
            .HasIndex(tr => tr.ReceiptNumber)
            .IsUnique();

        // --- Indexes ---
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.PhoneNumber).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.RoleId);

        modelBuilder.Entity<CropListing>().HasIndex(cl => cl.FarmerId);
        modelBuilder.Entity<CropListing>().HasIndex(cl => cl.CropId);
        modelBuilder.Entity<CropListing>().HasIndex(cl => cl.Status);
        modelBuilder.Entity<CropListing>().HasIndex(cl => new { cl.State, cl.District });
        modelBuilder.Entity<CropListing>().HasIndex(cl => cl.ExpectedSellingDate);
        modelBuilder.Entity<CropListing>().Property(cl => cl.ImageUrl).HasMaxLength(500).IsRequired(false);

        modelBuilder.Entity<Buyer>().HasIndex(b => b.UserId);
        modelBuilder.Entity<Buyer>().HasIndex(b => new { b.State, b.District });
        modelBuilder.Entity<Buyer>().HasIndex(b => b.PreferredCommodity);

        modelBuilder.Entity<BuyerRequirement>().HasIndex(br => br.BuyerId);
        modelBuilder.Entity<BuyerRequirement>().HasIndex(br => br.CropId);
        modelBuilder.Entity<BuyerRequirement>().HasIndex(br => new { br.State, br.District });
        modelBuilder.Entity<BuyerRequirement>().HasIndex(br => br.PurchaseDate);

        modelBuilder.Entity<MarketPrice>().HasIndex(mp => new { mp.CropId, mp.Location, mp.PriceDate });
        modelBuilder.Entity<MarketPrice>().HasIndex(mp => new { mp.CropId, mp.PriceDate });

        modelBuilder.Entity<PricePrediction>().HasIndex(pp => new { pp.CropId, pp.Location, pp.PredictionForDate });
        modelBuilder.Entity<DemandForecast>().HasIndex(df => new { df.CropId, df.Location, df.ForecastForDate });

        modelBuilder.Entity<Offer>().HasIndex(o => o.CropListingId);
        modelBuilder.Entity<Offer>().HasIndex(o => o.BuyerId);
        modelBuilder.Entity<Offer>().HasIndex(o => o.Status);
        modelBuilder.Entity<Offer>().HasIndex(o => o.CreatedAt);

        modelBuilder.Entity<Message>().HasIndex(m => new { m.ConversationId, m.SentAt });

        modelBuilder.Entity<Transaction>().HasIndex(t => t.FarmerId);
        modelBuilder.Entity<Transaction>().HasIndex(t => t.BuyerId);
        modelBuilder.Entity<Transaction>().HasIndex(t => t.CropId);
        modelBuilder.Entity<Transaction>().HasIndex(t => t.TransactionStatus);
        modelBuilder.Entity<Transaction>().HasIndex(t => t.CreatedAt);

        modelBuilder.Entity<TransportBooking>().HasIndex(tb => tb.TransactionId);
        modelBuilder.Entity<TransportBooking>().HasIndex(tb => tb.TransportProviderId);
        modelBuilder.Entity<TransportBooking>().HasIndex(tb => tb.BookingStatus);

        modelBuilder.Entity<Notification>().HasIndex(n => new { n.UserId, n.IsRead, n.CreatedAt });
        
        // AbnormalPriceAlerts
        modelBuilder.Entity<AbnormalPriceAlert>()
            .HasOne(a => a.CropListing)
            .WithMany(c => c.AbnormalPriceAlerts)
            .HasForeignKey(a => a.CropListingId)
            .OnDelete(DeleteBehavior.Restrict);
            
        modelBuilder.Entity<AbnormalPriceAlert>()
            .HasOne(a => a.Buyer)
            .WithMany(b => b.AbnormalPriceAlerts)
            .HasForeignKey(a => a.BuyerId)
            .OnDelete(DeleteBehavior.Restrict);
            
        modelBuilder.Entity<AbnormalPriceAlert>()
            .HasOne(a => a.Offer)
            .WithMany(o => o.AbnormalPriceAlerts)
            .HasForeignKey(a => a.OfferId)
            .OnDelete(DeleteBehavior.Restrict);

        // --- Seed Default Roles ---
        modelBuilder.Entity<Role>().HasData(
            new Role { RoleId = 1, Name = "Farmer" },
            new Role { RoleId = 2, Name = "Buyer" },
            new Role { RoleId = 3, Name = "Admin" }
        );
    }
}
