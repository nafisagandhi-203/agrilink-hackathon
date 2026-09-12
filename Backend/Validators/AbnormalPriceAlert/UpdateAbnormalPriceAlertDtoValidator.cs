using FluentValidation;
using DTOs;

namespace Validators.AbnormalPriceAlert;

public class UpdateAbnormalPriceAlertDtoValidator : AbstractValidator<UpdateAbnormalPriceAlertDto>
{
    public UpdateAbnormalPriceAlertDtoValidator()
    {
        RuleFor(x => x.ExpectedPrice).GreaterThanOrEqualTo(0).WithMessage("ExpectedPrice must be greater than or equal to 0.");
        RuleFor(x => x.OfferedPrice).GreaterThanOrEqualTo(0).WithMessage("OfferedPrice must be greater than or equal to 0.");
        RuleFor(x => x.DifferencePercentage).InclusiveBetween(0, 100).WithMessage("DifferencePercentage must be between 0 and 100.");
        RuleFor(x => x.AlertType).NotEmpty().WithMessage("AlertType is required.").MaximumLength(255).WithMessage("AlertType cannot exceed 255 characters.");
        RuleFor(x => x.Message).NotEmpty().WithMessage("Message is required.").MaximumLength(255).WithMessage("Message cannot exceed 255 characters.");
    }
}
