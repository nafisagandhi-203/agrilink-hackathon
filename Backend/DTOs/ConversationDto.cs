using System;
using Models.Enums;

namespace DTOs;

public class ConversationDto
{
    public int ConversationId { get; set; }
    public int FarmerId { get; set; }
    public int BuyerId { get; set; }
    public int CropListingId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateConversationDto
{
    public int FarmerId { get; set; }
    public int BuyerId { get; set; }
    public int CropListingId { get; set; }
}

public class UpdateConversationDto
{
}
