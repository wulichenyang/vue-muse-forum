<template>
  <!-- 作者昵称 -->
  <router-link :to="`/users/${user && user._id}`">
    <span>{{user && user.nickname}}</span>
  </router-link>

</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UserBrief } from "@/assets/js/dataType";

@Component({
  components: {}
})
export default class UserName extends Vue {
  // Props
  @Prop({
    required: false
  })
  user!: UserBrief;

  // Lifecycle
  mounted() {}
}
</script>

<style lang="scss">
@import "../assets/css/var.scss";

// @media screen and (min-width: 576px) {
//   .user-name {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-name {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-name {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-name {
//     max-width: 1024px;
//   }
// }
</style>
