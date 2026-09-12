using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.BuyerRequirement
{
    public class CreateBuyerRequirementDtoValidator : AbstractValidator<CreateBuyerRequirementDto>
    {
        public CreateBuyerRequirementDtoValidator()
        {
                        RuleFor(x => x.BuyerId).GreaterThan(0);
        }
    }
}