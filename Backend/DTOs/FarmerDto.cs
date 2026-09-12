using System;
using Models.Enums;

namespace DTOs;

public class FarmerDto
{
    public int FarmerId { get; set; }
    public int UserId { get; set; }
    public string FarmName { get; set; } = string.Empty;
    public string FarmLocation { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public decimal FarmSize { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateFarmerDto
{
    public int UserId { get; set; }
    public string FarmName { get; set; } = string.Empty;
    public string FarmLocation { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public decimal FarmSize { get; set; }
}

public class UpdateFarmerDto
{
    public string FarmName { get; set; } = string.Empty;
    public string FarmLocation { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public decimal FarmSize { get; set; }
}
