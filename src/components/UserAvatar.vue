<template>
  <!-- 头像 -->
  <router-link
    class="left-avatar-wrapper"
    :to="`/users/${user && user._id}`"
  >
    <mu-button
      class="avatar-btn"
      fab
    >
      <mu-avatar
        v-if="user && user.avatar"
        text-color="#fff"
        color="pink400"
        size="36"
      >
        <img :src="user && user.avatar">
      </mu-avatar>
      <mu-avatar
        v-else
        text-color="#fff"
        color="pink400"
        size="36"
      >{{firstLetter}}
      </mu-avatar>
    </mu-button>
  </router-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UserBrief } from "@/assets/js/dataType";
import getPy from "@/utils/nameToPinyin";

@Component({
  components: {}
})
export default class UserAvatar extends Vue {
  // Props
  @Prop({
    required: false
  })
  user!: UserBrief;

  // Computed
  get firstLetter(): string {
    return this.user && this.user.nickname
      ? getPy(this.user.nickname.substring(0, 1))[0]
      : "";
  }

  // Lifecycle
  mounted() {}
}
</script>

<style lang="scss">
@import "../assets/css/var.scss";
// 左侧
.left-avatar-wrapper {
  width: $postAvatarSize;
  margin-top: 3px;
  // Phone
  margin-right: 6px;
  .avatar-btn {
    width: $postAvatarSize;
    height: $postAvatarSize;
    background: transparent;
  }
}

@media screen and (min-width: 576px) {
  .left-avatar-wrapper {
    margin-right: 14px;
  }
}
// @media screen and (min-width: 768px) {
//   .user-avatar {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-avatar {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-avatar {
//     max-width: 1024px;
//   }
// }
</style>
