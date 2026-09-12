using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.Buyer
{
    public class CreateBuyerDtoValidator : AbstractValidator<CreateBuyerDto>
    {
        public CreateBuyerDtoValidator()
        {
                        RuleFor(x => x.UserId).GreaterThan(0);
        }
    }
}