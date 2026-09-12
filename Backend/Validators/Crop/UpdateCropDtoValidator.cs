using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.Crop
{
    public class UpdateCropDtoValidator : AbstractValidator<UpdateCropDto>
    {
        public UpdateCropDtoValidator()
        {
                        RuleFor(x => x.CropName).NotEmpty().MaximumLength(255);
        }
    }
}