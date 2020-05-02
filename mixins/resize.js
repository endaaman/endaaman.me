import Vue from 'vue'
import debounce from 'debounce'


export default function (delay) {
  return {
    data() {
      return {
        onResizeInner: debounce(this.onResizeInner2, delay)
      }
    },
    methods: {
      onResizeInner2() {
        if (typeof this.onResize === 'function') {
          this.onResize()
        }
      },
      inner() {
      }
    },
    mounted() {
      window.addEventListener('resize', this.onResizeInner, false)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.onResizeInner, false)
    }
  }
}

