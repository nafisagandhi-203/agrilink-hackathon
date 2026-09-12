using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.Farmer
{
    public class CreateFarmerDtoValidator : AbstractValidator<CreateFarmerDto>
    {
        public CreateFarmerDtoValidator()
        {
                        RuleFor(x => x.UserId).GreaterThan(0);
        }
    }
}