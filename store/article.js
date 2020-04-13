import { Article } from '../models'
import { NO_TAG_NAME } from '../constants'

export const state = () => ({
  articles: [],
  isFetched: false,
})

export const mutations = {
  set(state, items) {
    state.articles = items.map((a) => new Article(a))
    state.isFetched = true
  },
  sort(state) {
    const aa = [...state.articles]
    aa.sort((a, b) => a.compare(b))
    state.articles = aa
  },
  wrap(state, items) {
    state.articles = state.articles.map((a) => new Article(a))
  },
  removeByRelative(state, relative) {
    state.articles = state.articles.filter((a) => !a.matchByRelative(relative))
  },
  add(state, article) {
    state.articles = [...state.articles, new Article(article)]
  },
}

export const actions = {
  async fetchArticles({ commit, getters, rootGetters }) {
    const res = await rootGetters.api('/articles')
    commit('set', await res.json())
    commit('sort')
  },
  async getArticles({ state, dispatch }) {
    if (state.isFetched) {
      return
    }
    await dispatch('fetchArticles')
  },

  async createArticles({ commit, rootGetters }, { article }) {
    const res = await rootGetters.api('/aa/', {
      method: 'POST',
      json: article,
    })
    if (!res.ok) {
      return { error: await res.text() }
    }
    const data = new Article(await res.json())
    commit('add', data)
    commit('sort')
    return { error: null, data }
  },

  async updateArticles({ commit, rootGetters }, { article }) {
    const originalRelative = article.getOriginal().getRelative()
    const res = await rootGetters.api('/aa/' + originalRelative, {
      method: 'PATCH',
      json: article,
    })
    if (!res.ok) {
      return { error: await res.text() }
    }
    const data = new Article(await res.json())
    commit('removeByRelative', originalRelative)
    commit('add', data)
    commit('sort')
    return { error: null, data }
  },

  async deleteArticles({ commit, rootGetters }, { article }) {
    const originalRelative = article.getOriginal().getRelative()
    const res = await rootGetters.api('/aa/' + originalRelative, {
      method: 'DELETE',
    })
    if (!res.ok) {
      return { error: await res.text() }
    }
    return { error: null }
  }
}

export const getters = {
  specialArticles(state) {
    return state.articles.filter(a => a.special)
  },
  normalArticles(state) {
    return state.articles.filter(a => !a.special)
  },
  getArticleByRelative(state) {
    return (relative) => {
      return state.articles.find(a => a.matchByRelative(relative))
    }
  },
  articleMapKeyByParent(state, getters) {
    const aa = getters['normalArticles']
    const map = {}
    for (const a of aa) {
      if (map[a.parent]) {
        map[a.parent].push(a)
      } else {
        map[a.parent] = [a]
      }
    }
    return map
  },
  getTags(state, getters) {
    return (func) => {
      const aa = getters['normalArticles']
      const tags = [...new Set(
        Array.prototype.concat(
          ...Array
          .from(aa)
          .filter(func)
          .map((a) => a.getTags())
        )
      )]
      tags.sort((a, b) => {
        if (a === NO_TAG_NAME) {
          return 1
        }
        if (b === NO_TAG_NAME) {
          return -1
        }
        return a.localeCompare(b)
      })
      return tags
    }
  },
  tags(state, getters) {
    return getters['getTags']((a) => a)
  },
  getTagsByCategorySlug(state, getters) {
    return (categorySlug) => {
      return getters['getTags']((a) => a.getCategorySlug() === categorySlug)
    }
  },
  tagAggregations(state, getters) {
    const counts = {}
    const aa = getters['normalArticles']
    for (const article of aa) {
      const tags = article.getTags()
      for (const tag of tags) {
        if (tag in counts) {
          counts[tag] = counts[tag] + 1
        } else {
          counts[tag] = 1
        }
      }
    }
    const tags = []
    for (const key of Object.keys(counts)) {
      tags.push({
        name: key,
        count: counts[key],
      })
    }
    tags.sort((a, b) => {
      if (a.name === NO_TAG_NAME) {
        return 1
      }
      if (b.name === NO_TAG_NAME) {
        return -1
      }
      const diff = b.count - a.count
      if (diff !== 0) {
        return diff
      }
      return a.name.localeCompare(b.name)
    })
    return tags
  }
}
