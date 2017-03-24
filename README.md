# v-touch

[![Greenkeeper badge](https://badges.greenkeeper.io/JounQin/v-touch.svg)](https://greenkeeper.io/)
[![dependencies](https://david-dm.org/JounQin/v-touch.svg)](https://david-dm.org/JounQin/v-touch)
[![devDependency Status](https://david-dm.org/JounQin/v-touch/dev-status.svg)](https://david-dm.org/JounQin/v-touch?type=dev)

A full-featured gesture component designed for Vue

~~__*This module is still working in progress right now, so it is just for placeholder.*__~~

Now, you can try to use `v-touch` in your project!

## Usage

A deadly simply example:

[see this on jsfiddle](https://jsfiddle.net/JounQin/ysvozkLo/)

If you are also working with `vue-touch`, you can use `Vue.use(VTouch, {name: 'move'})` (or something else), so that the directive name will change to `v-move`!

``` js
new Vue({
  el: '#app',
  template: `<div class="container">
  tap: {{ tapNum }},<br>
  dblTap: {{ dblTapNum }},<br>
  mltTap: {{ mltTapNum }}, lastMltTapped: {{ lastMltTapped }}<br>
  press: {{ pressNum }},<br>
  swipeLeft: {{ swipeLeftNum }},<br>
  swipeRight: {{ swipeRightNum }},<br>
  swipeUp: {{ swipeUpNum }},<br>
  swipeDown: {{ swipeDownNum }}
  <br>
  <div v-touch="touch" @dblclick="dblclickOuter">
    <button class="my-btn" @tap="click">{{ msg }}</button>
    <div @dblclick="dblclick">
      <button class="my-btn">Just Another Button</button>
    </div>
  </div>
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
        dblTapNum: 0,
        mltTapNum: 0,
        lastMltTapped: 0,
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
          methods: true
        }
      }
    },
    methods: {
      toggle(prop) {
        this[prop] = !this[prop]
      },
      tap(e) {
        this.tapNum++
      },
      dblTap() {
        this.dblTapNum++
      },
      mltTap({tapped}) {
        this.mltTapNum++
        this.lastMltTapped = tapped
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
      },
      click() {
        console.log('clicked the first button')
      },
      dblclick() {
        console.log('dblclicked the second one')
      },
      dblclickOuter() {
        console.log('dblclicked')
      }
    }
})
```

## Document

[WIP]
