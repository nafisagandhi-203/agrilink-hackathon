using System;

namespace Models;

public class VoiceInteraction
{
    public int VoiceInteractionId { get; set; }
    public int UserId { get; set; }
    public string Language { get; set; } = string.Empty;
    public string RecognizedText { get; set; } = string.Empty;
    public string Intent { get; set; } = string.Empty;
    public string ResponseText { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;
}
