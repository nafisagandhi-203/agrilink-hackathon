using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.Message
{
    public class UpdateMessageDtoValidator : AbstractValidator<UpdateMessageDto>
    {
        public UpdateMessageDtoValidator()
        {
                        RuleFor(x => x.MessageText).NotEmpty().MaximumLength(255);
        }
    }
}