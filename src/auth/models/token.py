import binascii
import os

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from auth.db import models


def generate_key():
    """Generate a completely random string"""
    return binascii.hexlify(os.urandom(20)).decode()


class Token(models.Model):
    """Model: Token"""

    __tablename__ = "auth_token"

    id = None
    key = Column(String(40), default=generate_key, primary_key=True)
    user_id = Column(Integer, ForeignKey("auth_user.id"), unique=True)
    created = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="token")

    def __repr__(self):
        return "<%s %r>" % (self.__class__.__name__, self.key)
