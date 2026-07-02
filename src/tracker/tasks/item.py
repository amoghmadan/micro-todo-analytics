from datetime import datetime

from celery import shared_task
from sqlalchemy import create_engine, select, update
from sqlalchemy.orm import sessionmaker

from tracker.conf import settings
from tracker.models import ItemAudit

engine = create_engine(settings.DATABASES["sync"]["url"], pool_pre_ping=True)
Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)


@shared_task(queue="task-service-queue", ignore_result=True)
def post_action(item: dict[str, int | str]) -> None:
    """Item: Post Action Task"""
    payload = {**item, "task_id": item["id"]}
    payload["created_at"] = datetime.fromisoformat(payload["created_at"])
    payload["updated_at"] = datetime.fromisoformat(payload["updated_at"])
    task_id = payload.pop("id")
    fetch_latest_item_audit_stmt = (
        select(ItemAudit)
        .where(ItemAudit.task_id == task_id)
        .order_by(ItemAudit.id.desc())
        .limit(1)
    )
    update_stmt = (
        update(ItemAudit)
        .values(is_deleted=payload["is_deleted"])
        .where(ItemAudit.task_id == task_id)
    )
    new_entry: ItemAudit = ItemAudit(**payload)
    with Session() as db:
        result = db.execute(fetch_latest_item_audit_stmt)
        existing_entry: ItemAudit | None = result.scalar_one_or_none()
        if new_entry.is_deleted:
            db.execute(update_stmt)
            db.add(new_entry)
        elif existing_entry and existing_entry.status == new_entry.status:
            existing_entry.description = new_entry.description
            existing_entry.updated_at = new_entry.updated_at
        else:
            db.add(new_entry)
        db.commit()
