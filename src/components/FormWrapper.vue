<template>
  <div class="form-wrapper">
    <h2 v-if="title">
      {{title}}
    </h2>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class FormWrapper extends Vue {
  // Props
  @Prop({
    type: String,
    default: "",
    required: false
  })
  title!: string;
}
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.form-wrapper {
  position: relative;
  box-sizing: border-box;
  min-height: calc(100vh - #{$homeTopHeight} - 130px);
  padding: 5px 36px 36px 36px;
  background: $mainContainerBgColor;

  box-shadow: $boxShadowColor;
  overflow: hidden;
  // Phone
  border-radius: $phoneMainWrapperBorderRadius;
}
@media screen and (min-width: 576px) {
  .form-wrapper {
    border-radius: $mainWrapperBorderRadius;
  }
}
</style>
