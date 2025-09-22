from config import PROTECTED_LOGINS_ID

def is_protected_login(user_id) -> bool:
    return str(user_id) in PROTECTED_LOGINS_ID

