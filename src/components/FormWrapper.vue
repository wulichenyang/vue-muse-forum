<template>
  <div class="form-wrapper">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class FormWrapper extends Vue {}
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.form-wrapper {
  padding: 50px;
  background: $mainContainerBgColor;
}
</style>
