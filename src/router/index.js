import Vue from 'vue'
import Router from 'vue-router'
import Maps from '@/components/Maps'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'mapsDefault',
      component: Maps
    },
    {
      path: '/maps/:id',
      name: 'maps',
      component: Maps,
      props: true
    }
  ]
})
