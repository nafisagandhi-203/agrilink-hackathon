using System;
using FluentValidation;
using Models.Enums;

namespace HackathonProject.DTOs
{
    public class TransactionCreateFromOfferDto
    {
        public int OfferId { get; set; }
    }

    public class TransactionCreateFromOfferDtoValidator : AbstractValidator<TransactionCreateFromOfferDto>
    {
        public TransactionCreateFromOfferDtoValidator()
        {
            RuleFor(x => x.OfferId).GreaterThan(0);
        }
    }

    public class TransactionStatusUpdateDto
    {
        public TransactionStatus Status { get; set; }
    }

    public class TransactionStatusUpdateDtoValidator : AbstractValidator<TransactionStatusUpdateDto>
    {
        public TransactionStatusUpdateDtoValidator()
        {
            RuleFor(x => x.Status).IsInEnum();
        }
    }

    public class TransactionResponseDto
    {
        public int TransactionId { get; set; }
        public int CropListingId { get; set; }
        public string CropName { get; set; } = string.Empty;
        public int FarmerId { get; set; }
        public string FarmerName { get; set; } = string.Empty;
        public int BuyerId { get; set; }
        public string BuyerName { get; set; } = string.Empty;
        public int OfferId { get; set; }
        public int CropId { get; set; }
        public decimal Quantity { get; set; }
        public decimal AgreedPrice { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string TransactionStatus { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}