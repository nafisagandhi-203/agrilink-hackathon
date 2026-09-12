using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.Farmer
{
    public class UpdateFarmerDtoValidator : AbstractValidator<UpdateFarmerDto>
    {
        public UpdateFarmerDtoValidator()
        {
                        RuleFor(x => x.FarmName).NotEmpty().MaximumLength(255);
        }
    }
}