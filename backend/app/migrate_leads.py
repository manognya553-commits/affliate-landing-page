"""
Applies migration 002_leads.sql to the database.
"""
import sys
from pathlib import Path
from sqlalchemy import text
from app.database import engine

def apply_leads_migration():
    migration_file = Path(__file__).resolve().parent.parent / "db" / "migrations" / "002_leads.sql"
    if not migration_file.exists():
        print(f"Error: {migration_file} does not exist.")
        sys.exit(1)

    sql_content = migration_file.read_text(encoding="utf-8")
    print(f"[Migration] Applying {migration_file.name} to database...")
    with engine.begin() as conn:
        conn.execute(text(sql_content))
    print("[Migration] 002_leads.sql applied successfully!")

if __name__ == "__main__":
    apply_leads_migration()
