using FluentValidation;
using HackathonProject.DTOs;
using DTOs;

namespace Validators.BuyerRequirement
{
    public class UpdateBuyerRequirementDtoValidator : AbstractValidator<UpdateBuyerRequirementDto>
    {
        public UpdateBuyerRequirementDtoValidator()
        {
                        RuleFor(x => x.RequiredQuantity).GreaterThanOrEqualTo(0);
        }
    }
}