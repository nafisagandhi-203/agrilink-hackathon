using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.Conversation
{
    public class CreateConversationDtoValidator : AbstractValidator<CreateConversationDto>
    {
        public CreateConversationDtoValidator()
        {
                        RuleFor(x => x.FarmerId).GreaterThan(0);
        }
    }
}