<template>
  <section class="user-posts">
    <Post
      v-for="postId in userPostIds(otherUserId)"
      :key="postId"
      :postBrief="userPostBriefMap(otherUserId)[postId]"
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
  Watch
} from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";
import UserAvatar from "@/components/UserAvatar.vue";
import ContainerInner from "@/components/ContainerInner.vue";
import Post from "@/components/Post/Post.vue";
import Toast from "muse-ui-toast";
import To from "@/utils/to";
import { fetchPostsOfOtherUser } from "@/api/post";
import { PostBrief } from "@/assets/js/dataType";
import { UserDetail } from "@/assets/js/dataType";
import { PostLikePayload } from "@/components/Post/Post.vue";

@Component({
  components: {
    Post
  }
})
export default class UserPostsView extends Vue {
  // Props
  // @Prop({
  //   type: String,
  //   default: [],
  //   required: true,
  // })
  // list!: string;
  @Getter("userDetail") userDetail!: UserDetail | null;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data
  userPostList: Array<PostBrief> = [];

  // Computed
  get otherUserId() {
    return this.$route.params.id;
  }

  // Lifecycle
  private mounted() {
    if (!this.userPostBriefMap(this.otherUserId)) {
      this.getPostsOfOtherUser();
    }
  }

  // Methods
  async getPostsOfOtherUser() {
    // Vuex里没有当前用户的文章列表，请求数据
    await this.getUserPostList({
      userId: this.otherUserId,
      loginUserId: this.userDetail && this.userDetail._id
    });
  }

  onTogglePostLike(payload: PostLikePayload) {
    const { targetId, type, categoryId, authorId } = payload;

    console.log(     
      targetId,
      type,
      categoryId,
      authorId)

    this.toggleUserBriefPostLike({
      targetId,
      type,
      categoryId,
      authorId
    });
  }
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  // @Getter("userDetail") userDetail!: UserDetail | null;
  @Getter("userPostBriefMap") userPostBriefMap!: any;
  @Getter("userPostIds") userPostIds!: any;

  @Action("getUserPostList") getUserPostList: any;
  @Action("toggleUserBriefPostLike") toggleUserBriefPostLike: any;
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
