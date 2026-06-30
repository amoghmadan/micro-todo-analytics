import os

from celery import Celery

# set the default Django settings module for the 'celery' program.
os.environ.setdefault("GRPC_SETTINGS_MODULE", "tracker.settings")

app = Celery("tracker")

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='celery' means all celery-related configuration keys
#   should have a `celery_` prefix.
app.config_from_object("tracker.conf:settings", namespace="celery")

# Load task modules from all registered Django app configs.
app.autodiscover_tasks(["tracker"])
