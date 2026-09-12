using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.Crop
{
    public class CreateCropDtoValidator : AbstractValidator<CreateCropDto>
    {
        public CreateCropDtoValidator()
        {
                        RuleFor(x => x.CropName).NotEmpty().MaximumLength(255);
        }
    }
}