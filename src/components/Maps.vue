<template>
  <section class="gmap">

    <gmap-panel align="left" id="panel-list">
      <div class="item"
          :key="r.propertyId"
          v-for="(r) in filteredResidences"
          :class="{'is-selected': r.propertyId == infoWindow.currentPropertyId }"
          :id="r.propertyId"
          @click="toggleInfoWindow(r)">
        <h2 class="title" role="link" tabindex="0" @focus="toggleInfoWindow(r)">
          {{r.address1}}
          <br>
          {{r.zipCode.zipCodeId}} {{r.zipCode.name}}
        </h2>
        <div class="text">
          <p>
            Kontantpris <strong>{{r.price | toCurrency}}</strong> — <strong>{{r.pricePerM2 | toCurrency}}/m²</strong>
          </p>
          <p>
            {{r.propertyType.name}},
            {{r.totalNumberOfRooms}} vær.,
            {{r.propertySizeAdvertized}} m²,
            bygget i {{r.builtYear}}
          </p>
        </div>
      </div>
    </gmap-panel>

    <gmap-panel align="right" id="panel-filter">
      <fieldset class="fieldset">
        <legend class="legend">
          Filter
          <span class="badge">{{filteredResidences.length}}</span>
          <small class="reset float-right" @click.stop="setFilters" role="link" tabindex="0">reset</small>
        </legend>
        <div>
          <div class="field">
            <label class="label" for="txtAdresse">Adresse</label>
            <div>
              <input id="txtAdresse" type="text" class="input" accesskey="s" title="Search [s]" v-model="filters.searchText">
            </div>
          </div>

          <div class="field">
            <label class="label">Pris</label>
            <div class="clearfix">
              <span class="float-left">{{filters.price.value[0] | toCurrency}}</span>
              <span class="float-right">{{filters.price.value[1] | toCurrency}}</span>
            </div>
            <vue-slider ref="sliderPrice" v-bind="filters.price" v-model="filters.price.value"/>
          </div>

          <div class="field">
            <label class="label">Størrelse</label>
            <div class="clearfix">
              <span class="float-left">{{filters.m2.value[0]}}m²</span>
              <span class="float-right">{{filters.m2.value[1]}}m²</span>
            </div>
            <vue-slider ref="sliderM2" v-bind="filters.m2" v-model="filters.m2.value"/>
          </div>

          <div class="field">
            <label class="label">Værrelser</label>
            <div class="clearfix">
              <span class="float-left">{{filters.rooms.value[0]}}</span>
              <span class="float-right">{{filters.rooms.value[1]}}</span>
            </div>
            <vue-slider ref="sliderRooms" v-bind="filters.rooms" v-model="filters.rooms.value"/>
          </div>

          <div class="field">
            <label class="label">Boligtyper</label>
            <div v-for="propertyType in filters.propertyTypes" :key="propertyType.text">
              <label>
                <input
                  type="checkbox"
                  @click="propertyType.checked = !propertyType.checked"
                  :checked="propertyType.checked">
                    {{propertyType.text}}
              </label>
            </div>
          </div>
        </div>
      </fieldset>
    </gmap-panel>

    <GmapMap
      id="gmap-map"
      class="gmap__map"
      ref="mapRef"
      :center="{lat:55.660058, lng:12.521015}"
      :zoom="13"
      map-type-id="terrain"
    >
      <GmapMarker
        :key="index"
        v-for="(m, index) in filteredResidences"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        :title="m.title"
        @click="toggleInfoWindow(m)"
      />
      <gmap-info-window :options="infoWindow.options" :position="infoWindow.position" :opened="infoWindow.isOpen" @closeclick="infoWindow.isOpen=false">
        {{infoWindow.content}}
      </gmap-info-window>
    </GmapMap>

  </section>
</template>

<script>
import vueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import gmapPanel from './GmapPanel'
const sliderDefaults = require('./../entities/sliderDefaults.json')

