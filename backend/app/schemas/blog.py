from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class BlogPostCreate(BaseModel):
    slug: str
    title: str
    description: Optional[str] = None
    contentHtml: str
    category: str
    categoryLabel: Optional[str] = None
    tags: Optional[List[str]] = []
    image: Optional[str] = None
    author: Optional[str] = "Équipe NONALIX CI"
    readingTime: Optional[int] = 7
    featured: Optional[bool] = False
    keywords: Optional[List[str]] = []
    metaOgTitle: Optional[str] = None
    metaOgDescription: Optional[str] = None


class ImageUploadRequest(BaseModel):
    url: str
    slug: str


class BlogPostResponse(BaseModel):
    id: str
    slug: str
    title: str
    description: Optional[str]
    contentHtml: str
    category: str
    categoryLabel: Optional[str]
    tags: Optional[str]
    image: Optional[str]
    author: str
    readingTime: int
    featured: bool
    published: bool
    keywords: Optional[str]
    metaOgTitle: Optional[str]
    metaOgDescription: Optional[str]
    publishedAt: Optional[datetime]
    createdAt: datetime

    class Config:
        from_attributes = True
