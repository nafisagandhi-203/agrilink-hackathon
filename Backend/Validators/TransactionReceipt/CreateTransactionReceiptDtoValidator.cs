using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.TransactionReceipt
{
    public class CreateTransactionReceiptDtoValidator : AbstractValidator<CreateTransactionReceiptDto>
    {
        public CreateTransactionReceiptDtoValidator()
        {
                        RuleFor(x => x.TransactionId).GreaterThan(0);
        }
    }
}