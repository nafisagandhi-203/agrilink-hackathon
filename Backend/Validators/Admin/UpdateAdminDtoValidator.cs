using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.Admin
{
    public class UpdateAdminDtoValidator : AbstractValidator<UpdateAdminDto>
    {
        public UpdateAdminDtoValidator()
        {
                        RuleFor(x => x.Department).NotEmpty().MaximumLength(255);
        }
    }
}