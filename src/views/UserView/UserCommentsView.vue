<template>
  <section class="user-comments">

    <!-- 评论列表 -->
    <section class="comment-list-wrapper">

      <Comment
        :key="commentId"
        v-for="commentId in userCommentIds(otherUserId)"
        :commentDetail="userCommentMap(otherUserId)[commentId]"
        @emitToggleCommentLike="onToggleCommentLike"
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
import { CommentLikePayload } from "@/components/Comment/Comment.vue";

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

  // Computed
  get otherUserId() {
    return this.$route.params.id;
  }

  // Lifecycle
  private mounted() {
    if (!this.userCommentMap(this.otherUserId)) {
      this.getCommentsOfOtherUser();
    }
  }

  // Methods
  async getCommentsOfOtherUser() {
    // Vuex里没有当前用户的评论列表，请求数据
    await this.getUserCommentList({
      userId: this.otherUserId,
      loginUserId: this.userDetail && this.userDetail._id
    });
  }

  onToggleCommentLike(payload: CommentLikePayload) {
    // const { targetId, type, authorId } = payload;
    // this.toggleCommentLike({
    //   targetId,
    //   type,
    //   authorId
    // });
  }
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }
  @Getter("userDetail") userDetail!: UserDetail | null;
  @Getter("userCommentMap") userCommentMap!: any;
  @Getter("userCommentIds") userCommentIds!: any;

  // @Getter("userDetail") userDetail!: UserDetail | null;

  @Action("getUserCommentList") getUserCommentList: any;
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
