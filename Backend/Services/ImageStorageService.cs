using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Services
{
    public class ImageStorageService : IImageStorageService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<ImageStorageService> _logger;

        private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private static readonly string[] AllowedMimeTypes = { "image/jpeg", "image/png", "image/webp" };

        public ImageStorageService(IWebHostEnvironment environment, ILogger<ImageStorageService> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        public bool ValidateImage(IFormFile file, out string errorMessage)
        {
            errorMessage = string.Empty;

            if (file == null || file.Length == 0)
            {
                errorMessage = "No file was provided.";
                return false;
            }

            if (file.Length > MaxFileSizeBytes)
            {
                errorMessage = $"File size exceeds maximum allowed limit of {MaxFileSizeBytes / (1024 * 1024)} MB.";
                return false;
            }

            var extension = Path.GetExtension(file.FileName)?.ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !AllowedExtensions.Contains(extension))
            {
                errorMessage = $"Unsupported file extension '{extension}'. Allowed extensions are: {string.Join(", ", AllowedExtensions)}.";
                return false;
            }

            var contentType = file.ContentType?.ToLowerInvariant();
            if (string.IsNullOrEmpty(contentType) || !AllowedMimeTypes.Contains(contentType))
            {
                errorMessage = $"Unsupported content type '{contentType}'. Allowed types are image/jpeg, image/png, image/webp.";
                return false;
            }

            // Verify file header / magic bytes to prevent renamed malicious files
            try
            {
                using var stream = file.OpenReadStream();
                var header = new byte[12];
                int bytesRead = stream.Read(header, 0, header.Length);

                if (bytesRead < 4)
                {
                    errorMessage = "Corrupted or unreadable image file.";
                    return false;
                }

                // JPEG: FF D8 FF
                bool isJpeg = header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF;

                // PNG: 89 50 4E 47
                bool isPng = header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47;

                // WEBP: RIFF....WEBP (52 49 46 46 .... 57 45 42 50)
                bool isWebp = bytesRead >= 12 &&
                              header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46 &&
                              header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50;

                if (!isJpeg && !isPng && !isWebp)
                {
                    errorMessage = "File signature does not match a valid JPEG, PNG, or WebP image.";
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error reading image stream for validation");
                errorMessage = "Unable to process uploaded file stream.";
                return false;
            }

            return true;
        }

        public async Task<(bool Success, string? ImageUrl, string? Error)> SaveCropImageAsync(IFormFile file)
        {
            if (!ValidateImage(file, out var validationError))
            {
                return (false, null, validationError);
            }

            try
            {
                var extension = Path.GetExtension(file.FileName)?.ToLowerInvariant();
                var safeFileName = $"{Guid.NewGuid():N}{extension}";

                var webRoot = _environment.WebRootPath;
                if (string.IsNullOrWhiteSpace(webRoot))
                {
                    webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }

                var targetDir = Path.Combine(webRoot, "uploads", "crops");
                if (!Directory.Exists(targetDir))
                {
                    Directory.CreateDirectory(targetDir);
                }

                var fullFilePath = Path.Combine(targetDir, safeFileName);

                using (var stream = new FileStream(fullFilePath, FileMode.Create, FileAccess.Write, FileShare.None))
                {
                    await file.CopyToAsync(stream);
                }

                var relativeUrl = $"/uploads/crops/{safeFileName}";
                _logger.LogInformation("Saved crop image successfully: {RelativeUrl}", relativeUrl);

                return (true, relativeUrl, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to save crop image file");
                return (false, null, "Internal server error occurred while storing the image.");
            }
        }

        public bool DeleteImage(string? imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
            {
                return false;
            }

            try
            {
                // Ensure the path is strictly within /uploads/crops/
                if (!imageUrl.StartsWith("/uploads/crops/", StringComparison.OrdinalIgnoreCase))
                {
                    return false;
                }

                var fileName = Path.GetFileName(imageUrl);
                if (string.IsNullOrWhiteSpace(fileName))
                {
                    return false;
                }

                var webRoot = _environment.WebRootPath;
                if (string.IsNullOrWhiteSpace(webRoot))
                {
                    webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }

                var filePath = Path.Combine(webRoot, "uploads", "crops", fileName);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    _logger.LogInformation("Deleted crop image from disk: {FilePath}", filePath);
                    return true;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete image at {ImageUrl}", imageUrl);
            }

            return false;
        }
    }
}
