using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.Admin
{
    public class CreateAdminDtoValidator : AbstractValidator<CreateAdminDto>
    {
        public CreateAdminDtoValidator()
        {
                        RuleFor(x => x.UserId).GreaterThan(0);
        }
    }
}