using System;
using Models.Enums;

namespace DTOs;

public class TransactionReceiptDto
{
    public int TransactionReceiptId { get; set; }
    public int TransactionId { get; set; }
    public string ReceiptNumber { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; }
    public decimal TotalAmount { get; set; }
}

public class CreateTransactionReceiptDto
{
    public int TransactionId { get; set; }
    public string ReceiptNumber { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
}

public class UpdateTransactionReceiptDto
{
    public string ReceiptNumber { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
}
