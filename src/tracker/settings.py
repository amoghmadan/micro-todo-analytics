import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).parent.parent
LOG_DIR = BASE_DIR.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DEBUG") == "True"

# Database settings
DATABASES = {
    "default": {
        "url": os.environ.get("DEFAULT_DATABASE"),
    }
}

# Internationalization
TIME_ZONE = "UTC"
USE_TZ = True


# Logging config
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s"  # noqa: E501
        },
    },
    "handlers": {
        "file": {
            "level": "DEBUG",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": LOG_DIR / "debug.log",
            "formatter": "verbose",
            "backupCount": 5,
            "maxBytes": 1024 * 1024 * 15,
        },
        "console": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "loggers": {
        "": {  # root logger
            "handlers": ["file", "console"],
            "level": "DEBUG",
            "propagate": True,
        },
    },
}


# Celery settings
celery_task_default_queue = "tracker-service-queue"
celery_broker_url = os.environ.get("CELERY_BROKER_URL")
celery_result_backend = None
celery_task_ignore_result = True
celery_timezone = TIME_ZONE


# Services
SERVICES = {
    "grpc": {
        "auth": os.environ.get("GRPC_AUTH_HOST"),
    }
}
