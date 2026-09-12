using System;
using Models.Enums;

namespace DTOs;

public class AdminDto
{
    public int AdminId { get; set; }
    public int UserId { get; set; }
    public string Department { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateAdminDto
{
    public int UserId { get; set; }
    public string Department { get; set; } = string.Empty;
}

public class UpdateAdminDto
{
    public string Department { get; set; } = string.Empty;
}
