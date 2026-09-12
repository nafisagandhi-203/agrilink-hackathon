using FluentValidation;
using DTOs;

namespace Validators.PricePrediction;

public class UpdatePricePredictionDtoValidator : AbstractValidator<UpdatePricePredictionDto>
{
    public UpdatePricePredictionDtoValidator()
    {
        RuleFor(x => x.CropId).GreaterThan(0).WithMessage("CropId must be greater than 0.");
        RuleFor(x => x.Location).NotEmpty().WithMessage("Location is required.").MaximumLength(255).WithMessage("Location cannot exceed 255 characters.");
        RuleFor(x => x.QualityGrade).NotEmpty().WithMessage("QualityGrade is required.").MaximumLength(255).WithMessage("QualityGrade cannot exceed 255 characters.");
        RuleFor(x => x.Quantity).GreaterThanOrEqualTo(0).WithMessage("Quantity must be greater than or equal to 0.");
        RuleFor(x => x.CurrentMarketPrice).GreaterThanOrEqualTo(0).WithMessage("CurrentMarketPrice must be greater than or equal to 0.");
        RuleFor(x => x.FairPriceMin).GreaterThanOrEqualTo(0).WithMessage("FairPriceMin must be greater than or equal to 0.");
        RuleFor(x => x.FairPriceMax).GreaterThanOrEqualTo(0).WithMessage("FairPriceMax must be greater than or equal to 0.");
        RuleFor(x => x.PredictedPrice).GreaterThanOrEqualTo(0).WithMessage("PredictedPrice must be greater than or equal to 0.");
        RuleFor(x => x.ConfidenceScore).InclusiveBetween(0, 100).WithMessage("ConfidenceScore must be between 0 and 100.");
        RuleFor(x => x.ModelVersion).NotEmpty().WithMessage("ModelVersion is required.").MaximumLength(255).WithMessage("ModelVersion cannot exceed 255 characters.");
    }
}
