using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.Buyer
{
    public class UpdateBuyerDtoValidator : AbstractValidator<UpdateBuyerDto>
    {
        public UpdateBuyerDtoValidator()
        {
                        RuleFor(x => x.BuyerType).NotEmpty().MaximumLength(255);
        }
    }
}