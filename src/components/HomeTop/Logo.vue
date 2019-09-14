<template>
  <div class="logo-wrapper">
    <router-link to="/">Muse Forum</router-link>
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
  mounted() {}
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
    color: $logoFontColor !important;
    font-weight: 700;
    letter-spacing: 5px;
    text-transform: uppercase;
  }
}
</style>
