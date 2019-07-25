import Vue from 'vue'
import App from './App.vue'
import router from './router'
import * as VueGoogleMaps from 'vue2-google-maps'

// Google Map
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBOIV3nTM4ZXvxDYrq00zw_r2B5VxzW7UU',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    v: '3.26'
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  },
  installComponents: true
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
