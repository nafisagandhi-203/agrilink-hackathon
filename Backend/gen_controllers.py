import os
import re

models = [
    'Role', 'Farmer', 'Buyer', 'Admin', 'Crop', 'Conversation',
    'Message', 'TransactionReceipt', 'Notification', 'UserVerification', 'VoiceInteraction'
]

for model in models:
    model_file = f"Models/{model}.cs"
    if not os.path.exists(model_file):
        continue
    with open(model_file, 'r', encoding='utf-8') as f:
        content = f.read()

    props = re.findall(r'public\s+([^\s]+)\s+([^\s]+)\s*{\s*get;\s*set;\s*}(?:\s*=\s*[^;]+;)?', content)
    props = [p for p in props if not p[0].startswith('ICollection') and p[1] not in ['User', 'Farmer', 'Buyer', 'CropListing', 'Transaction', 'Conversation', 'VerifiedByUser', 'SenderUser']]
    
    plural = model + "s"
    if model == 'TransactionReceipt':
        plural = 'TransactionReceipts'
        
    ctrl_content = f"""using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data;
using Models;
using DTOs;
using System.Linq;

namespace Controllers;

[Route("api/[controller]")]
[ApiController]
public class {plural}Controller : ControllerBase
{{
    private readonly ApplicationDbContext _context;

    public {plural}Controller(ApplicationDbContext context)
    {{
        _context = context;
    }}

    // GET: api/{plural}
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<{model}Dto>>>> Get{plural}()
    {{
        var entities = await _context.{plural}.ToListAsync();
            
        var dtos = entities.Select(e => new {model}Dto
        {{
"""
    for p_type, p_name in props:
        ctrl_content += f"            {p_name} = e.{p_name},\n"
        
    ctrl_content += f"""        }});

        return Ok(ApiResponse<IEnumerable<{model}Dto>>.SuccessResponse(dtos, "{model} retrieved successfully"));
    }}

    // GET: api/{plural}/5
    [HttpGet("{{id}}")]
    public async Task<ActionResult<ApiResponse<{model}Dto>>> Get{model}(int id)
    {{
        var entity = await _context.{plural}.FindAsync(id);

        if (entity == null) 
            return NotFound(ApiResponse<{model}Dto>.ErrorResponse("{model} not found"));

        var dto = new {model}Dto
        {{
"""
    for p_type, p_name in props:
        ctrl_content += f"            {p_name} = entity.{p_name},\n"
        
    ctrl_content += f"""        }};

        return Ok(ApiResponse<{model}Dto>.SuccessResponse(dto, "{model} retrieved successfully"));
    }}

    // POST: api/{plural}
    [HttpPost]
    public async Task<ActionResult<ApiResponse<{model}Dto>>> Post{model}(Create{model}Dto createDto)
    {{
        var entity = new {model}
        {{
"""
    for p_type, p_name in props:
        if p_name in [f"{model}Id", "CreatedAt", "UpdatedAt", "GeneratedAt", "SentAt"]:
            continue
        ctrl_content += f"            {p_name} = createDto.{p_name},\n"
        
    # set timestamps if applicable
    if any(p[1] == "CreatedAt" for p in props):
        ctrl_content += "            CreatedAt = System.DateTime.UtcNow,\n"
    if any(p[1] == "GeneratedAt" for p in props):
        ctrl_content += "            GeneratedAt = System.DateTime.UtcNow,\n"
    if any(p[1] == "SentAt" for p in props):
        ctrl_content += "            SentAt = System.DateTime.UtcNow,\n"
        
    ctrl_content += f"""        }};
        
        _context.{plural}.Add(entity);
        await _context.SaveChangesAsync();

        var returnDto = new {model}Dto
        {{
"""
    for p_type, p_name in props:
        ctrl_content += f"            {p_name} = entity.{p_name},\n"
        
    ctrl_content += f"""        }};
        
        return CreatedAtAction(nameof(Get{model}), new {{ id = entity.{model}Id }}, ApiResponse<{model}Dto>.SuccessResponse(returnDto, "{model} created successfully"));
    }}

    // PUT: api/{plural}/5
    [HttpPut("{{id}}")]
    public async Task<ActionResult<ApiResponse<object>>> Put{model}(int id, Update{model}Dto updateDto)
    {{
        var entity = await _context.{plural}.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("{model} not found"));

"""
    for p_type, p_name in props:
        if p_name in [f"{model}Id", "CreatedAt", "UpdatedAt", "GeneratedAt", "SentAt", "UserId", "FarmerId", "BuyerId", "AdminId", "ConversationId", "CropListingId", "TransactionId", "SenderUserId"]:
            continue
        ctrl_content += f"        entity.{p_name} = updateDto.{p_name};\n"

    if any(p[1] == "UpdatedAt" for p in props):
        ctrl_content += "        entity.UpdatedAt = System.DateTime.UtcNow;\n"
        
    ctrl_content += f"""        
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "{model} updated successfully"));
    }}

    // DELETE: api/{plural}/5
    [HttpDelete("{{id}}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete{model}(int id)
    {{
        var entity = await _context.{plural}.FindAsync(id);
        if (entity == null) 
            return NotFound(ApiResponse<object>.ErrorResponse("{model} not found"));

        _context.{plural}.Remove(entity);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<object>.SuccessResponse(null, "{model} deleted successfully"));
    }}
}}
"""
    with open(f"Controllers/{plural}Controller.cs", 'w', encoding='utf-8') as f:
        f.write(ctrl_content)

print("Generated Controllers")
