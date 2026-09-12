using FluentValidation;
using DTOs;

namespace Validators.SellingInsight;

public class CreateSellingInsightDtoValidator : AbstractValidator<CreateSellingInsightDto>
{
    public CreateSellingInsightDtoValidator()
    {
        RuleFor(x => x.CropListingId).GreaterThan(0).WithMessage("CropListingId must be greater than 0.");
        RuleFor(x => x.CurrentPrice).GreaterThanOrEqualTo(0).WithMessage("CurrentPrice must be greater than or equal to 0.");
        RuleFor(x => x.FairPrice).GreaterThanOrEqualTo(0).WithMessage("FairPrice must be greater than or equal to 0.");
        RuleFor(x => x.PredictedFuturePrice).GreaterThanOrEqualTo(0).WithMessage("PredictedFuturePrice must be greater than or equal to 0.");
        RuleFor(x => x.Recommendation).IsInEnum().WithMessage("Invalid Recommendation.");
        RuleFor(x => x.Reason).NotEmpty().WithMessage("Reason is required.").MaximumLength(255).WithMessage("Reason cannot exceed 255 characters.");
        RuleFor(x => x.ConfidenceScore).InclusiveBetween(0, 100).WithMessage("ConfidenceScore must be between 0 and 100.");
    }
}
