using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using Microsoft.EntityFrameworkCore.Sqlite.Migrations.Internal;

namespace Data;

#pragma warning disable EF1001 // Internal EF Core API usage.
public class CustomSqliteMigrationsSqlGenerator : SqliteMigrationsSqlGenerator
{
    public CustomSqliteMigrationsSqlGenerator(
        MigrationsSqlGeneratorDependencies dependencies,
        IRelationalAnnotationProvider annotations)
        : base(dependencies, annotations)
    {
    }

    protected override void ColumnDefinition(
        string? schema,
        string table,
        string name,
        ColumnOperation operation,
        IModel? model,
        MigrationCommandListBuilder builder)
    {
        if (operation.ColumnType != null)
        {
            if (operation.ColumnType.Contains("nvarchar(max)", StringComparison.OrdinalIgnoreCase))
            {
                operation.ColumnType = "TEXT";
            }
            else if (string.Equals(operation.ColumnType, "int", StringComparison.OrdinalIgnoreCase) ||
                     string.Equals(operation.ColumnType, "bigint", StringComparison.OrdinalIgnoreCase) ||
                     string.Equals(operation.ColumnType, "smallint", StringComparison.OrdinalIgnoreCase) ||
                     string.Equals(operation.ColumnType, "tinyint", StringComparison.OrdinalIgnoreCase))
            {
                operation.ColumnType = "INTEGER";
            }
        }
        base.ColumnDefinition(schema, table, name, operation, model, builder);
    }
}
#pragma warning restore EF1001
