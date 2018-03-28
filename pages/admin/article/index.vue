<style scoped lang="scss">
@import "../../../css/variables";

@media screen and (max-width: $breakpoint - 1) {
  pre.article-json {
    max-width: calc(100vw - 120px);
  }
}

.container-admin-article {
  table-layout: fixed;
}

</style>

<template lang="pug">
.container-admin-article
  b-field(grouped group-multiline)
    b-select(placeholder="Category", size="is-small", v-model="selectedCategorySlug")
      option(:value="null") すべて
      option(v-for="c in categories", :key="c.slug", :value="c.slug") {{ c.name }}

    b-select(placeholder="Tag", size="is-small", v-model="selectedTag")
      option(:value="null") すべて
      option(v-for="tag in tags", :key="tag", :value="tag") {{ tag }}

  b-table(:data="articleDate", :mobile-cards="false", detailed)
    template(slot-scope="data")
      b-table-column(label="Relative", field="extra.relative", :visible="!isSmallScreen", :sortable="true")
        code {{ data.row.extra.relative }}
      b-table-column(label="Title", field="title", :sortable="true")
        | {{ data.row.title }}
        span.icon.has-text-danger(v-if="data.row.private")
          i.mdi.mdi-lock
        span.icon.has-text-info(v-if="data.row.special")
          i.mdi.mdi-star-circle
      b-table-column(label="", field="edit")
        nuxt-link(:to="'/admin/article/edit?relative=' + data.row.extra.relative")
          span.icon.has-text-success
            i.mdi.mdi-pencil
      b-table-column(label="Date", field="date", :sortable="true")
        | {{ data.row.date }}
    template(slot="detail", slot-scope="data")
      pre.article-json {{ JSON.stringify(data.row, null, 2) }}
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      selectedCategorySlug: null,
      selectedTag: null,
    }
  },
  computed: {
    ...mapState('layout', ['isSmallScreen']),
    ...mapState('article', ['articles']),
    ...mapState('category', ['categories']),
    ...mapGetters('article', ['tags']),
    filteredArticles() {
      const c = this.selectedCategorySlug
      const t = this.selectedTag
      return this.articles.filter((a) => {
        let flag = true
        if (c) {
          flag = flag && a.getCategorySlug() === c
        }
        if (t) {
          flag = flag && a.getTags().includes(t)
        }
        return flag
      })
    },
    articleDate() {
      return this.filteredArticles.map((a) => a.toPrintableJson())
    },
    columns() {
      return [
        {
          field: 'extra.relative',
          label: 'Relative',
          width: '40',
          visible: !this.isSmallScreen,
        }, {
          field: 'title',
          label: 'Title',
        }, {
          field: 'date',
          label: 'Date',
          sortable: true,
        }
      ]
    }
  },
}
</script>
