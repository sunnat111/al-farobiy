"""Password hashing with Python's standard library (PBKDF2-SHA256, salted)."""

import hashlib
import hmac
import secrets

ITERATIONS = 390_000
PREFIX = "pbkdf2_sha256"


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), ITERATIONS).hex()
    return f"{PREFIX}${ITERATIONS}${salt}${digest}"


def is_hashed(value: str | None) -> bool:
    return bool(value) and value.startswith(PREFIX + "$")


def verify_password(password: str, stored: str) -> bool:
    try:
        _, iterations, salt, digest = stored.split("$")
    except ValueError:
        return False
    check = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), int(iterations)).hex()
    return hmac.compare_digest(check, digest)
