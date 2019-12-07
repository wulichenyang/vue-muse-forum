<template>
  <!-- 文章简单信息 -->
  <router-link
    class="fan-link"
    :to="`/users/${getTargetUserId()}`"
  >
    <article class="fan-wrapper larger-item-hover ">

      <!-- 粉丝信息 -->
      <router-link
        class="left-user-brief"
        :to="`/users/${getTargetUserId()}`"
      >

        <!-- 头像 -->
        <UserAvatar
          class="user-avatar"
          :user="getTargetUser()"
        />

      </router-link>

      <!-- 中间主要信息部分 -->

      <!-- 中间主要信息部分 -->
      <section class="middle-wrapper">
        <!-- 用户昵称 -->
        <h3>{{getTargetUser() && getTargetUser().nickname}}</h3>

        <!-- 用户简介 -->
        <p>{{getTargetUser() && getTargetUser().brief}}</p>

      </section>

      <!-- 右边关注按钮部分 -->
      <!-- 非用户自身时可见 -->
      <section
        v-if="userFansBrief && userDetail && getTargetUserId() !== userDetail._id || getTargetUser() && !userDetail"
        class="right-wrapper"
      >
        <mu-button
          v-if="userFansBrief.ifFollow"
          small
          color="primary"
          class="follow-btn"
          @click.prevent="onToggleFollowUser(
            getTargetUserId(),
            'user'
          )"
        >
          <mu-icon value="done"></mu-icon>
          已关注
        </mu-button>
        <mu-button
          v-else
          small
          color="primary"
          class="follow-btn"
          @click.prevent="onToggleFollowUser(
            getTargetUserId(),
            'user'
          )"
        >
          <mu-icon value="add"></mu-icon>
          关注
        </mu-button>
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

  // 是粉丝还是被粉
  @Prop({
    type: Boolean,
    required: true
  })
  isFan!: boolean;

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
    return this.getTargetUserId()
      ? hashId2DetaultAvatar(this.getTargetUserId(), 64)
      : 1;
  }

  getTargetUserId() {
    return (
      this.userFansBrief &&
      this.userFansBrief.user &&
      this.userFansBrief.user._id
    );
  }

  getTargetUser() {
    return this.userFansBrief && this.userFansBrief.user;
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
    // Phone
    padding: $postPhonePadding;
    border-radius: $phoneMainWrapperBorderRadius;

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
