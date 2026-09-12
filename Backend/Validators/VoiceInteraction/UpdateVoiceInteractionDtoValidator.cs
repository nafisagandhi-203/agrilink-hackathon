using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.VoiceInteraction
{
    public class UpdateVoiceInteractionDtoValidator : AbstractValidator<UpdateVoiceInteractionDto>
    {
        public UpdateVoiceInteractionDtoValidator()
        {
                        RuleFor(x => x.Language).NotEmpty().MaximumLength(255);
        }
    }
}