<template>
  <div v-show="isVisible" class="gmap-panel" :class="{'is-collapsed': !isOpen}">
      <button
        class="toggle"
        :class="{'is-right': (align == 'left'), 'is-left': (align != 'left')}"
        @click="isOpen = !isOpen">
          <span aria-hidden="true" class="icon" v-if="isOpen" v-html="align == 'left'?iconOpen:iconClose"></span>
          <span aria-hidden="true" class="icon" v-if="!isOpen" v-html="align == 'left'?iconClose:iconOpen"></span>
      </button>
      <div class="body">
        <slot></slot>
      </div>
  </div>
</template>

<script>
export default {
  name: 'GmapPanel',
  props: {
    open: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: true,
      twoWay: true
    },
    align: {
      type: String,
      default: 'left'
    },
    isTop: {
      type: Boolean,
      default: false
    },
    iconOpen: {
      type: String,
      default: '&#9668;'
    },
    iconClose: {
      type: String,
      default: '&#9658;'
    }
  },
  data: function () {
    return {
      isVisible: this.show,
      isOpen: this.open
    }
  }
}
</script>

<style scoped>
.gmap-panel {
  position:absolute;
  width:320px;
  z-index:5000;
  background:#fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  -webkit-transform: translateX(0px);
  transform: translateX(0px);
  transition-property: -webkit-transform,transform,opacity,width;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.0,0.0,0.2,1);
}
  .gmap-panel:focus,
  .gmap-panel:hover,
  .gmap-panel:active {
    z-index:6000;
  }
  .gmap-panel.is-collapsed {
    width:0 !important;
  }

.toggle {
  position:absolute;
  top:0;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  outline: 0;
  font: inherit;
  vertical-align: baseline;
  background: transparent;
  list-style: none;
  overflow: visible;
  color: #8c8c8c;
  cursor:pointer;
  width: 35px;
  height: 35px;
  background:rgba(255,255,255,0.9);
  border-left: 1px solid #D4D4D4;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.3);
}
  .toggle.is-left {
    right:100%;
  }
  .toggle.is-right {
    left:100%;
  }
  .toggle:hover,
  .toggle:focus {
    color:#000;
  }

.icon {
  font-size:13px;
}

.body {
  background:#fff;
  overflow-y:auto;
  overflow-x:hidden;
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
}
</style>
