<template>
  <div>
    <video :width="width+'px'" :height="height+'px'" controls muted loop>
      <source :src="url" type="video/mp4">
    </video>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "videoPreview",
  components: {},
  props: {
    url: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    }
  },
  computed: {

  },
  mounted() {
  },
  data() {
    return {
      wallpaperData: {},
    }
  }
})
</script>

<style scoped lang="less">

</style>
