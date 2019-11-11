<template>
  <!-- 文章简单信息 -->
  <router-link
    class="fan-link"
    :to="`/users/${userFansBrief &&userFansBrief.userId && userFansBrief.userId._id}`"
  >
    <article class="fan-wrapper">

      <!-- 粉丝信息 -->
      <router-link
        class="left-user-brief"
        :to="`/users/${userFansBrief && userFansBrief.userId && userFansBrief.userId._id}`"
      >

        <!-- 头像 -->
        <UserAvatar
          class="user-avatar"
          :user="userFansBrief && userFansBrief.userId"
        />

      </router-link>

      <!-- 中间主要信息部分 -->

      <!-- 中间主要信息部分 -->
      <section class="middle-wrapper">
        <!-- 用户昵称 -->
        <h3>{{userFansBrief && userFansBrief.userId && userFansBrief.userId.nickname}}</h3>

        <!-- 用户简介 -->
        <p>{{userFansBrief && userFansBrief.userId && userFansBrief.userId.brief}}123</p>

      </section>

      <!-- 右边关注按钮部分 -->
      <section class="right-wrapper">
        <mu-button
          v-if="userFansBrief && userDetail && userFansBrief.userId._id !== userDetail._id || userFansBrief && userFansBrief.userId && !userDetail"
          small
          color="primary"
          class="follow-btn"
          @click.prevent="onToggleFollowUser(
            userFansBrief.userId._id,
            'user'
          )"
        >{{userFansBrief.ifFollow ? '已关注':'关注'}}</mu-button>
      </section>

    </article>
  </router-link>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Emit,
  Model,
  Watch
} from "vue-property-decorator";
import UserAvatar from "@/components/UserAvatar.vue";
import { dateDiff } from "@/utils/time";
import { formatNumber } from "@/utils/format";
import getPy from "@/utils/nameToPinyin";
import { Getter, Action } from "vuex-class";
import { UserFansBrief } from "@/assets/js/dataType";
import { LikeTargetType } from "@/api/like";
import { hashId2DetaultAvatar } from "@/utils/hash";
import { UserDetail } from "@/assets/js/dataType";
import { FollowPayload } from "@/api/follow";
import { FollowTargetType } from "@/api/follow";

export interface FanLikePayload {
  targetId: string;
  type: string;
  categoryId: string;
  authorId: string;
}

@Component({
  components: { UserAvatar }
})
export default class Fan extends Vue {
  // Props
  @Prop({
    type: Object,
    default: {},
    required: true
  })
  userFansBrief!: UserFansBrief;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data
  // searchValue: string = "";
  // ifFocusSearch: boolean = false;

  // Computed
  // 默认头像名为avatar-n.jpg，n为id的哈希数值（1-64）
  get defaultAvatarNum(): number {
    return this.userFansBrief.userId && this.userFansBrief.userId._id
      ? hashId2DetaultAvatar(this.userFansBrief.userId._id, 64)
      : 1;
  }

  // Lifecycle
  private mounted() {}

  // Methods
  onToggleFollowUser(targetId: string, type: FollowTargetType) {
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }

    this.emitToggleFollowUser({
      targetId,
      type
    });

    console.log("follow user");
    return;
  }

  @Emit("emitToggleFollowUser")
  emitToggleFollowUser(payload: FollowPayload) {}
  @Getter("userDetail") userDetail!: UserDetail | null;
  @Getter("isLogin") isLogin!: boolean | null;
  @Action("openLoginDialog") openLoginDialog: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.fan-link {
  text-align: left;
  display: block;

  .fan-wrapper {
    display: flex;
    background: $mainContainerBgColor;
    transition: 0.3s all;
    // Phone
    padding: $postPhonePadding;
    border-radius: $phoneMainWrapperBorderRadius;
    &:hover {
      transform: scale(1.01);
      box-shadow: $postBoxShadowColor;
      transition: 0.3s all;
    }

    // 用户信息
    .left-user-brief {
      margin-right: 18px;
      display: flex;
      align-items: center;
      .mu-button.avatar-btn {
        .mu-button-wrapper {
          .mu-avatar {
            width: $fansAvatarSize !important;
            height: $fansAvatarSize !important;
          }
        }
      }
    }

    // 中间主要信息
    .middle-wrapper {
      flex: 1;
      h3 {
        // Phone
        margin: 0 0 10px 0;
      }
      p {
        margin: 0;
      }
    }
    // 右部按钮信息
    .right-wrapper {
      margin-left: 10px;
      align-items: center;
      display: flex;
      max-width: 110px;
    }
  }
}

@media screen and (min-width: 576px) {
  .fan-link {
    .fan-wrapper {
      border-radius: $mainWrapperBorderRadius;
      .fans-main-wrapper {
        // 中间主要信息
        .middle-wrapper {
          h3 {
            margin: 0 0 16px 0;
          }
        }

        // 右边关注按钮
        .right-wrapper {
        }
      }
    }
  }
}
// @media screen and (min-width: 768px) {
//   .fan-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .fan-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .fan-wrapper {
//     max-width: 1024px;
//   }
// }
</style>