from tracker.repositories import HealthRepository


class HealthProcessor:
    def __init__(self):
        self.repository = HealthRepository()

    async def ping(self) -> str:
        """
        Check the health via DB.
        :return: str
        """
        return await self.repository.get_ping_text()
