using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.VoiceInteraction
{
    public class CreateVoiceInteractionDtoValidator : AbstractValidator<CreateVoiceInteractionDto>
    {
        public CreateVoiceInteractionDtoValidator()
        {
                        RuleFor(x => x.UserId).GreaterThan(0);
        }
    }
}