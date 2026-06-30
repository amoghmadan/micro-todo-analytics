from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    DateTime,
    SmallInteger,
    String,
    Text,
    func,
)

from tracker.db import models


class ItemAudit(models.Model):
    """Model: Item Audit"""

    __tablename__ = "tracker_item_audit"

    task_id = Column(String(255), index=True)
    user_id = Column(BigInteger, index=True)
    description = Column(Text)
    status = Column(SmallInteger)
    is_deleted = Column(Boolean)
    created_at = Column(DateTime(timezone=True), index=True)
    updated_at = Column(DateTime(timezone=True), index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
