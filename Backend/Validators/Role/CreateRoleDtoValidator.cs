using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.Role
{
    public class CreateRoleDtoValidator : AbstractValidator<CreateRoleDto>
    {
        public CreateRoleDtoValidator()
        {
                        RuleFor(x => x.Name).NotEmpty().MaximumLength(255);
        }
    }
}