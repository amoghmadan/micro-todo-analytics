from sqlalchemy import Boolean, Column, DateTime, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from auth.db import models
from auth.utils.security import check_password_hash, generate_password_hash


class User(models.Model):
    """Model: User"""

    __tablename__ = "auth_user"

    email = Column(String(255), unique=True)
    password = Column(String(255))
    first_name = Column(String(255))
    last_name = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    date_joined = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    token = relationship("Token", back_populates="user", uselist=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        stored_hash = check_password_hash(self.password, password)
        generated_hash = generate_password_hash(password)
        current_hash = check_password_hash(generated_hash, password)
        return stored_hash == current_hash

    def __repr__(self):
        return "<%s %r>" % (self.__class__.__name__, self.id)
