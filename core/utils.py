import os
import logging

LOGGER = logging.getLogger(__name__)


def get_master_key():
    master_key = os.environ.get("MASTER_KEY")

    if master_key is not None:
        return master_key

    LOGGER.error("Master key couldn't be found found.")
