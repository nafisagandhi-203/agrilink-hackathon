using FluentValidation;
using DTOs;

namespace Validators.BuyerRecommendation;

public class UpdateBuyerRecommendationDtoValidator : AbstractValidator<UpdateBuyerRecommendationDto>
{
    public UpdateBuyerRecommendationDtoValidator()
    {
        RuleFor(x => x.CropListingId).GreaterThan(0).WithMessage("CropListingId must be greater than 0.");
        RuleFor(x => x.BuyerId).GreaterThan(0).WithMessage("BuyerId must be greater than 0.");
        RuleFor(x => x.CompatibilityScore).InclusiveBetween(0, 100).WithMessage("CompatibilityScore must be between 0 and 100.");
        RuleFor(x => x.CropMatchScore).InclusiveBetween(0, 100).WithMessage("CropMatchScore must be between 0 and 100.");
        RuleFor(x => x.QuantityMatchScore).InclusiveBetween(0, 100).WithMessage("QuantityMatchScore must be between 0 and 100.");
        RuleFor(x => x.QualityMatchScore).InclusiveBetween(0, 100).WithMessage("QualityMatchScore must be between 0 and 100.");
        RuleFor(x => x.LocationMatchScore).InclusiveBetween(0, 100).WithMessage("LocationMatchScore must be between 0 and 100.");
        RuleFor(x => x.PriceMatchScore).InclusiveBetween(0, 100).WithMessage("PriceMatchScore must be between 0 and 100.");
        RuleFor(x => x.DateMatchScore).InclusiveBetween(0, 100).WithMessage("DateMatchScore must be between 0 and 100.");
        RuleFor(x => x.RecommendationReason).NotEmpty().WithMessage("RecommendationReason is required.").MaximumLength(255).WithMessage("RecommendationReason cannot exceed 255 characters.");
    }
}
