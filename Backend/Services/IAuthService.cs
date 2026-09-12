using System.Threading.Tasks;
using DTOs;
using DTOs.Auth;

namespace Services;

public interface IAuthService
{
    Task<ApiResponse<int>> RegisterAsync(RegisterRequestDTO request);
    Task<ApiResponse<LoginResponseDTO>> LoginAsync(LoginRequestDTO request);
}
