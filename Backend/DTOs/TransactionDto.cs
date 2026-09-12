using System;
using FluentValidation;
using Models.Enums;

namespace HackathonProject.DTOs
{
    public class TransactionCreateDto
    {
        public int CropListingId { get; set; }
        public int FarmerId { get; set; }
        public int BuyerId { get; set; }
        public int OfferId { get; set; }
        public int CropId { get; set; }
        public decimal Quantity { get; set; }
        public decimal AgreedPrice { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime DeliveryDate { get; set; }
    }

    public class TransactionCreateDtoValidator : AbstractValidator<TransactionCreateDto>
    {
        public TransactionCreateDtoValidator()
        {
            RuleFor(x => x.CropListingId).GreaterThan(0);
            RuleFor(x => x.FarmerId).GreaterThan(0);
            RuleFor(x => x.BuyerId).GreaterThan(0);
            RuleFor(x => x.OfferId).GreaterThan(0);
            RuleFor(x => x.CropId).GreaterThan(0);
            RuleFor(x => x.Quantity).GreaterThan(0);
            RuleFor(x => x.AgreedPrice).GreaterThan(0);
            RuleFor(x => x.TotalAmount).GreaterThan(0);
        }
    }

    public class TransactionUpdateDto : TransactionCreateDto
    {
        public TransactionStatus TransactionStatus { get; set; }
    }

    public class TransactionUpdateDtoValidator : AbstractValidator<TransactionUpdateDto>
    {
        public TransactionUpdateDtoValidator()
        {
            RuleFor(x => x.CropListingId).GreaterThan(0);
            RuleFor(x => x.FarmerId).GreaterThan(0);
            RuleFor(x => x.BuyerId).GreaterThan(0);
            RuleFor(x => x.OfferId).GreaterThan(0);
            RuleFor(x => x.CropId).GreaterThan(0);
            RuleFor(x => x.Quantity).GreaterThan(0);
            RuleFor(x => x.AgreedPrice).GreaterThan(0);
            RuleFor(x => x.TotalAmount).GreaterThan(0);
            RuleFor(x => x.TransactionStatus).IsInEnum();
        }
    }

    public class TransactionResponseDto : TransactionCreateDto
    {
        public int TransactionId { get; set; }
        public string FarmerName { get; set; } = string.Empty;
        public string BuyerName { get; set; } = string.Empty;
        public string CropName { get; set; } = string.Empty;
        public string TransactionStatus { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}
