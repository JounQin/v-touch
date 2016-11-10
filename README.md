# v-touch
A full-featured gesture component designed for Vue

~~__*This module is still working in progress right now, so it is just for placeholder.*__~~

Now, you can try to use `v-touch` in your project!

## Usage

A deadly simply example:

[see this on jsfiddle](https://jsfiddle.net/JounQin/ysvozkLo/)

``` js
new Vue({
  el: '#app',
  template: `<div class="container">
    tap: {{ tapNum }},<br>
    dbTap: {{ dbTapNum }},<br>
    press: {{ pressNum }},<br>
    swipeLeft: {{ swipeLeftNum }},<br>
    swipeRight: {{ swipeRightNum }},<br>
    swipeUp: {{ swipeUpNum }},<br>
    swipeDown: {{ swipeDownNum }}
    <br>
		<br>
    <button class="my-btn" v-touch="touch">
      {{ msg }}
    </button>
    <br>
    <br>
    <button class="btn btn-default" @click="toggle('x')">toggle x ({{ x }})</button>
    <button class="btn btn-default" @click="toggle('y')">toggle y ({{ y }})</button>
  </div>`,
  data() {
    return {
      msg: 'try to touch, move, swipe, press me!',
      x: false,
      y: false,
      tapNum: 0,
      dbTapNum: 0,
      pressNum: 0,
      swipeLeftNum: 0,
      swipeRightNum: 0,
      swipeUpNum: 0,
      swipeDownNum: 0
    }
  },
  computed: {
    touch() {
      return {
        x: this.x,
        y: this.y,
        context: this,
        methods: true
      }
    }
  },
  methods: {
    toggle(prop) {
        this[prop] = !this[prop]
      },
      tap() {
        this.tapNum++
      },
      dbTap() {
        this.dbTapNum++
      },
      press() {
        this.pressNum++
      },
      swipeLeft() {
        this.swipeLeftNum++
      },
      swipeRight() {
        this.swipeRightNum++
      },
      swipeUp() {
        this.swipeUpNum++
      },
      swipeDown() {
        this.swipeDownNum++
      }
  }
})
```

## Document

[WIP]
