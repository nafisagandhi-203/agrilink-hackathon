using System;
using FluentValidation;
using Models.Enums;

namespace HackathonProject.DTOs
{
    public class CropListingCreateDto
    {
        public int FarmerId { get; set; }
        public int CropId { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = string.Empty;
        public string QualityGrade { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Pincode { get; set; } = string.Empty;
        public DateTime ExpectedSellingDate { get; set; }
        public decimal AskingPrice { get; set; }
    }

    public class CropListingCreateDtoValidator : AbstractValidator<CropListingCreateDto>
    {
        public CropListingCreateDtoValidator()
        {
            RuleFor(x => x.FarmerId).GreaterThan(0);
            RuleFor(x => x.CropId).GreaterThan(0);
            RuleFor(x => x.Quantity).GreaterThan(0);
            RuleFor(x => x.Unit).NotEmpty().MaximumLength(50);
            RuleFor(x => x.AskingPrice).GreaterThan(0);
        }
    }

    public class CropListingUpdateDto : CropListingCreateDto
    {
        public CropListingStatus Status { get; set; }
    }

    public class CropListingUpdateDtoValidator : AbstractValidator<CropListingUpdateDto>
    {
        public CropListingUpdateDtoValidator()
        {
            RuleFor(x => x.FarmerId).GreaterThan(0);
            RuleFor(x => x.CropId).GreaterThan(0);
            RuleFor(x => x.Quantity).GreaterThan(0);
            RuleFor(x => x.Unit).NotEmpty().MaximumLength(50);
            RuleFor(x => x.AskingPrice).GreaterThan(0);
            RuleFor(x => x.Status).IsInEnum();
        }
    }

    public class CropListingResponseDto : CropListingCreateDto
    {
        public int CropListingId { get; set; }
        public string FarmerName { get; set; } = string.Empty;
        public string CropName { get; set; } = string.Empty;
        public decimal AvailableQuantity { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
