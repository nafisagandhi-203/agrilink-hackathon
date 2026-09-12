import os
import re

existing_controllers = [
    'BuyerRequirementsController.cs',
    'CropListingsController.cs',
    'MarketPricesController.cs',
    'OffersController.cs',
    'TransactionsController.cs',
    'UsersController.cs'
]

for ctrl in existing_controllers:
    path = os.path.join('Controllers', ctrl)
    if not os.path.exists(path):
        continue
        
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Get method
    content = re.sub(r'public async Task<ActionResult<IEnumerable<([^>]+)>>> Get([A-Za-z]+)\(\)', 
                     r'public async Task<ActionResult<ApiResponse<IEnumerable<\1>>>> Get\2()', content)
    
    content = re.sub(r'return Ok\((entities\.Select[^\)]+\)\)\);',
                     r'return Ok(ApiResponse<IEnumerable<UserDto>>.SuccessResponse(\1.ToList(), "\2 retrieved successfully"));', content)

    # We need a more robust parser. Instead of regex magic, maybe I can just manually fix them or use simple string replace where possible, or replace entire functions.

