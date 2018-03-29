import axios from 'axios'
import urljoin from 'url-join'
import fetch from 'node-fetch'
import cookieParser from 'cookie'
import browserCookie from 'browser-cookies'
import { Article, Category } from '../models'


export const plugins = [
  function(store) {
    Article.store = store
    Category.store = store
  },
]

export const state = () => ({
  authorized: false,
  token: null,
  warnings: null,
})

export const mutations = {
  setToken(state, token) {
    state.token = token
    if (!process.server) {
      browserCookie.set('token', token, { expires: 365 })
    }
  },
  clearToken(state) {
    state.token = null
    if (!process.server) {
      browserCookie.erase('token')
    }
  },
  setAuthorized(state, authorized) {
    state.authorized = authorized
  },
  setWarnings(state, warnings) {
    state.warnings = warnings
  }
}


export const actions = {
  async nuxtServerInit ({ commit, dispatch }, { req }) {
    if (req.headers.cookie) {
      const { token } = cookieParser.parse(req.headers.cookie)
      if (token) {
        commit('setToken', token)
        await dispatch('checkAuth')
      }
    }
    await Promise.all([
      dispatch('article/getArticles'),
      dispatch('category/getCategories'),
    ])
  },
  nuxtClientInit({ commit }) {
    commit('article/wrap')
    commit('category/wrap')
  },
  async login({ getters, commit, dispatch }, { password }) {
    const res = await getters.api2('/sessions', {
      method: 'POST',
      json: { password },
    })
    if (!res.ok) {
      return { error: await res.text() }
    }
    commit('setToken', (await res.json()).token)
    commit('setAuthorized', true)
    await dispatch('article/fetchArticles')
    return { error: null }
  },
  async checkAuth({ getters, commit, dispatch }) {
    const res = await getters.api2('/sessions')
    if (!res.ok) {
      commit('clearToken')
    }
    commit('setAuthorized', res.ok)
  },
  async logout({ getters, commit, dispatch }) {
    commit('clearToken')
    commit('setAuthorized', false)
    await dispatch('article/fetchArticles')
  },
  async fetchWarnings({ getters, commit, dispatch }) {
    const res = await getters.api2('/misc/warnings', { method: 'GET' })
    commit('setWarnings', await res.json())
  },
}

export const getters = {
  api({ token }) {
    const headers = {}
    if (token) {
      headers['Authorization'] = 'Bearer ' + token
    }
    return axios.create({
      baseURL: process.env.apiRoot,
      headers,
    })
  },
  api2({ token }) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = 'Bearer ' + token
    }
    return (url, options) => {
      const body = {}
      if (options && options.json) {
        body['body'] = JSON.stringify(options.json)
      }
      return fetch(urljoin(process.env.apiRoot, url), {
        headers,
        ...options,
        ...body,
      })
    }
  },
  activeCategory(state, getters) {
    if (!state.route) {
      return null
    }
    if (state.route.name !== 'index') {
      return null
    }
    const categorySlug = state.route.query.category
    if (!categorySlug) {
      return null
    }
    return getters['category/findCategory'](categorySlug)
  },
  activeTag(state, getters) {
    if (!state.route) {
      return null
    }
    if (state.route.name !== 'index') {
      return null
    }
    const tag = state.route.query.tag
    const tags = getters['article/tags']
    if (!tags.includes(tag)) {
      return null
    }
    return tag
  },
  activeArticle(state, getters) {
    if (!state.route) {
      return null
    }
    if (state.route.name !== 's1-s2') {
      return null
    }
    const { s1, s2 } = state.route.params
    return getters['article/getArticleByRelative'](s1 + '/' + s2)
  },
}
