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
    
    dto_content = "using System;\nusing Models.Enums;\n\nnamespace DTOs;\n\n"
    
    # Dto
    dto_content += f"public class {model}Dto\n{{\n"
    for p_type, p_name in props:
        if p_type == "string":
            dto_content += f"    public string {p_name} {{ get; set; }} = string.Empty;\n"
        else:
            dto_content += f"    public {p_type} {p_name} {{ get; set; }}\n"
    dto_content += "}\n\n"
    
    # CreateDto
    dto_content += f"public class Create{model}Dto\n{{\n"
    for p_type, p_name in props:
        if p_name in [f"{model}Id", "CreatedAt", "UpdatedAt", "GeneratedAt", "SentAt"]:
            continue
        if p_type == "string":
            dto_content += f"    public string {p_name} {{ get; set; }} = string.Empty;\n"
        else:
            dto_content += f"    public {p_type} {p_name} {{ get; set; }}\n"
    dto_content += "}\n\n"
    
    # UpdateDto
    dto_content += f"public class Update{model}Dto\n{{\n"
    for p_type, p_name in props:
        if p_name in [f"{model}Id", "CreatedAt", "UpdatedAt", "GeneratedAt", "SentAt", "UserId", "FarmerId", "BuyerId", "AdminId", "ConversationId", "CropListingId", "TransactionId", "SenderUserId"]:
            continue
        if p_type == "string":
            dto_content += f"    public string {p_name} {{ get; set; }} = string.Empty;\n"
        else:
            dto_content += f"    public {p_type} {p_name} {{ get; set; }}\n"
    dto_content += "}\n"
    
    with open(f"DTOs/{model}Dto.cs", 'w', encoding='utf-8') as f:
        f.write(dto_content)

print("Generated DTOs")
