using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.Notification
{
    public class CreateNotificationDtoValidator : AbstractValidator<CreateNotificationDto>
    {
        public CreateNotificationDtoValidator()
        {
                        RuleFor(x => x.UserId).GreaterThan(0);
        }
    }
}