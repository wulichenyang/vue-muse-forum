<template>
  <div class="logo-wrapper">
    <a href="/">Muse Forum</a>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";

@Component({
  components: {}
})
export default class Logo extends Vue {
  // @Getter("userDetail") userDetail!: UserDetail | null;
  // @Action("getUser") getUser: any;

  // Lifecycle
  private mounted() {}
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";

.logo-wrapper {
  height: 100%;
  margin-left: 20px;
  display: flex;
  align-items: center;
  a {
    color: #e91e63;
    background-image: linear-gradient(92deg, #e91e63 0%, #ffc04d 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    // color: $logoFontColor !important;
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    animation: hue 60s infinite linear;
  }
}

/*-----------------------------------*\
  $ANIMATIONS
\*-----------------------------------*/

@keyframes hue {
  from {
    filter: hue-rotate(0deg);
  }

  to {
    filter: hue-rotate(-360deg);
  }
}
</style>
