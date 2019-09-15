<template>
  <div class="home">
    <h1>home page</h1>
    <mu-button
      class="demo-color-btn"
      color="primary"
    > primary </mu-button>
    <mu-button
      class="demo-color-btn"
      color="secondary"
    > second </mu-button>
 
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Home extends Vue {}
</script>
