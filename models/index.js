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
}
