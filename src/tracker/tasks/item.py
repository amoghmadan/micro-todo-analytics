import asyncio
from datetime import datetime

from celery import shared_task
from sqlalchemy import update

from tracker.db import session
from tracker.models import ItemAudit


async def async_post_action(item: dict[str, int | str]) -> None:
    payload = {**item, "task_id": item["id"]}
    payload.pop("id")
    payload["created_at"] = datetime.fromisoformat(payload["created_at"])
    payload["updated_at"] = datetime.fromisoformat(payload["updated_at"])
    entry = ItemAudit(**payload)
    update_stetement = (
        update(ItemAudit)
        .values(is_deleted=entry.is_deleted)
        .where(ItemAudit.task_id == entry.task_id)
    )
    print(entry)
    async with session() as db:
        if entry.is_deleted:
            await db.execute(update_stetement)
        db.add(entry)
        await db.commit()


@shared_task(queue="task-service-queue", ignore_result=True)
def post_action(item: dict[str, int | str]) -> None:
    """Item: Post Action Task"""
    asyncio.run(async_post_action(item))
