<template>
  <section class="container-inner">

    <slot></slot>

  </section>

</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class ContainerInner extends Vue {
  // Props
  // @Prop({
  //   type: String,
  //   default: "",
  //   required: false
  // })
  // title!: string;
}
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.container-inner {
  // min-height: calc(100vh - #{$homeTopHeight} - 5px);
  // Phone
  padding: 12px;
  background: $mainContainerBgColor;
  border-radius: $mainWrapperBorderRadius;
  box-shadow: $boxShadowColor;
}

@media screen and (min-width: 576px) {
  .container-inner {
    // min-height: calc(100vh - #{$homeTopHeight} - 40px);
    padding: 15px 20px;
  }
}

@media screen and (min-width: 768px) {
  .container-inner {
    padding: 18px 25px;
  }
}

@media screen and (min-width: 992px) {
  .container-inner {
    padding: 18px 35px;
  }
}

@media screen and (min-width: 1200px) {
  .container-inner {
    padding: 20px 40px;
  }
}
</style>
