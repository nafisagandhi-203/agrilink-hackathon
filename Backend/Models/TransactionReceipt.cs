using System;

namespace Models;

public class TransactionReceipt
{
    public int TransactionReceiptId { get; set; }
    public int TransactionId { get; set; }
    public string ReceiptNumber { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; }
    public decimal TotalAmount { get; set; }

    public Transaction Transaction { get; set; } = null!;
}
