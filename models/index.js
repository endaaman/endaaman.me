export class Article {
  constructor(obj) {
    Object.assign(this, obj)
  }
  getCategorySlug() {
    return this.parent || '-'
  }
  getRelative() {
    const { parent, slug  } = this
    return (parent || '-') + '/' + slug
  }
  getHref() {
    return '/' + this.getRelative()
  }
  copy() {
    return new Article(JSON.parse(JSON.stringify(this)))
  }
  getDigest() {
    if (this.digest) {
      return this.digest
    }
    const base = this.content.substring(0, 200)
    const tmp = base.replace(/#|`|:|-|\||\*|_/g, '')
    return tmp.substring(0, 140) + '...'
  }
  matchParent(parent) {
    if (parent === '-' && this.parent === null) {
      return true
    }
    return this.parent === parent
  }
}

export class Category {
  constructor(obj) {
    Object.assign(this, obj)
  }
  getValue() {
    return this.slug === '-' ? null : this.slug
  }
}
