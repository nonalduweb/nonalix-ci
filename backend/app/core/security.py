"""
Sécurité des endpoints d'administration.

Les endpoints sensibles (analytics, configuration des agents IA, blog)
exigent le header `x-admin-secret` correspondant à la variable
d'environnement ADMIN_API_SECRET. Si la variable n'est pas définie,
l'accès est refusé (fail-closed) plutôt que laissé ouvert.
"""

import hmac
import os

from fastapi import Header, HTTPException

ADMIN_API_SECRET = os.environ.get("ADMIN_API_SECRET", "")


def require_admin_secret(x_admin_secret: str = Header(None, alias="x-admin-secret")) -> None:
    if not ADMIN_API_SECRET:
        raise HTTPException(
            status_code=503,
            detail="ADMIN_API_SECRET non configuré sur le serveur — accès refusé.",
        )
    if not x_admin_secret or not hmac.compare_digest(x_admin_secret, ADMIN_API_SECRET):
        raise HTTPException(status_code=401, detail="Non autorisé")
