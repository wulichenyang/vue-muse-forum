<template>
  <!-- 关注用户列表 -->
  <section class="user-follows-users">
    <!-- 空白内容提示条 -->
    <TipBar
      :ifShow="userFollowUserIds(otherUserId) && userFollowUserIds(otherUserId).length === 0 && !this.ifLoading"
      text="还没有关注用户哟"
    ></TipBar>
    <Fan
      :isFan="false"
      :key="fanId"
      v-for="fanId in userFollowUserIds(otherUserId)"
      :userFansBrief="userFanMap[fanId]"
      @emitToggleFollowUser="onToggleFollowUser"
    >
    </Fan>
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
import Fan from "@/components/Fan/Fan.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import ContainerInner from "@/components/ContainerInner.vue";
import { UserFansBrief } from "@/assets/js/dataType";
import { UserDetail } from "@/assets/js/dataType";
import TipBar from "@/components/TipBar.vue";
import Toast from "muse-ui-toast";
import To from "@/utils/to";
import { FollowPayload } from "@/api/follow";
import { UserFansBriefMap } from "@/store/modules/fans";

@Component({
  components: {
    Fan,
    ContainerInner,
    TipBar
  }
})
export default class UserFollowsUsersView extends Vue {
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
  userFansList: Array<UserFansBrief> = [];

  // Computed
  get otherUserId() {
    return this.$route.params.id;
  }

  // Lifecycle
  private mounted() {
    if ((this.userFollowUserIds(this.otherUserId) as any).length === 0) {
      this.getFollowUsers();
    }
  }
  // Methods
  async getFollowUsers() {
    // Vuex里没有当前用户的关注用户列表，请求数据
    await this.getFollowUserList({
      userId: this.otherUserId,
      loginUserId: this.userDetail && this.userDetail._id
    });
  }

  onToggleFollowUser(payload: FollowPayload) {
    const { targetId, type } = payload;
    //
    this.toggleUserFansFollow({
      targetId,
      type
    });
  }

  @Getter("userDetail") userDetail!: UserDetail | null;
  @Getter("userFanMap") userFanMap!: Promise<UserFansBriefMap>;
  @Getter("userFollowUserIds") userFollowUserIds!: (
    userId: string
  ) => Promise<string[]>;
  @Getter("ifLoading") ifLoading!: any;

  @Action("toggleUserFansFollow") toggleUserFansFollow!: (
    payload: FollowPayload
  ) => Promise<boolean>;
  @Action("getFollowUserList") getFollowUserList: any;
  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../../../assets/css/var.scss";

.user-follows-users {
}

// @media screen and (min-width: 576px) {
//   .user-follows-users {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-follows-users {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-follows-users {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-follows-users {
//     max-width: 1024px;
//   }
// }
</style>
