using System;
using FluentValidation;
using Models.Enums;

namespace HackathonProject.DTOs
{
    public class OfferCreateDto
    {
        public int CropListingId { get; set; }
        public int BuyerId { get; set; }
        public int OfferedByUserId { get; set; }
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
            RuleFor(x => x.BuyerId).GreaterThan(0);
            RuleFor(x => x.OfferedByUserId).GreaterThan(0);
            RuleFor(x => x.Quantity).GreaterThan(0);
            RuleFor(x => x.OfferedPrice).GreaterThan(0);
        }
    }

    public class OfferUpdateDto : OfferCreateDto
    {
        public OfferStatus Status { get; set; }
    }

    public class OfferUpdateDtoValidator : AbstractValidator<OfferUpdateDto>
    {
        public OfferUpdateDtoValidator()
        {
            RuleFor(x => x.CropListingId).GreaterThan(0);
            RuleFor(x => x.BuyerId).GreaterThan(0);
            RuleFor(x => x.OfferedByUserId).GreaterThan(0);
            RuleFor(x => x.Quantity).GreaterThan(0);
            RuleFor(x => x.OfferedPrice).GreaterThan(0);
            RuleFor(x => x.Status).IsInEnum();
        }
    }

    public class OfferResponseDto : OfferCreateDto
    {
        public int OfferId { get; set; }
        public string BuyerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
