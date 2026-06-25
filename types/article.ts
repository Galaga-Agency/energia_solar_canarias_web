// Categories are managed in Payload — category slug is an open string.
export type ArticleCategory = string

export interface CategoryInfo {
  id:           number | string
  slug:         string
  label:        string
  description?: string
  tagline?:     string
  iconUrl?:     string
  order?:       number
}

export interface ArticleTag {
  name: string
  slug: string
}

export interface Article {
  id:             string
  slug:           string
  title:          string
  excerpt:        string
  image:          string
  imageCaption?:  string
  imagePosition?: string
  category:       ArticleCategory
  categoryLabel?: string
  readTime:       number
  author:         string
  publishedAt:    string
  updatedLabel?:  string
  likes:          number
  tags?:          ArticleTag[]
}
