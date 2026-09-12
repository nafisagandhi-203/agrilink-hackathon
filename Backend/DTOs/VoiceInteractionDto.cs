using System;
using Models.Enums;

namespace DTOs;

public class VoiceInteractionDto
{
    public int VoiceInteractionId { get; set; }
    public int UserId { get; set; }
    public string Language { get; set; } = string.Empty;
    public string RecognizedText { get; set; } = string.Empty;
    public string Intent { get; set; } = string.Empty;
    public string ResponseText { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateVoiceInteractionDto
{
    public int UserId { get; set; }
    public string Language { get; set; } = string.Empty;
    public string RecognizedText { get; set; } = string.Empty;
    public string Intent { get; set; } = string.Empty;
    public string ResponseText { get; set; } = string.Empty;
}

public class UpdateVoiceInteractionDto
{
    public string Language { get; set; } = string.Empty;
    public string RecognizedText { get; set; } = string.Empty;
    public string Intent { get; set; } = string.Empty;
    public string ResponseText { get; set; } = string.Empty;
}
