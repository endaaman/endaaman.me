<style scoped lang="scss">
@import "../../../css/variables";

.table-detail {
  @media screen and (max-width: $breakpoint - 1) {
    max-width: calc(100vw - 120px);
  }
}
</style>

<template lang="pug">
.admin-article-index-root
  ul.list-inline
    li
      nuxt-link.button.is-primary.is-small(to="/admin/article/new") New
    li
      b-select(placeholder="Category", size="is-small", v-model="selectedCategorySlug")
        option(:value="null") すべて
        option(v-for="c in categories", :key="c.slug", :value="c.slug") {{ c.name }}
    li
      b-select(placeholder="Tag", size="is-small", v-model="selectedTag")
        option(:value="null") すべて
        option(v-for="tag in tags", :key="tag.name", :value="tag.name") {{ tag.name }} ({{ tag.count }})

    li
      b-select(placeholder="Flag", size="is-small", v-model="selectedFlag")
        option(:value="null") すべて
        option(value="private") Private
        option(value="special") Special

    li
      b-input(v-model="filterStr", placeholder="Filter", type="search", icon="magnify", size="is-small", rounded)

    li
      p(v-show="isFiltering") loading

  b-table(:data="articleDate", :mobile-cards="false", detailed, default-sort="date", default-sort-direction="desc")
    template(slot-scope="data")
      b-table-column(label="Relative", field="extra.relative", :visible="!isSmallScreen", :sortable="true")
        code {{ data.row.extra.relative }}
      b-table-column(label="Title", field="title", :sortable="true")
        nuxt-link(:to="'/admin/article/edit?relative=' + data.row.extra.relative") {{ data.row.title }}
        span.icon.has-text-danger(v-if="data.row.private")
          i.mdi.mdi-lock
        span.icon.has-text-info(v-if="data.row.special")
          i.mdi.mdi-star-circle
      b-table-column(label="Date", field="date", :sortable="true")
        | {{ data.row.date }}
    template(slot="detail", slot-scope="data")
      .table-detail
        pre {{ data.row | json }}
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      selectedCategorySlug: null,
      selectedTag: null,
      selectedFlag: null,
      filterStr: '',
      isFiltering: false,
    }
  },
  computed: {
    ...mapState('layout', ['isSmallScreen']),
    ...mapState('article', ['articles']),
    ...mapState('category', ['categories']),
    ...mapGetters('article', {
      'tags': 'tagAggregations',
    }),
    filteredArticles() {
      this.isFiltering = true
      const filteredKeys = ['slug', 'title', 'body', 'digest']
      return this.articles.filter((a) => {
        if (this.selectedCategorySlug) {
          if (a.categorySlug !== this.selectedCategorySlug) {
            return false
          }
        }
        if (this.selectedTag) {
          if (!a.getTags().includes(this.selectedTag)) {
            return false
          }
        }
        if (this.selectedFlag) {
          if (!a[this.selectedFlag]) {
            return false
          }
        }
        if (this.filterStr) {
          let contains = false
          for (const key of filteredKeys) {
            // console.log(key, a[key], a[key].includes(this.filterStr))
            if (a[key].includes(this.filterStr)) {
              contains = true
              break
            }
          }
          if (!contains) {
            return false
          }
        }
        return true
      })
    },
    articleDate() {
      return this.filteredArticles.map((a) => a.toPrintable())
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