export default {
  name: 'Maps',
  components: {
    vueSlider,
    gmapPanel
  },
  props: {
    id: {
      default: 'JSON1',
      type: String
    }
  },
  data () {
    return {
      store: this.$parent.store,
      filters: {
        propertyTypes: [],
        searchText: '',
        price: {
          ...sliderDefaults,
          interval: 10
        },
        m2: {
          ...sliderDefaults,
          interval: 1
        },
        rooms: {
          ...sliderDefaults,
          interval: 1
        }
      },
      infoWindow: {
        content: '',
        position: {
          lat: 0,
          lng: 0
        },
        isOpen: false,
        currentPropertyId: null,
        options: {
          pixelOffset: {
            width: 0,
            height: -35
          }
        }
      }
    }
  },
  computed: {
    filteredResidences () {
      let q = this.filters.searchText.toLowerCase()
      function searchText (r) {
        return r.address1.toLowerCase().includes(q)
      }

      let minPrice = this.filters.price.value[0]
      let maxPrice = this.filters.price.value[1]
      function priceRange (r) {
        return r.price >= minPrice && r.price <= maxPrice
      }

      let minM2 = this.filters.m2.value[0]
      let maxM2 = this.filters.m2.value[1]
      function m2Range (r) {
        return r.propertySizeAdvertized >= minM2 && r.propertySizeAdvertized <= maxM2
      }

      let minRooms = this.filters.rooms.value[0]
      let maxRooms = this.filters.rooms.value[1]
      function roomsRange (r) {
        return r.totalNumberOfRooms >= minRooms && r.totalNumberOfRooms <= maxRooms
      }

      let checkedPropertyTypes = this.filters.propertyTypes.filter(p => p.checked)
      let arrayPropertyTypes = checkedPropertyTypes.map(obj => {
        return obj.text
      })
      function propertyType (r) {
        return arrayPropertyTypes.includes(r.propertyType.name)
      }
      // TODO: refactor only hide infoWindow if it is not visible
      this.infoWindow.isOpen = false
      this.infoWindow.currentPropertyId = null

      return this.store.residences
        .filter(searchText)
        .filter(priceRange)
        .filter(m2Range)
        .filter(roomsRange)
        .filter(propertyType)
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  filters: {
    toCurrency: function (value) {
      if (typeof value !== 'number') {
        return value
      }
      var formatter = new Intl.NumberFormat('da-DK', {
        style: 'currency',
        currency: 'DKK',
        minimumFractionDigits: 0
      })
      return formatter.format(value)
    }
  },
  methods: {
    setSlider (target, array) {
      // Set Slider value, min and max
      let min = Math.min(...array)
      let max = Math.max(...array)
      target.value = 0
      target.min = min
      target.max = max
      target.value = [min, max]
    },
    setFilters () {
      // Search text
      this.filters.searchText = ''
      // Price
      this.setSlider(this.filters.price, this.store.residences.map(r => { return r.price }))
      // M2
      this.setSlider(this.filters.m2, this.store.residences.map(r => { return r.propertySizeAdvertized }))
      // Rooms
      this.setSlider(this.filters.rooms, this.store.residences.map(r => { return r.totalNumberOfRooms }))

      // Uniq Prototypes
      // TODO refactor to a more simple way
      let uniqPropertyType = [...new Set(this.store.residences.map(r => { return r.propertyType.name }))]
      this.filters.propertyTypes = uniqPropertyType.map(propertyType => {
        return {
          text: propertyType,
          checked: true
        }
      })
    },
    toggleInfoWindow (marker) {
      this.infoWindow.position = marker.position
      this.infoWindow.content = marker.infoText
      if (this.infoWindow.currentPropertyId === marker.propertyId) {
        // check if its the same marker that was selected if yes toggle
        this.infoWindow.isOpen = !this.infoWindow.isOpen
      } else {
        // if different marker set infowindow to open and reset current marker index
        this.infoWindow.isOpen = true
        this.infoWindow.currentPropertyId = marker.propertyId
      }
      if (this.infoWindow.isOpen) {
        // this.infoWindow.currentPropertyId = marker.propertyId
        document.getElementById(marker.propertyId).scrollIntoView({ behavior: 'smooth' })
      } else {
        this.infoWindow.currentPropertyId = null
      }
    },
    panTo () {
      var lat = this.store.residences.map(p => { return p.latLon.lat })
      var lng = this.store.residences.map(p => { return p.latLon.lon })
      function getAvg (values) {
        let sum = values.reduce(function (accumulator, currentValue) {
          return accumulator + currentValue
        })
        return sum / values.length
      }
      this.$refs.mapRef.$mapPromise.then((map) => {
        map.panTo({ lat: getAvg(lat), lng: getAvg(lng) })
      })
    },
    fetchData () {
      let currentJson = this.store.jsons.find(json => {
        return json.name === this.id
      })
      fetch(currentJson.url)
        .then(response => {
          return response.json()
        })
        .then(data => {
          // Add gmap marker info
          return data.map(d => {
            return Object.assign({
              position: {
                lat: d.latLon.lat,
                lng: d.latLon.lon
              },
              infoText: d.address1,
              title: d.address1
            }, d)
          })
        })
        .then(data => {
          this.store.residences = data
        })
        .then(() => {
          this.panTo()
        })
        .then(() => {
          this.setFilters()
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#panel-list {
  top:70px;
  left:10px;
  bottom:50px;
}
#panel-filter {
  top:70px;
  right:10px;
  bottom:140px;
}
.item {
  cursor:pointer;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e6e6e6;
}
  .item.is-selected {
    background:#eee;
  }

.title {
  color: #000;
  font-size: 15px;
  line-height: 16px;
  padding-bottom: 2px;
  white-space: normal;
  margin:0;
}
  .title a {
    text-decoration: none;
    color:#000;
  }

.text {
  color: #8c8c8c;
  font-size: 13px;
  line-height: 16px;
  margin:0;
}
  .text > p:last-child {
    margin-bottom:0;
  }
#gmap-map {
  position: absolute;
  width: 100%;
  height: 100%;
}

.fieldset {
  border:0;
  padding:0;
  margin:1.5rem;
}
.legend {
  font-weight: bold;
  margin-bottom:1em;
  width:100%;
  padding-bottom:.5em;
  border-bottom: 1px solid #e6e6e6;
}
.label {
  font-weight: bold
}
.input {
  -moz-appearance: none;
  -webkit-appearance: none;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: none;
  display: inline-flex;
  font-size: 1rem;
  height: 1.25em;
  justify-content: flex-start;
  line-height: 1.5;
  padding-bottom: calc(.375em - 1px);
  padding-left: calc(.625em - 1px);
  padding-right: calc(.625em - 1px);
  padding-top: calc(.375em - 1px);
  position: relative;
  vertical-align: top;
  background-color: #fff;
  border-color: #dbdbdb;
  color: #363636;
  box-shadow: inset 0 1px 2px rgba(10,10,10,.1);
  max-width: 100%;
  width:calc(100% - 1em)
}
.field {
  margin-bottom:1em;
}
.badge {
  display: inline-block;
  padding: .25em .4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25rem;
  color: #f8f9fa;
  background-color: #212529;
}
.reset {
  color:#666;
  cursor: pointer;
}
.clearfix {
  overflow:hidden
}
.float-left {
  float:left
}
.float-right {
  float:right
}
</style>
