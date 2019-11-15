<template>
  <!-- 头像 -->

    <!-- if 普通头像（无链接） -->
    <mu-button
      class="avatar-btn"
      fab
      v-if="user && !isLink"
    >
      <mu-avatar
        v-if="user && user.avatar"
        text-color="#fff"
        :size="size"
      >
        <img :src="user && user.avatar">
      </mu-avatar>
      <mu-avatar
        v-else
        text-color="#fff"
        :size="size"
      >
        <img :src="`/img/default-avatar/avatar-${defaultAvatarNum}.jpg`">
      </mu-avatar>
    </mu-button>

    <!-- else 带链接的头像 -->
    <router-link
      v-else-if="user && isLink"
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
          size="36"
        >
          <img :src="user && user.avatar">
        </mu-avatar>
        <mu-avatar
          v-else
          text-color="#fff"
          size="36"
        >
          <img :src="`/img/default-avatar/avatar-${defaultAvatarNum}.jpg`">
        </mu-avatar>
      </mu-button>
    </router-link>

</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { UserBrief, UserDetail, OtherUserDetail } from "@/assets/js/dataType";
import { hashId2DetaultAvatar } from "@/utils/hash";

@Component({
  components: {}
})
export default class UserAvatar extends Vue {
  // Props
  @Prop({
    required: false
  })
  user!: UserBrief | UserDetail | OtherUserDetail;

  @Prop({
    type: Boolean,
    default: true,
    required: false
  })
  isLink!: boolean;

  @Prop({
    type: Number,
    default: 36,
    required: false
  })
  size!: number;

  // Computed
  // 默认头像名为avatar-n.jpg，n为id的哈希数值（1-64）
  get defaultAvatarNum(): number {
    return this.user && this.user._id
      ? hashId2DetaultAvatar(this.user._id, 64)
      : 1;
  }

  // Lifecycle
  private mounted() {}
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
