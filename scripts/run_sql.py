"""Corre un archivo .sql contra la base de datos de Supabase del consultorio.

Uso: python scripts/run_sql.py supabase/schema.sql
Lee DATABASE_URL de .env.admin.local (no se sube a git).
"""

import asyncio
import sys
from pathlib import Path

import asyncpg

RAIZ = Path(__file__).resolve().parent.parent


def leer_database_url() -> str:
    env_path = RAIZ / ".env.admin.local"
    for linea in env_path.read_text(encoding="utf-8").splitlines():
        if linea.startswith("DATABASE_URL="):
            return linea.split("=", 1)[1].strip()
    raise RuntimeError("DATABASE_URL no encontrada en .env.admin.local")


async def main(ruta_sql: str) -> None:
    sql = (RAIZ / ruta_sql).read_text(encoding="utf-8")
    conn = await asyncpg.connect(leer_database_url(), statement_cache_size=0)
    try:
        await conn.execute(sql)
        print(f"OK: se corrio {ruta_sql}")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1]))
