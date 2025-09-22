import os

PROTECTED_LOGINS_ID = os.getenv("PROTECTED_LOGINS_ID", "").split(",")
PROTECTED_LOGINS_ID = [id_.strip() for id_ in PROTECTED_LOGINS_ID if id_.strip()]