using System;
using Models.Enums;

namespace DTOs;

public class CropDto
{
    public int CropId { get; set; }
    public string CropName { get; set; } = string.Empty;
    public string CommodityGroup { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class CreateCropDto
{
    public string CropName { get; set; } = string.Empty;
    public string CommodityGroup { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class UpdateCropDto
{
    public string CropName { get; set; } = string.Empty;
    public string CommodityGroup { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
