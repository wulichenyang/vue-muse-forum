<template>
  <section class="user-fans">

    <!-- 粉丝列表 -->
    <section class="user-fans-wrapper">
      <!-- 空白内容提示条 -->
      <TipBar
        :ifShow="userFanIds(otherUserId) && userFanIds(otherUserId).length === 0"
        text="还没有粉丝哟"
      ></TipBar>

      <Fan
        :isFan="true"
        :key="fanId"
        v-for="fanId in userFanIds(otherUserId)"
        :userFansBrief="userFanMap[fanId]"
        @emitToggleFollowUser="onToggleFollowUser"
      >
      </Fan>
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
import Fan from "@/components/Fan/Fan.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import ContainerInner from "@/components/ContainerInner.vue";
import { UserFansBrief } from "@/assets/js/dataType";
import { UserDetail } from "@/assets/js/dataType";

import Toast from "muse-ui-toast";
import To from "@/utils/to";
import { FollowPayload } from "@/api/follow";
import { UserFansBriefMap } from "@/store/modules/fans";
import TipBar from "@/components/TipBar.vue";

@Component({
  components: {
    Fan,
    TipBar
  }
})
export default class UserFansView extends Vue {
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
    if ((this.userFanIds(this.otherUserId) as any).length === 0) {
      this.getFansOfOtherUser();
    }
  }
  // Methods
  async getFansOfOtherUser() {
    // Vuex里没有当前用户的粉丝列表，请求数据
    await this.getUserFanList({
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
  @Getter("userFanIds") userFanIds!: (userId: string) => Promise<string[]>;
  @Action("toggleUserFansFollow") toggleUserFansFollow!: (
    payload: FollowPayload
  ) => Promise<boolean>;
  @Action("getUserFanList") getUserFanList: any;
  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";

.user-fans {
  .user-fans-wrapper {

  }
}

// @media screen and (min-width: 576px) {
//   .user-fans {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .user-fans {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .user-fans {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .user-fans {
//     max-width: 1024px;
//   }
// }
</style>
