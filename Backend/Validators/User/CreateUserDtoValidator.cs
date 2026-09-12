using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.User
{
    public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
    {
        public CreateUserDtoValidator()
        {
                        RuleFor(x => x.FullName).NotEmpty().MaximumLength(255);
        }
    }
}