<style scope lang="scss">
@import "../css/variables";

.file-filename {
  font-family: $family-monospace;
}

.file-controls {
  @include clearfix
  li {
    float: left;
    margin-right: 8px;
  }

  margin: 8px 0;
}

</style>

<template lang="pug">
.container-file
  nav.breadcrumb.is-small(aria-label="breadcrumbs")
    ul
      li
        nuxt-link(to="/") Home
      li
        nuxt-link(to="/file") File Management
      li(v-for="c in crumbs")
        nuxt-link(:to="'/file?q=' + c.slug") {{ c.name }}

  ul.file-controls
    li
      nuxt-link.button.is-small(:to="parentLink" :disabled="isRoot") Parent dir
    li
      button.button.is-small.is-info(
        @click="reload",
        :class="{ 'is-loading': isReloading }",
      ) Reload
    li
      button.button.is-small.is-success(@click="uploadFiles") Upload..
    li
      button.button.is-small.is-primary(@click="moveFile" :disabled="selectedFiles.length !== 1") Move
    li
      button.button.is-small.is-danger(@click="deleteFiles" :disabled="selectedFiles.length === 0") Delete

  table.table.is-fullwidth
    thead
      tr
        th(width="40px")
        th(width="200px") name
        th(width="120px") size
        th mtime
    tbody
      tr(v-for="file in files")
        td
          b-checkbox(v-model="selectedFiles", :native-value="file.name")
        td.file-filename
          span(v-if="file.is_dir")
            nuxt-link(:to="buildSubLink(file.name)") {{ file.name }}
            span /
          span(v-else) {{ file.name }}
        td {{ formatByteSize(file.size) }}
        td {{ formatTime(file.mtime) }}

</template>

<script>
import fecha from 'fecha'
import { mapState } from 'vuex'

export default {
  layout: 'simple',
  async fetch ({ store, route }) {
    const slug = route.query.q || ''
    await store.dispatch('file/getFiles', { slug })
  },
  data: () => ({
    isReloading: false,
    selectedFiles: [],
  }),
  computed: {
    ...mapState('file', ['tree']),
    parentLink() {
      const slug = this.$route.query.q
      if (!slug) {
        return '/file'
      }
      const splitted = slug.split('/')
      splitted.pop()
      if (splitted.length === 0) {
        return '/file'
      }
      return '/file?q=' + splitted.join('/')
    },
    isRoot() {
      return !this.$route.query.q
    },
    files() {
      return this.$store.getters['file/findFiles'](this.$route.query.q || '')
    },
    crumbs() {
      const slug = this.$route.query.q
      if (!slug) {
        return []
      }
      let prev = ''
      const items = []
      for (const path of slug.split('/')) {
        const cur = prev + path
        items.push({
          name: path,
          slug: cur,
        })
        prev = cur + '/'
      }
      return items
    }
  },
  methods: {
    async reload() {
      this.isReloading = true
      const slug = this.$route.query.q || ''
      await this.$store.dispatch('file/fetchFiles', { slug })
      this.isReloading = false
    },
    uploadFiles() {
    },
    moveFile() {
    },
    deleteFiles() {
    },
    buildSubLink(dirName) {
      const slug = this.$route.query.q
      let suffix
      if (!slug) {
        suffix = dirName
      } else {
        suffix = slug + '/' + dirName
      }
      return '/file?q=' + suffix
    },
    formatTime(time) {
      return fecha.format(new Date(time), 'YYYY年MM月DD日 HH時mm分')
    },
    formatByteSize(size, precision = 1) {
      if (isNaN(parseFloat(size)) || !isFinite(size)) {
        return '-'
      }
      const units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB']
      const number = size === 0
        ? 0
        : Math.floor(Math.floor(Math.log(size)) / Math.log(1024))
      return (size / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number]
    },
  }
}
</script>
