<template>
  <section
    class="user-posts"
    ref="container"
  >
    <!-- 骨架屏 -->
    <Skeleton :ifShow="userPostIds(otherUserId) && userPostIds(otherUserId).length === 0 && this.ifLoading"></Skeleton>

    <!-- 空白内容提示条 -->
    <TipBar
      :ifShow="userPostIds(otherUserId) && userPostIds(otherUserId).length === 0 && !this.ifLoading"
      text="还没有发帖哟"
    ></TipBar>
    <!-- 无限滚动动态请求 -->
    <mu-load-more
      :class="this.loading ? '' : 'hid-scroll'"
      color="primary"
      @refresh="refresh"
      :refreshing="refreshing"
      :loading="loading"
      @load="load"
    >
      <Post
        v-for="postId in userPostIds(otherUserId)"
        :key="postId"
        :postBrief="postBriefMap(otherUserId)[postId]"
        @emitTogglePostLike="onTogglePostLike"
      />
    </mu-load-more>
    <!-- 加载完毕提示栏 -->
    <TipBar
      :ifShow="this.userToPostListPageRequestPayloadMap(this.otherUserId) && this.userToPostListPageRequestPayloadMap(this.otherUserId).noMore && userPostIds(otherUserId) && userPostIds(otherUserId).length !== 0"
      text="已经到底啦"
    ></TipBar>

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
import Post from "@/components/Post/Post.vue";
import Toast from "muse-ui-toast";
import To from "@/utils/to";
import { fetchPostsOfOtherUser } from "@/api/post";
import { PostBrief } from "@/assets/js/dataType";
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
export default class UserPostsView extends Mixins(OtherUserMixin, LoadingMixin, UserDetailMixin) {
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
  // userPostList: Array<PostBrief> = [];
  // 请求时的标志
  refreshing: boolean = false;
  loading: boolean = false;

  // Computed

  // Lifecycle
  private mounted() {
    this.getPostsIfNoCache();
  }
  // private activated() {
  //   this.getPostsIfNoCache();
  // }

  // Methods
  private async refresh() {
    this.refreshing = true;
    (this.$refs.container as Element).scrollTop = 0;
    this.resetUserToPostListPage({
      userId: this.otherUserId
    });
    await this.refreshUserToPostList({
      userId: this.otherUserId,
      loginUserId: this.userDetail && this.userDetail._id,
      pageRequestPayload: this.userToPostListPageRequestPayloadMap(
        this.otherUserId
      )
    });

    this.refreshing = false;
  }
  private async load() {
    // 还有更多的数据，可以请求
    if (
      !this.userToPostListPageRequestPayloadMap(this.otherUserId).noMore &&
      !this.refreshing
    ) {
      this.loading = true;

      this.addUserToPostListPage({
        userId: this.otherUserId
      });

      let res = await this.getUserPostList({
        userId: this.otherUserId,
        loginUserId: this.userDetail && this.userDetail._id,
        pageRequestPayload: this.userToPostListPageRequestPayloadMap(
          this.otherUserId
        )
      });

      this.loading = false;
    }
  }

  async getPostsIfNoCache() {
    if (
      !this.userPostIds(this.otherUserId) ||
      this.userPostIds(this.otherUserId).length === 0
    ) {
      // Vuex里没有当前文章列表ids，请求数据
      await this.getUserPostList({
        userId: this.otherUserId,
        loginUserId: this.userDetail && this.userDetail._id,
        pageRequestPayload: this.userToPostListPageRequestPayloadMap(
          this.otherUserId
        )
      });
    }
  }

  onTogglePostLike(payload: PostLikePayload) {
    const { targetId, type, authorId } = payload;

    console.log(targetId, type, authorId);

    this.toggleBriefPostLike({
      targetId,
      type,
      authorId
    });
  }
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  // @Getter("userDetail") userDetail!: UserDetail | null;
  @Getter("postBriefMap") postBriefMap!: any;
  @Getter("userPostIds") userPostIds!: any;
  @Getter("userToPostListPageRequestPayloadMap")
  userToPostListPageRequestPayloadMap!: any;

  @Action("addUserToPostListPage") addUserToPostListPage: any;
  @Action("noMoreDataUserToPostListPage") noMoreDataUserToPostListPage: any;
  @Action("resetUserToPostListPage") resetUserToPostListPage: any;
  @Action("refreshUserToPostList") refreshUserToPostList: any;
  @Action("getUserPostList") getUserPostList: any;
  @Action("toggleBriefPostLike") toggleBriefPostLike: any;
  // @Action("getUser") getUser: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";

.user-posts {
}

// @media screen and (min-width: 576px) {
//   .user-posts {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-posts {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-posts {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-posts {
//     max-width: 1024px;
//   }
// }
</style>
