import urlJoin from 'url-join'

export const state = () => ({
  tree: {},
})

export const mutations = {
  SET_FILES(state, [ dir, files ]) {
    state.tree = {
      ...state.tree,
      [dir]: files,
    }
  },
  DELETE_FILE(state, [ dir, name ]) {
    state.tree = {
      ...state.tree,
      [dir]: state.tree[dir].filter(file => file.name !== name),
    }
  },
}

export const actions = {
  async fetchFiles({ commit, dispatch, getters, rootGetters }, { dir }) {
    dir = dir || ''
    const res = await rootGetters.api('files/' + dir)
    commit('SET_FILES', [ dir, await res.json() ])
  },
  async getFiles({ commit, getters, dispatch }, { dir }) {
    dir = dir || ''
    if (getters.hasFiles(dir)) {
      return
    }
    await dispatch('fetchFiles', { dir })
  },
  async deleteFile({ commit, dispatch, rootGetters }, { dir, name }) {
    const res = await rootGetters.api('files/' + urlJoin(dir, name), { method: 'DELETE' })
    if (!res.ok) {
      return { error: await res.text() }
    }
    commit('DELETE_FILE', [ dir, name ])
    return { error: null }
  },
  async uploadFiles({ commit, dispatch, rootGetters }, { dir, files }) {
    const fd = new FormData()
    for (const file of files) {
      console.log(file)
      // NOTE: force lower case
      // fd.append(file.name.toLowerCase(), file)
      fd.append("files", file)
    }
    const res = await rootGetters.api(urlJoin('/files', dir), {
      method: 'POST',
      body: fd,
      timeout: 10 * 60 * 1000,  // 10min
    })
    if (!res.ok) {
      return { error: await res.text() }
    }
    await dispatch('fetchFiles', { dir })
    return { error: null }
  },
  async makeDir({ commit, dispatch, rootGetters }, { dir, name }) {
    const res = await rootGetters.api('files/' + urlJoin(dir, name), { method: 'PUT' })
    if (!res.ok) {
      return { error: await res.text() }
    }
    await dispatch('fetchFiles', { dir })
    return { error: null }
  },
  async moveFile({ commit, dispatch, rootGetters }, { dir, name, newDir, newName }) {
    const res = await rootGetters.api('files/' + urlJoin(dir, name), {
      method: 'PATCH',
      json: { dest: urlJoin(newDir, newName) }
    })
    if (!res.ok) {
      return { error: await res.text() }
    }
    await dispatch('fetchFiles', { dir })
    return { error: null }
  },
}

export const getters = {
  hasFiles(state) {
    return dir => dir in state.tree
  },
  getFiles(state) {
    return dir => state.tree[dir]
  },
}
