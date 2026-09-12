using System;
using FluentValidation;

namespace HackathonProject.DTOs
{
    public class MarketPriceCreateDto
    {
        public int CropId { get; set; }
        public string MarketName { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public decimal MinPrice { get; set; }
        public decimal MaxPrice { get; set; }
        public decimal ModalPrice { get; set; }
        public string Unit { get; set; } = string.Empty;
        public DateTime PriceDate { get; set; }
        public string Source { get; set; } = string.Empty;
    }

    public class MarketPriceCreateDtoValidator : AbstractValidator<MarketPriceCreateDto>
    {
        public MarketPriceCreateDtoValidator()
        {
            RuleFor(x => x.CropId).GreaterThan(0);
            RuleFor(x => x.MarketName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.MinPrice).GreaterThanOrEqualTo(0);
            RuleFor(x => x.MaxPrice).GreaterThanOrEqualTo(x => x.MinPrice);
            RuleFor(x => x.ModalPrice).GreaterThanOrEqualTo(0);
            RuleFor(x => x.Unit).NotEmpty().MaximumLength(50);
        }
    }

    public class MarketPriceUpdateDto : MarketPriceCreateDto { }

    public class MarketPriceUpdateDtoValidator : AbstractValidator<MarketPriceUpdateDto>
    {
        public MarketPriceUpdateDtoValidator()
        {
            RuleFor(x => x.CropId).GreaterThan(0);
            RuleFor(x => x.MarketName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.MinPrice).GreaterThanOrEqualTo(0);
            RuleFor(x => x.MaxPrice).GreaterThanOrEqualTo(x => x.MinPrice);
            RuleFor(x => x.ModalPrice).GreaterThanOrEqualTo(0);
            RuleFor(x => x.Unit).NotEmpty().MaximumLength(50);
        }
    }

    public class MarketPriceResponseDto : MarketPriceCreateDto
    {
        public int MarketPriceId { get; set; }
        public string CropName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
