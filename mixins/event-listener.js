import Vue from 'vue'
import debounce from 'debounce'


export default function (eventName, delay, target) {
  return {
    data() {
      return {
        inner: debounce(this.inner2, delay)
      }
    },
    methods: {
      inner2() {
        const key = eventName[0].toUpperCase() + eventName.slice(1, eventName.length)
        if (typeof this[key] === 'function') {
          this[key]()
        }
      },
    },
    mounted() {
      const w = target ? target() : window
      w.addEventListener(eventName, this.inner, false)
    },
    beforeDestroy() {
      const w = target ? target() : window
      w.removeEventListener(eventName, this.inner, false)
    }
  }
}

