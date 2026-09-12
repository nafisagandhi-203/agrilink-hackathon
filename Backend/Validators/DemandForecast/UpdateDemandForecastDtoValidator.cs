using FluentValidation;
using DTOs;

namespace Validators.DemandForecast;

public class UpdateDemandForecastDtoValidator : AbstractValidator<UpdateDemandForecastDto>
{
    public UpdateDemandForecastDtoValidator()
    {
        RuleFor(x => x.CropId).GreaterThan(0).WithMessage("CropId must be greater than 0.");
        RuleFor(x => x.Location).NotEmpty().WithMessage("Location is required.").MaximumLength(255).WithMessage("Location cannot exceed 255 characters.");
        RuleFor(x => x.PredictedDemand).GreaterThanOrEqualTo(0).WithMessage("PredictedDemand must be greater than or equal to 0.");
        RuleFor(x => x.DemandUnit).NotEmpty().WithMessage("DemandUnit is required.").MaximumLength(255).WithMessage("DemandUnit cannot exceed 255 characters.");
        RuleFor(x => x.DemandTrend).IsInEnum().WithMessage("Invalid DemandTrend.");
        RuleFor(x => x.ConfidenceScore).InclusiveBetween(0, 100).WithMessage("ConfidenceScore must be between 0 and 100.");
        RuleFor(x => x.ModelVersion).NotEmpty().WithMessage("ModelVersion is required.").MaximumLength(255).WithMessage("ModelVersion cannot exceed 255 characters.");
    }
}
