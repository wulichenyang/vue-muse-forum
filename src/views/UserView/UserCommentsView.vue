<template>
  <section class="user-comments">

    <!-- 评论列表 -->
    <section class="comment-list-wrapper">

      <Comment
        :key="comment._id"
        v-for="comment in userCommentsList"
        :commentDetail="comment"
      ></Comment>

    </section>

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
import Comment from "@/components/Comment/Comment.vue";
import ContainerInner from "@/components/ContainerInner.vue";
import Toast from "muse-ui-toast";
import To from "@/utils/to";
import { UserDetail } from "@/assets/js/dataType";
import { CommentDetail } from "@/assets/js/dataType";
import { fetchCommentsOfOtherUser } from "@/api/comment";

@Component({
  components: {
    Comment
  }
})
export default class UserCommentsView extends Vue {
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
  userCommentsList: Array<CommentDetail> = [];

  // Data
  @Getter("userDetail") userDetail!: UserDetail | null;

  // Computed
  get otherUserId() {
    return this.$route.params.id;
  }

  // Lifecycle
  mounted() {
    this.getCommentsOfOtherUser();
  }

  // Methods
  async getCommentsOfOtherUser() {
    let err, res;
    if (this.userDetail && this.userDetail._id) {
      // 已登录，传入登录用户id，方便查询是否点赞
      [err, res] = await To(
        fetchCommentsOfOtherUser(this.otherUserId, this.userDetail._id)
      );
    } else {
      [err, res] = await To(fetchCommentsOfOtherUser(this.otherUserId));
    }
    if (err) {
      return false;
    }
    if (res && res.code === 0) {
      this.userCommentsList = res.data;
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

.user-comments {
  
}

// @media screen and (min-width: 576px) {
//   .user-comments {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-comments {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-comments {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-comments {
//     max-width: 1024px;
//   }
// }
</style>
