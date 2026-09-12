using System;
using Models.Enums;

namespace DTOs;

public class MessageDto
{
    public int MessageId { get; set; }
    public int ConversationId { get; set; }
    public int SenderUserId { get; set; }
    public string MessageText { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public bool IsRead { get; set; }
}

public class CreateMessageDto
{
    public int ConversationId { get; set; }
    public int SenderUserId { get; set; }
    public string MessageText { get; set; } = string.Empty;
    public bool IsRead { get; set; }
}

public class UpdateMessageDto
{
    public string MessageText { get; set; } = string.Empty;
    public bool IsRead { get; set; }
}
