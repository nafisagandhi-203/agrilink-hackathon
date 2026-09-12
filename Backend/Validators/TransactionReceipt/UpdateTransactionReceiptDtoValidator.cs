using FluentValidation;
using DTOs;
// using HackathonProject.DTOs;

namespace Validators.TransactionReceipt
{
    public class UpdateTransactionReceiptDtoValidator : AbstractValidator<UpdateTransactionReceiptDto>
    {
        public UpdateTransactionReceiptDtoValidator()
        {
                        RuleFor(x => x.ReceiptNumber).NotEmpty().MaximumLength(255);
        }
    }
}