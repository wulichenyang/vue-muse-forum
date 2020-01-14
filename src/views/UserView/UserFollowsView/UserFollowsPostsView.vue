<template>
  <!-- 用户关注文章 -->
  <section class="user-follows-posts">
    <!-- 骨架屏 -->
    <Skeleton :ifShow="userFollowPostIds(otherUserId) && userFollowPostIds(otherUserId).length === 0 && this.ifLoading"></Skeleton>

    <!-- 空白内容提示条 -->
    <TipBar
      :ifShow="userFollowPostIds(otherUserId) && userFollowPostIds(otherUserId).length === 0 && !this.ifLoading"
      text="还没有关注文章哟"
    ></TipBar>
    <Post
      v-for="postId in userFollowPostIds(otherUserId)"
      :key="postId"
      :postBrief="postBriefMap(otherUserId)[postId]"
      @emitTogglePostLike="onTogglePostLike"
    />
  </section>
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
import UserAvatar from "@/components/UserAvatar.vue";
import ContainerInner from "@/components/ContainerInner.vue";
import Toast from "muse-ui-toast";
import To from "@/utils/to";
import Post from "@/components/Post/Post.vue";
import { PostLikePayload } from "@/components/Post/Post.vue";
import TipBar from "@/components/TipBar.vue";
import Skeleton from '@/components/Skeleton.vue'
import OtherUserMixin from '@/mixins/OtherUserMixin.vue'
import LoadingMixin from '@/mixins/LoadingMixin.vue'
import UserDetailMixin from '@/mixins/UserDetailMixin.vue'

@Component({
  components: {
    Post,
    TipBar,
    Skeleton
  }
})
export default class UserFollowsPostsView extends Mixins(OtherUserMixin, LoadingMixin, UserDetailMixin) {
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

  // Computed

  // Lifecycle
  private mounted() {
    this.getUserFollowPostsIfNoCache();
  }

  // Methods
  async getUserFollowPostsIfNoCache() {
    if (
      !this.userFollowPostIds(this.otherUserId) ||
      this.userFollowPostIds(this.otherUserId).length === 0
    ) {
      // Vuex里没有当前文章列表ids，请求数据
      await this.getUserFollowPostList({
        userId: this.otherUserId,
        loginUserId: this.userDetail && this.userDetail._id
      });
    }
  }

  onTogglePostLike(payload: PostLikePayload) {
    const { targetId, type, authorId } = payload;
    this.toggleBriefPostLike({
      targetId,
      type,
      authorId
    });
  }

  @Getter("postBriefMap") postBriefMap!: any;
  @Getter("userFollowPostIds") userFollowPostIds!: any;

  @Action("getUserFollowPostList") getUserFollowPostList: any;

  @Action("toggleBriefPostLike") toggleBriefPostLike: any;

  // @Action("getUser") getUser: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../../../assets/css/var.scss";

.user-follows-posts {
}

// @media screen and (min-width: 576px) {
//   .user-follows-posts {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-follows-posts {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-follows-posts {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-follows-posts {
//     max-width: 1024px;
//   }
// }
</style>
