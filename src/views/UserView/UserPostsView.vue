<template>
  <section class="user-posts">
    <Post
      v-for="postBrief in userPostList"
      :key="postBrief._id"
      :postBrief="postBrief"
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
  mounted() {
    this.getPostsOfOtherUser();
  }

  // Methods
  async getPostsOfOtherUser() {
    let err, res;
    if (this.userDetail && this.userDetail._id) {
      // 已登录，传入登录用户id，方便查询是否点赞
      [err, res] = await To(fetchPostsOfOtherUser(this.otherUserId, this.userDetail._id));
    } else {
      [err, res] = await To(fetchPostsOfOtherUser(this.otherUserId));
    }
    if (err) {
      return false;
    }
    if (res && res.code === 0) {
      this.userPostList = res.data;
    }
  }
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  // @Getter("userDetail") userDetail!: UserDetail | null;

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
