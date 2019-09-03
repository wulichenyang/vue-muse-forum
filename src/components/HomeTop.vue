
<template>
  <header class="home-top">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
    {{userDetail}}
    {{isLogin}}
  </header>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { UserDetail } from "@/assets/js/dataType";
@Component({
  components: {}
})
export default class HomeTop extends Vue {
  @Getter("userDetail") userDetail!: UserDetail | null;
  @Getter("isLogin") isLogin!: boolean;

  mounted() {}
}
</script>

<style lang="scss">
.home-top {
}
</style>
