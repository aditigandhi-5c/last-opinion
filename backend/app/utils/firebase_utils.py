"""
Firebase utility functions for user management.

Provides helper functions for Firebase operations using Firebase Admin SDK.
"""

import logging
import os
from typing import Optional

logger = logging.getLogger(__name__)


def update_firebase_password(email: str, new_password: str):
    """
    Update a user's password in Firebase Auth.
    
    Args:
        email (str): User's email address
        new_password (str): New password to set
        
    Note:
        - Silently skips if user does not exist in Firebase
        - Silently skips if Firebase is not available
    """
    try:
        # Placeholder: use Firebase Admin SDK here
        print(f"Updating Firebase password for {email}")
        # Example: auth.update_user(uid, password=new_password)
    except Exception:
        pass  # silently skip if user does not exist


def get_firebase_user_by_email(email: str) -> Optional[dict]:
    """
    Get Firebase user information by email.
    
    Args:
        email (str): User's email address
        
    Returns:
        dict: User record if found, None otherwise
    """
    try:
        if not os.getenv("FIREBASE_ENABLED"):
            return None
            
        import firebase_admin
        from firebase_admin import auth as fb_auth
        
        if not firebase_admin._apps:
            firebase_admin.initialize_app()
            
        user_record = fb_auth.get_user_by_email(email)
        return {
            "uid": user_record.uid,
            "email": user_record.email,
            "email_verified": user_record.email_verified,
            "disabled": user_record.disabled,
            "created_at": user_record.user_metadata.creation_timestamp,
            "last_sign_in": user_record.user_metadata.last_sign_in_timestamp
        }
        
    except fb_auth.UserNotFoundError:
        return None
        
    except Exception as e:
        logger.error(f"Error getting Firebase user {email}: {str(e)}")
        return None


def create_firebase_user(email: str, password: str) -> Optional[str]:
    """
    Create a new user in Firebase Auth.
    
    Args:
        email (str): User's email address
        password (str): User's password
        
    Returns:
        str: Firebase UID if created successfully, None otherwise
    """
    try:
        if not os.getenv("FIREBASE_ENABLED"):
            return None
            
        import firebase_admin
        from firebase_admin import auth as fb_auth
        
        if not firebase_admin._apps:
            firebase_admin.initialize_app()
            
        user_record = fb_auth.create_user(
            email=email,
            password=password,
            email_verified=False
        )
        
        logger.info(f"Firebase user created successfully: {email}")
        return user_record.uid
        
    except fb_auth.EmailAlreadyExistsError:
        logger.warning(f"Firebase user {email} already exists")
        return None
        
    except Exception as e:
        logger.error(f"Error creating Firebase user {email}: {str(e)}")
        return None


def delete_firebase_user(firebase_uid: str) -> bool:
    """
    Delete a user from Firebase Auth.
    
    Args:
        firebase_uid (str): Firebase user UID
        
    Returns:
        bool: True if deleted successfully, False otherwise
    """
    try:
        if not os.getenv("FIREBASE_ENABLED"):
            return True
            
        import firebase_admin
        from firebase_admin import auth as fb_auth
        
        if not firebase_admin._apps:
            firebase_admin.initialize_app()
            
        fb_auth.delete_user(firebase_uid)
        logger.info(f"Firebase user deleted successfully: {firebase_uid}")
        return True
        
    except fb_auth.UserNotFoundError:
        logger.warning(f"Firebase user {firebase_uid} not found for deletion")
        return True  # Consider this success since user is already gone
        
    except Exception as e:
        logger.error(f"Error deleting Firebase user {firebase_uid}: {str(e)}")
        return False


def verify_firebase_token(id_token: str) -> Optional[dict]:
    """
    Verify a Firebase ID token and return decoded claims.
    
    Args:
        id_token (str): Firebase ID token
        
    Returns:
        dict: Decoded token claims if valid, None otherwise
    """
    try:
        if not os.getenv("FIREBASE_ENABLED"):
            return None
            
        import firebase_admin
        from firebase_admin import auth as fb_auth
        
        if not firebase_admin._apps:
            firebase_admin.initialize_app()
            
        decoded_token = fb_auth.verify_id_token(id_token)
        return decoded_token
        
    except Exception as e:
        logger.error(f"Error verifying Firebase token: {str(e)}")
        return None
