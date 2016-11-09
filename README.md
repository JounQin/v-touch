# v-touch
A full-featured gesture component designed for Vue

~~__*This module is still working in progress right now, so it is just for placeholder.*__~~

Now, you can try to use `v-touch` in your project!

## Usage

A deadly simply example:

``` js
// app.js
import Vue from 'vue'
import VTouch from 'v-touch'
Vue.use(VTouch)
```

``` vue
// touch.vue
<template>
  <button v-touch="touchOptions">
    {{ msg }}
  </button>
</template>
<script>
  export default {
    data() {
      return {
        msg: 'try to move me!'
      }
    },
    computed: {
      touchOptions() {
        return {
          x: false,
          y: false,
          handler: {
            tap() {
              console.log('tap')
            },
            dbTap() {
              console.log('dbTap')
            },
            press() {
              console.log('press')
            },
            swipeLeft() {
              console.log('swipeLeft')
            },
            swipeRight() {
              console.log('swipeRight')
            },
            swipeUp() {
              console.log('swipeUp')
            },
            swipeDown() {
              console.log('swipeDown')
            }
          }
        }
      }
    }
  }
</script>
```

## Document

[WIP]
