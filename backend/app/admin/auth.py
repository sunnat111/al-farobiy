"""Admin login: email + password checked against the `users` table; the session cookie remembers who is logged in."""

from sqladmin.authentication import AuthenticationBackend
from sqlalchemy import select
from starlette.requests import Request

from ..database import SessionLocal
from ..models import User
from ..security import verify_password


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        email = str(form.get("username", "")).strip().lower()
        password = str(form.get("password", ""))
        with SessionLocal() as db:
            user = db.scalar(select(User).where(User.email == email, User.is_active.is_(True)))
            if not user or not verify_password(password, user.password):
                return False
            request.session.update({"user_id": user.id, "role": user.role, "email": user.email})
        return True

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        return bool(request.session.get("user_id"))


def is_admin(request: Request) -> bool:
    return request.session.get("role") == "admin"
