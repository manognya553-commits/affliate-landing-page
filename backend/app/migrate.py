import os
import glob
from sqlalchemy import text
from app.database import engine

MIGRATIONS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "db", "migrations")


def run_migrations():
    print("[sBLOOM Migrate] Checking database migrations...")

    with engine.begin() as conn:
        # 1. Create migrations tracking table if not exists
        conn.execute(text("""
            CREATE SCHEMA IF NOT EXISTS app;
            CREATE TABLE IF NOT EXISTS app.schema_migrations (
                filename text PRIMARY KEY,
                applied_at timestamptz NOT NULL DEFAULT now()
            );
        """))

        # 2. Record 001_core.sql as already applied without executing it
        conn.execute(text("""
            INSERT INTO app.schema_migrations (filename)
            VALUES ('001_core.sql')
            ON CONFLICT (filename) DO NOTHING;
        """))

        # 3. Query already applied migrations
        result = conn.execute(text("SELECT filename FROM app.schema_migrations;"))
        applied_files = {row[0] for row in result.fetchall()}

        # 4. Find all migration files in order
        migration_files = sorted(glob.glob(os.path.join(MIGRATIONS_DIR, "*.sql")))
        pending_count = 0

        for filepath in migration_files:
            filename = os.path.basename(filepath)
            if filename in applied_files:
                continue

            print(f"[sBLOOM Migrate] Applying pending migration: {filename}...")
            with open(filepath, "r", encoding="utf-8") as f:
                sql_content = f.read()

            # Ensure every future migration executes lock_down_tables()
            if "app.lock_down_tables()" not in sql_content:
                sql_content += "\nSELECT app.lock_down_tables();\n"

            conn.execute(text(sql_content))
            conn.execute(text("INSERT INTO app.schema_migrations (filename) VALUES (:fname);"), {"fname": filename})
            print(f"[sBLOOM Migrate] Successfully applied: {filename}")
            pending_count += 1

        if pending_count == 0:
            print("[sBLOOM Migrate] All migrations are already up to date (001_core.sql recorded).")
        else:
            print(f"[sBLOOM Migrate] Successfully completed {pending_count} new migration(s).")


if __name__ == "__main__":
    run_migrations()
