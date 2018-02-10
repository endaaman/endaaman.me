export class Article {
  constructor(obj) {
    Object.assign(this, obj)
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
  matchParent(parent) {
    if (parent === '-' && this.parent === null) {
      return true
    }
    return this.parent === parent
  }
}
