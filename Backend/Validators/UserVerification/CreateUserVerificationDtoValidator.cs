using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.UserVerification
{
    public class CreateUserVerificationDtoValidator : AbstractValidator<CreateUserVerificationDto>
    {
        public CreateUserVerificationDtoValidator()
        {
                        RuleFor(x => x.UserId).GreaterThan(0);
        }
    }
}