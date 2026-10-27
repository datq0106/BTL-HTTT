"""Back up or restore the local Compose database and uploaded files.

Run from the repository root: python scripts/database.py backup backups/my-copy
or: python scripts/database.py restore backups/my-copy --database restore_verify
"""

import argparse
import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MYSQL = ["docker", "compose", "exec", "-T", "db", "sh", "-c"]
ROOT_CLIENT = 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" --default-character-set=utf8mb4'


def run(command, *, input_file=None, output_file=None):
    data = input_file.open("rb") if input_file else None
    output = output_file.open("wb") if output_file else subprocess.PIPE
    try:
        result = subprocess.run(command, cwd=ROOT, stdin=data, stdout=output,
                                stderr=subprocess.PIPE, check=False)
    finally:
        if data:
            data.close()
        if output_file:
            output.close()
    if result.returncode:
        if output_file:
            output_file.unlink(missing_ok=True)
        raise RuntimeError(result.stderr.decode("utf-8", errors="replace").strip())
    return result.stdout if not output_file else None


def backup(folder):
    if folder.exists() and any(folder.iterdir()):
        raise RuntimeError(f"Backup folder must be empty: {folder}")
    folder.mkdir(parents=True, exist_ok=True)
    run(MYSQL + ['exec mysqldump -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" '
                 '--single-transaction --routines --triggers --events '
                 '--default-character-set=utf8mb4 "$MYSQL_DATABASE"'],
        output_file=folder / "database.sql")
    run(["docker", "compose", "exec", "-T", "backend", "tar", "-C", "/app", "-cf", "-", "uploads"],
        output_file=folder / "uploads.tar")
    print(f"Saved database.sql and uploads.tar to {folder}")


def restore(folder, database, with_uploads):
    if not re.fullmatch(r"[A-Za-z][A-Za-z0-9_]*", database):
        raise RuntimeError("Database name may contain only letters, digits and underscore")
    sql = folder / "database.sql"
    if not sql.is_file() or sql.stat().st_size == 0:
        raise RuntimeError(f"Missing or empty backup: {sql}")
    archive = folder / "uploads.tar"
    if with_uploads and not archive.is_file():
        raise RuntimeError(f"Missing upload archive: {archive}")
    run(MYSQL + [f'{ROOT_CLIENT} -e "CREATE DATABASE IF NOT EXISTS {database} CHARACTER SET utf8mb4"'])
    count = run(MYSQL + [f'{ROOT_CLIENT} -N -e "SELECT COUNT(*) FROM information_schema.tables '
                         f'WHERE table_schema = \'{database}\'"']).decode().strip()
    if count != "0":
        raise RuntimeError(f"Refusing to restore into nonempty database {database} ({count} tables)")
    run(MYSQL + [f'exec {ROOT_CLIENT} {database}'], input_file=sql)
    if with_uploads:
        run(["docker", "compose", "exec", "-T", "backend", "tar", "-C", "/app", "-xf", "-"],
            input_file=archive)
    print(f"Restored database {database}" + (" and uploads" if with_uploads else ""))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["backup", "restore"])
    parser.add_argument("folder", type=Path)
    parser.add_argument("--database", default="quan_ly_nha_tro")
    parser.add_argument("--with-uploads", action="store_true")
    args = parser.parse_args()
    try:
        if args.action == "backup":
            backup(args.folder)
        else:
            restore(args.folder, args.database, args.with_uploads)
    except RuntimeError as error:
        parser.exit(1, f"Error: {error}\n")


if __name__ == "__main__":
    main()
