using FluentValidation;
using DTOs.Auth;

namespace Validators.Auth;

public class RegisterRequestDTOValidator : AbstractValidator<RegisterRequestDTO>
{
    public RegisterRequestDTOValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(255);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(255);
        RuleFor(x => x.PhoneNumber).NotEmpty().MaximumLength(20);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
        RuleFor(x => x.Role)
            .NotEmpty()
            .Must(r => string.Equals(r, "Farmer", StringComparison.OrdinalIgnoreCase)
                || string.Equals(r, "Buyer", StringComparison.OrdinalIgnoreCase))
            .WithMessage("Role must be either 'Farmer' or 'Buyer'.");
    }
}
