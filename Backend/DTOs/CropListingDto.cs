using System;
using FluentValidation;
using Microsoft.AspNetCore.Http;
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
        public string? ImageUrl { get; set; }
    }

    public class CropListingCreateFormDto : CropListingCreateDto
    {
        public IFormFile? Image { get; set; }
    }

    public class CropListingCreateDtoValidator : AbstractValidator<CropListingCreateDto>
    {
        public CropListingCreateDtoValidator()
        {
            RuleFor(x => x.FarmerId).GreaterThanOrEqualTo(0);
            RuleFor(x => x.CropId).GreaterThan(0);
            RuleFor(x => x.Quantity).GreaterThan(0);
            RuleFor(x => x.Unit).NotEmpty().MaximumLength(50);
            RuleFor(x => x.AskingPrice).GreaterThan(0);
        }
    }

    public class CropListingUpdateDto
    {
        public int? FarmerId { get; set; }
        public int? CropId { get; set; }
        public decimal? Quantity { get; set; }
        public string? Unit { get; set; }
        public string? QualityGrade { get; set; }
        public string? Location { get; set; }
        public string? District { get; set; }
        public string? State { get; set; }
        public string? Pincode { get; set; }
        public DateTime? ExpectedSellingDate { get; set; }
        public decimal? AskingPrice { get; set; }
        public string? ImageUrl { get; set; }
        public string? Status { get; set; }
    }

    public class CropListingUpdateFormDto : CropListingUpdateDto
    {
        public IFormFile? Image { get; set; }
    }

    public class CropListingUpdateDtoValidator : AbstractValidator<CropListingUpdateDto>
    {
        public CropListingUpdateDtoValidator()
        {
            RuleFor(x => x.Quantity).GreaterThan(0).When(x => x.Quantity.HasValue);
            RuleFor(x => x.AskingPrice).GreaterThan(0).When(x => x.AskingPrice.HasValue);
            RuleFor(x => x.Unit).MaximumLength(50).When(x => !string.IsNullOrEmpty(x.Unit));
            RuleFor(x => x.Status).Must(s => s == null || s.Equals("Available", StringComparison.OrdinalIgnoreCase)
                || s.Equals("Sold", StringComparison.OrdinalIgnoreCase)
                || s.Equals("Expired", StringComparison.OrdinalIgnoreCase));
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
        public string? Image => ImageUrl;
    }

    public class CropListingImageUploadResponseDto
    {
        public int CropListingId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
