using System;
using FluentValidation;

namespace HackathonProject.DTOs
{
    public class OfferCreateDto
    {
        public int CropListingId { get; set; }
        public decimal Quantity { get; set; }
        public decimal OfferedPrice { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string DeliveryConditions { get; set; } = string.Empty;
        public int? ParentOfferId { get; set; }
    }

    public class OfferCreateDtoValidator : AbstractValidator<OfferCreateDto>
    {
        public OfferCreateDtoValidator()
        {
            RuleFor(x => x.CropListingId).GreaterThan(0);
            RuleFor(x => x.Quantity).GreaterThan(0);
            RuleFor(x => x.OfferedPrice).GreaterThan(0);
            RuleFor(x => x.DeliveryDate).NotEmpty();
        }
    }

    public class OfferResponseDto
    {
        public int OfferId { get; set; }
        public int CropListingId { get; set; }
        public string CropName { get; set; } = string.Empty;
        public string FarmerName { get; set; } = string.Empty;
        public int BuyerId { get; set; }
        public string BuyerName { get; set; } = string.Empty;
        public int OfferedByUserId { get; set; }
        public decimal Quantity { get; set; }
        public decimal OfferedPrice { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string DeliveryConditions { get; set; } = string.Empty;
        public int? ParentOfferId { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}