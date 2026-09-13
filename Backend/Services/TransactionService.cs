using System;
using System.Threading.Tasks;
using Data;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Enums;

namespace Services;

public interface ITransactionService
{
    Task<(Transaction? Transaction, string? Error)> CreateFromAcceptedOfferAsync(int offerId);
    Task CreateNotificationAsync(int userId, NotificationType type, string title, string message);
}

public class TransactionService : ITransactionService
{
    private readonly ApplicationDbContext _context;

    public TransactionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<(Transaction? Transaction, string? Error)> CreateFromAcceptedOfferAsync(int offerId)
    {
        var offer = await _context.Offers
            .Include(o => o.CropListing).ThenInclude(cl => cl.Farmer)
            .Include(o => o.CropListing).ThenInclude(cl => cl.Crop)
            .FirstOrDefaultAsync(o => o.OfferId == offerId);

        if (offer == null) return (null, "Offer not found.");
        if (offer.Status != OfferStatus.Accepted) return (null, "Only an accepted offer can create a transaction.");
        if (await _context.Transactions.AnyAsync(t => t.OfferId == offerId))
            return (null, "A transaction already exists for this offer.");
        if (offer.Quantity > offer.CropListing.AvailableQuantity)
            return (null, "Offer quantity exceeds the listing's available quantity.");

        var transaction = new Transaction
        {
            CropListingId = offer.CropListingId,
            FarmerId = offer.CropListing.FarmerId,
            BuyerId = offer.BuyerId,
            OfferId = offer.OfferId,
            CropId = offer.CropListing.CropId,
            Quantity = offer.Quantity,
            AgreedPrice = offer.OfferedPrice,
            TotalAmount = offer.Quantity * offer.OfferedPrice,
            DeliveryDate = offer.DeliveryDate,
            TransactionStatus = TransactionStatus.Confirmed,
            CreatedAt = DateTime.UtcNow
        };

        offer.CropListing.AvailableQuantity -= offer.Quantity;
        offer.CropListing.UpdatedAt = DateTime.UtcNow;
        if (offer.CropListing.AvailableQuantity <= 0)
        {
            offer.CropListing.AvailableQuantity = 0;
            offer.CropListing.Status = CropListingStatus.Sold;
        }

        _context.Transactions.Add(transaction);

        if (offer.CropListing.Status == CropListingStatus.Sold)
        {
            var openOffers = await _context.Offers
                .Where(o => o.CropListingId == offer.CropListingId
                            && o.OfferId != offer.OfferId
                            && (o.Status == OfferStatus.Pending || o.Status == OfferStatus.Countered))
                .ToListAsync();
            foreach (var openOffer in openOffers)
            {
                openOffer.Status = OfferStatus.Rejected;
                openOffer.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();

        return (transaction, null);
    }

    public async Task CreateNotificationAsync(int userId, NotificationType type, string title, string message)
    {
        if (userId <= 0) return;
        _context.Notifications.Add(new Notification
        {
            UserId = userId,
            NotificationType = type,
            Title = title,
            Message = message,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();
    }
}