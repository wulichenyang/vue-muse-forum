<template>
  <mu-container>
    <ContainerInner class="user-detail-wrapper">
      <!-- 用户头部信息 -->
      <header class="user-header">

        <!-- 头像 -->
        <UserAvatar
          :user="otherUser"
          :isLink="false"
          :size="120"
        />

        <!-- 编辑资料按钮 -->
        <router-link
          v-if="userDetail && userDetail._id && otherUser && otherUser._id === userDetail._id"
          to="/user/settings"
        >
          <mu-button
            flat
            small
            class="edit-setting-btn empty-btn"
            color="pink400"
          >
            编辑资料
          </mu-button>
        </router-link>

        <!-- 昵称 -->
        <h3>
          {{otherUser && otherUser.nickname}}
          <mu-icon value=":mudocs-icon-action-boy"></mu-icon>
        </h3>

        <!-- 个人简介 -->
        <p v-if="otherUser && otherUser.brief">{{otherUser && otherUser.brief}}</p>
        <p v-else>TA还没有个人简介哦~</p>

        <!-- 关注/私信 按钮 -->
        <!-- 用户非本人时可见 -->
        <section v-if="otherUser && userDetail && otherUser._id !== userDetail._id || otherUser && !userDetail">
          <mu-button
            v-if="otherUser.ifFollow"
            small
            color="primary"
            class="follow-btn"
            @click="onToggleFollowUser(
            otherUser._id,
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
            @click="onToggleFollowUser(
            otherUser._id,
            'user'
          )"
          >
            <mu-icon value="add"></mu-icon>
            关注
          </mu-button>

          <mu-button
            small
            color="secondary"
            @click="onMessageTo"
          >
            <mu-icon
              value="mail"
              class="mail-icon"
            ></mu-icon>
            私信
          </mu-button>
        </section>
      </header>

      <!-- TABS -->
      <mu-tabs
        :value.sync="activeTabIndex"
        inverse
        color="secondary"
        text-color="rgba(0, 0, 0, .54)"
        center
      >
        <mu-tab
          @click="toPage(tab.route)"
          v-for="tab in tabs"
          :key="tab.route"
        >
          {{tab.name}}{{thisTabCount(tab.name)}}
        </mu-tab>

      </mu-tabs>

      <!-- 用户关注、文章等信息 -->
      <keep-alive include="UserPostsView">
        <router-view></router-view>
      </keep-alive>

    </ContainerInner>
  </mu-container>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Emit,
  Model,
  Watch,
  Mixins
} from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { OtherUserDetail } from "@/assets/js/dataType";
import UserAvatar from "@/components/UserAvatar.vue";
import ContainerInner from "@/components/ContainerInner.vue";
import Toast from "muse-ui-toast";
import To from "@/utils/to";
import { FollowTargetType } from "@/api/follow";
import OtherUserMixin from "@/mixins/OtherUserMixin.vue";
import UserDetailMixin from "@/mixins/UserDetailMixin.vue";
import CheckLoginMixin from "@/mixins/CheckLoginMixin.vue";

@Component({
  components: {
    ContainerInner,
    UserAvatar
  }
})
export default class UserView extends Mixins(
  OtherUserMixin,
  UserDetailMixin,
  CheckLoginMixin
) {
  // Props
  // @Prop({
  //   type: String,
  //   default: [],
  //   required: true,
  // })
  // list!: string;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data
  activeTabIndex: number = 0;
  tabs: Array<any> = [
    {
      route: "userPosts",
      name: "文章"
    },
    {
      route: "userComments",
      name: "评论"
    },
    {
      route: "userFans",
      name: "粉丝"
    },
    {
      route: "userFollows",
      name: "关注"
    },
    {
      route: "userCollections",
      name: "收藏"
    }
  ];

  tabIndexMap: any = {
    posts: 0,
    comments: 1,
    fans: 2,
    follows: 3,
    followPosts: 3,
    followCategories: 3,
    followUsers: 3,
    collections: 4
  };

  // Computed
  get otherUser() {
    return this.otherUserDetail(this.otherUserId);
  }

  // Lifecycle
  private mounted() {
    // 更新 tab 样式
    this.updateTabIndex();

    // 获取查看任意用户信息
    this.getUserInfoWhenNotSaved();
  }

  // Methods
  updateTabIndex() {
    this.activeTabIndex = this.tabIndexMap[
      (this.$route.path.split("/") as Array<any>).pop()
    ];
  }

  toPage(route: string) {
    this.$router.push({
      name: route
    });
  }

  thisTabCount(tabName: string) {
    switch (tabName) {
      case "文章":
        return this.otherUser && this.otherUser.postCount;
        break;
      case "评论":
        return this.otherUser && this.otherUser.commentCount;
        break;
      case "粉丝":
        return this.otherUser && this.otherUser.fansCount;
      case "关注":
        return (
          this.otherUser &&
          this.otherUser.followPeopleCount +
            this.otherUser.followCategoryCount +
            this.otherUser.followPostCount
        );
        break;
      case "收藏":
        return this.otherUser && this.otherUser.collectPostCount;
        break;
      default:
        return "";
        break;
    }
  }

  onToggleFollowUser(targetId: string, type: FollowTargetType) {
    if (this.ifLogin()) {
      this.toggleUserFollow({
        targetId,
        type
      });
    }
  }

  getUserInfoWhenNotSaved() {
    if (!this.otherUser) {
      this.getOtherUserDetail({
        targetUserId: this.otherUserId,
        fromUserId: this.userDetail && this.userDetail._id
      });
    }
  }

  onMessageTo() {
    if (this.ifLogin()) {
    }
  }
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  @Getter("otherUserDetail") otherUserDetail!: any;
  @Action("getOtherUserDetail") getOtherUserDetail: any;
  @Action("toggleUserFollow") toggleUserFollow: any;
  // @Action("getUser") getUser: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  @Watch("$route", { immediate: true, deep: true })
  onRouteChange(val: string, oldVal: string) {
    if (oldVal !== val && (val as any).fullPath.endsWith("posts")) {
      // 重置tab
      this.activeTabIndex = 0;
    }
    // 获取查看任意用户信息
    this.getUserInfoWhenNotSaved();

    if (oldVal !== val) {
      this.updateTabIndex();
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";

.user-detail-wrapper {
  padding: 0;
  // Phone
  margin-top: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;

  text-align: center;
  .user-header {
    position: relative;
    // Phone
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;

    background: url("/img/user-header-bg.jpg");
    background-size: cover;
    background-position-y: center;
    padding-bottom: 28px;
    .avatar-btn {
      margin-top: -20px;
      border: 2px solid #fff;
    }
    .edit-setting-btn {
      position: absolute;
      right: 20px;
      top: 20px;
    }
    h3 {
    }
    p {
    }

    .follow-btn {
      margin-right: 12px;
    }
    .mail-icon {
      margin-right: 2px;
    }
  }
}

@media screen and (min-width: 576px) {
  .user-detail-wrapper {
    margin-top: 36px;
    .user-header {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
}
// @media screen and (min-width: 768px) {
//   .user-detail-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-detail-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-detail-wrapper {
//     max-width: 1024px;
//   }
// }
</style>
