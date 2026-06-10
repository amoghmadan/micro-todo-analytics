import importlib
import os
from types import ModuleType
from typing import Any

from auth.conf import global_settings

ENVIRONMENT_VARIABLE = "GRPC_SETTINGS_MODULE"


def settings_from_module(module: str) -> type:
    """
    Generate settings class with default values to start the project.
    :param module: str, reference to module
    :return: ModelMetaclass
    """
    fields: dict[str, tuple[Any, Any]] = {}
    for attr in dir(global_settings):
        if attr.isupper():
            value: Any = getattr(global_settings, attr)
            fields[attr] = (type(value), value)

    mod: ModuleType = importlib.import_module(module)
    for attr in dir(mod):
        if attr.isupper():
            fields[attr] = getattr(mod, attr)
        if attr.islower() and attr.startswith("celery_"):  # Extra
            fields[attr.lower()] = getattr(mod, attr)

    return type("Settings", (object,), fields)


GRPC_SETTINGS_MODULE: str | None = os.environ.get(ENVIRONMENT_VARIABLE)
Settings: type = settings_from_module(GRPC_SETTINGS_MODULE)  # type: ignore[arg-type]
settings: Settings = Settings()  # type: ignore[valid-type]

__all__ = ["settings"]
