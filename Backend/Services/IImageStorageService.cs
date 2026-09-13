using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Services
{
    public interface IImageStorageService
    {
        Task<(bool Success, string? ImageUrl, string? Error)> SaveCropImageAsync(IFormFile file);
        bool DeleteImage(string? imageUrl);
        bool ValidateImage(IFormFile file, out string errorMessage);
    }
}
