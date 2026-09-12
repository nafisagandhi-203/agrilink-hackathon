using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.Message
{
    public class CreateMessageDtoValidator : AbstractValidator<CreateMessageDto>
    {
        public CreateMessageDtoValidator()
        {
                        RuleFor(x => x.ConversationId).GreaterThan(0);
        }
    }
}