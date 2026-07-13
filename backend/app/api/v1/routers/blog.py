import hmac
import uuid
import json
import os
import httpx
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import BlogPost
from app.schemas.blog import BlogPostCreate, BlogPostResponse, ImageUploadRequest

router = APIRouter(prefix="/blog", tags=["blog"])

# Pas de valeur par défaut : si BLOG_SECRET_KEY n'est pas défini,
# les écritures sont refusées (fail-closed).
BLOG_SECRET = os.environ.get("BLOG_SECRET_KEY", "")
STATIC_DIR = "/app/static/blog"


def _check_blog_secret(provided: str | None) -> None:
    if not BLOG_SECRET:
        raise HTTPException(
            status_code=503,
            detail="BLOG_SECRET_KEY non configuré sur le serveur — accès refusé.",
        )
    if not provided or not hmac.compare_digest(provided, BLOG_SECRET):
        raise HTTPException(status_code=401, detail="Non autorisé")


def _ensure_static_dir():
    os.makedirs(STATIC_DIR, exist_ok=True)


@router.get("", response_model=list[BlogPostResponse])
def list_blog_posts(db: Session = Depends(get_db)):
    return (
        db.query(BlogPost)
        .filter(BlogPost.published == True)
        .order_by(BlogPost.publishedAt.desc())
        .all()
    )


@router.get("/{slug}", response_model=BlogPostResponse)
def get_blog_post(slug: str, db: Session = Depends(get_db)):
    post = (
        db.query(BlogPost)
        .filter(BlogPost.slug == slug, BlogPost.published == True)
        .first()
    )
    if not post:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return post


@router.post("", response_model=BlogPostResponse, status_code=201)
def create_blog_post(
    post_data: BlogPostCreate,
    x_blog_secret: str = Header(None, alias="x-blog-secret"),
    db: Session = Depends(get_db),
):
    _check_blog_secret(x_blog_secret)

    existing = db.query(BlogPost).filter(BlogPost.slug == post_data.slug).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail=f"Article avec slug '{post_data.slug}' existe déjà",
        )

    now = datetime.utcnow()
    post = BlogPost(
        id=str(uuid.uuid4()),
        slug=post_data.slug,
        title=post_data.title,
        description=post_data.description,
        contentHtml=post_data.contentHtml,
        category=post_data.category,
        categoryLabel=post_data.categoryLabel,
        tags=json.dumps(post_data.tags or [], ensure_ascii=False),
        image=post_data.image,
        author=post_data.author or "Équipe NONALIX CI",
        readingTime=post_data.readingTime or 7,
        featured=post_data.featured or False,
        published=True,
        keywords=json.dumps(post_data.keywords or [], ensure_ascii=False),
        metaOgTitle=post_data.metaOgTitle,
        metaOgDescription=post_data.metaOgDescription,
        publishedAt=now,
        createdAt=now,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{slug}", status_code=204)
def delete_blog_post(
    slug: str,
    x_blog_secret: str = Header(None, alias="x-blog-secret"),
    db: Session = Depends(get_db),
):
    _check_blog_secret(x_blog_secret)
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    db.delete(post)
    db.commit()


@router.post("/image-upload")
async def upload_image(
    body: ImageUploadRequest,
    x_blog_secret: str = Header(None, alias="x-blog-secret"),
):
    """Download an image from a URL and save it to /static/blog/. Returns the public path."""
    _check_blog_secret(x_blog_secret)

    _ensure_static_dir()
    filename = f"{body.slug}.jpg"
    filepath = os.path.join(STATIC_DIR, filename)

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(body.url)
            response.raise_for_status()
        with open(filepath, "wb") as f:
            f.write(response.content)
        return {"image_path": f"/static/blog/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Échec téléchargement image: {str(e)}")
