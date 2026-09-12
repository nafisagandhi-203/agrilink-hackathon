using FluentValidation;
using HackathonProject.DTOs;
using DTOs;

namespace Validators.User
{
    public class UpdateUserDtoValidator : AbstractValidator<UpdateUserDto>
    {
        public UpdateUserDtoValidator()
        {
                        RuleFor(x => x.FullName).NotEmpty().MaximumLength(255);
        }
    }
}