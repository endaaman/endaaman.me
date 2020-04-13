import fecha from 'fecha'
import { NO_TAG_NAME, NO_CATEGORY_SLUG } from '../constants'


const fieldOriginal = Symbol()

export class Article {
  constructor(obj, store) {
    Object.assign(this, obj || {
      parent: null, // TODO: use categorySlug
      slug: '',
      title: '' ,
      aliases: [],
      body: '',
      image: '',
      digest: '',
      tags: [],
      priority: 0,
      private: false,
      special: false,
      date: fecha.format((new Date()), 'YYYY-MM-DD'),
    })
  }
  getCategorySlug() {
    return this.parent || NO_CATEGORY_SLUG
  }
  getRelative() {
    const { parent, slug } = this
    return (parent || '-') + '/' + slug
  }
  matchByRelative(relative) {
    if (!relative) {
      return false
    }
    const [ categorySlug, slug ] = relative.split('/')
    return this.getCategorySlug() === categorySlug && this.slug === slug
  }
  getHref() {
    return '/' + this.getRelative()
  }
  getTags() {
    if (this.tags.length > 0) {
      return this.tags
    }
    return [ NO_TAG_NAME ]
  }
  serialize() {
    return JSON.stringify(this)
  }
  copy() {
    const a = new Article(JSON.parse(this.serialize()))
    a[fieldOriginal] = this
    return a
  }
  getDigest() {
    if (this.digest) {
      return this.digest
    }
    const threshold = 120
    const base = this.body.substring(0, 200)
    const tmp = base.replace(/#|`|:|-|\||\*|_/g, '').substring(0, threshold)
    return (tmp.length < threshold) ? tmp : (tmp + '...')
  }
  getOriginal() {
    return this[fieldOriginal] || null
  }
  matchParent(parent) {
    if (parent === '-' && this.parent === null) {
      return true
    }
    return this.parent === parent
  }
  getCategory() {
    const slug = this.parent || NO_CATEGORY_SLUG
    return this.constructor.store.getters['category/getCategoryBySlug'](slug)
  }
  // equals(another) {
  //   return this.parent === another.parent && this.slug === another.slug
  // }
  toPrintable() {
    const bodyLimit = 40
    return {
      ...this,
      extra: {
        relative: this.getRelative(),
        href: this.getHref(),
      },
      body: this.body.length > bodyLimit
        ? (this.body.substr(0, bodyLimit) + '...')
        : this.body
    }
  }
  getSiblings() {
    if (this.special) {
      return [null, null]
    }
    const map = this.constructor.store.getters['article/articleMapKeyByParent']
    const siblings = map[this.parent]
    let prev = null
    let next = null
    let matched = false
    for (const a of siblings) {
      if (matched) {
        prev = a
        break
      }
      if (this.equals(a)) {
        matched = true
        continue
      }
      next = a
    }
    return [prev, next]
  }

  compare(that) {
    let diff
    const a = fecha.format(new Date(this.date), 'YYYY-MM-DD')
    const b = fecha.format(new Date(that.date), 'YYYY-MM-DD')
    diff = b.localeCompare(a)
    if (diff !== 0) {
      return diff
    }
    return that.slug.localeCompare(this.slug)
  }

  equals(that) {
    return this.serialize() === that.serialize()
  }
  equalsExceptForBody(that) {
    return JSON.stringify({...this, ...{body: ''}}) === JSON.stringify({...that, ...{body: ''}})
  }
}


export class Category {
  constructor(obj) {
    Object.assign(this, obj)
  }
  getValue() {
    return this.slug === '-' ? null : this.slug
  }
  getArticles() {
    const map = this.constructor.store.getters['article/articleMapKeyByParent']
    return map[this.getValue()] || []
  }
}
