using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.Role
{
    public class UpdateRoleDtoValidator : AbstractValidator<UpdateRoleDto>
    {
        public UpdateRoleDtoValidator()
        {
                        RuleFor(x => x.Name).NotEmpty().MaximumLength(255);
        }
    }
}