# Database Setup & Configuration Guide (SQLite)

This document provides setup, migration, inspection, and troubleshooting instructions for the SQLite database configured for the **Farmer Market Linkage & Price Intelligence Platform** ASP.NET Core backend.

---

## 1. Database Provider & Configuration

- **Provider**: `Microsoft.EntityFrameworkCore.Sqlite`
- **EF Core Version**: `10.0.12`
- **Target Framework**: `.NET 10.0`
- **Database File**: `agrilink.db` (located in the `Backend/` directory)
- **Connection String**:
  ```json
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=agrilink.db"
  }
  ```
- **Configuration Files**:
  - `Backend/appsettings.json`
  - `Backend/appsettings.Development.json`

---

## 2. Existing Migrations Applied

The SQLite database uses the existing EF Core migration chain without modifying migration history or adding unnecessary migrations:

1. **`20260910134550_InitialCreate`**:
   Creates core schema: Users, Roles, Farmers, Buyers, Admins, Crops, CropListings, BuyerRequirements, MarketPrices, PricePredictions, DemandForecasts, SellingInsights, AbnormalPriceAlerts, BuyerRecommendations, Conversations, Messages, Offers, Transactions, TransactionReceipts, TransportProviders, TransportBookings, Notifications, VoiceInteractions, UserVerifications, and indices.
2. **`20260912052001_SeedRoles`**:
   Inserts baseline roles: Farmer (1), Buyer (2), Admin (3).
3. **`20260912143000_AddCropListingImageUrl`**:
   Adds `ImageUrl nvarchar(500) NULL` to `CropListings`.

---

## 3. SQL Server to SQLite Compatibility Layer

To allow existing migrations (which contained SQL Server-specific syntax such as `nvarchar(max)` and `type: "int"`) to run directly against SQLite without altering migration source files or generating new migrations, a custom migrations SQL generator is registered:

- **File**: `Backend/Data/CustomSqliteMigrationsSqlGenerator.cs`
- **Behavior**:
  - Automatically translates `nvarchar(max)` to `TEXT` in SQLite DDL statements to prevent `near "max": syntax error`.
  - Automatically maps `int`, `bigint`, `smallint`, and `tinyint` primary keys to `INTEGER` so SQLite activates autoincrement rowids without throwing `NOT NULL constraint failed`.
  - Suppresses cross-provider `PendingModelChangesWarning` when checking against the SQL Server snapshot.

---

## 4. Setup & Run Commands

### Prerequisites
- .NET 10 SDK (`dotnet --version` >= 10.0)
- EF Core CLI Tools (`dotnet ef`). If not installed:
  ```bash
  dotnet tool install --global dotnet-ef --version 10.0.10
  ```

### Build the Project
```bash
cd Backend
dotnet restore
dotnet build
```

### Apply Existing Migrations to SQLite
```bash
dotnet ef database update
```

### Run the Backend
```bash
# Run with default profile (port 5000 / 5018)
dotnet run --urls "http://localhost:5000"
```

---

## 5. Seeded Data on Startup

When the application starts, `DbSeeder.cs` runs automatically:
- **Roles**:
  - RoleId 1: `Farmer`
  - RoleId 2: `Buyer`
  - RoleId 3: `Admin`
- **Platform Administrator**:
  - **Email**: `admin@agrilink.local`
  - **Password**: `Admin@123`
  - **Role**: `Admin`

---

## 6. How to Inspect the Database

### Using Python (Built-in)
```bash
python3 -c "
import sqlite3
conn = sqlite3.connect('agrilink.db')
cur = conn.cursor()
print('Tables:')
for row in cur.execute(\"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name\"):
    print('-', row[0])
conn.close()
"
```

### Using the SQLite3 CLI Tool (if installed)
```bash
sqlite3 agrilink.db
.tables
.schema CropListings
SELECT * FROM Roles;
.exit
```

---

## 7. How to Reset the Database

If you need a fresh database for testing or local development:
```bash
# 1. Stop the running backend
# 2. Delete the SQLite database files
rm -f agrilink.db agrilink.db-shm agrilink.db-wal

# 3. Re-run migrations
dotnet ef database update

# 4. Start the backend (roles and admin are re-seeded automatically)
dotnet run --urls "http://localhost:5000"
```

---

## 8. Important SQLite Considerations & Limitations

1. **Transactions & Concurrency**:
   SQLite is a file-based database that locks the database during write transactions. EF Core automatically sets `PRAGMA journal_mode = 'wal'` (Write-Ahead Logging), allowing concurrent reads during writes.
2. **Schema Alterations**:
   SQLite has limited support for `ALTER TABLE` operations (e.g. dropping columns or altering constraints in older SQLite versions). EF Core handles this during migrations by table rebuilding when needed.
3. **Case Sensitivity**:
   SQLite `LIKE` is case-insensitive for ASCII characters, but text comparisons with `=` are case-sensitive.
4. **Data Types**:
   SQLite uses dynamic type affinity (`NULL`, `INTEGER`, `REAL`, `TEXT`, `BLOB`). Decimals and dates are stored with text/numeric representations, while EF Core provides full strongly-typed conversions in the application layer.
