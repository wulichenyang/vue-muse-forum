<template>
  <div
    v-if="ifShow"
    class="user-option"
  >
    <!-- 用户头像按钮 -->
    <!-- 头像 -->
    <UserAvatar
      class="user-avatar"
      :user="userDetail"
      @click.native="openMenuFun"
      ref="menuBtn"
      :isLink="false"
    />

    <!-- 弹出菜单 -->
    <mu-popover
      :open.sync="openMenu"
      :trigger="triggerMenu"
      @click="openMenu = !openMenu"
    >
      <mu-list>
        <!-- 管理员操作 -->
        <router-link
          to="/admin/categories"
          v-if="userDetail && userDetail.role==='admin'"
        >
          <mu-list-item button>
            <mu-list-item-action>
              <mu-icon value="add_box"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>后台管理</mu-list-item-title>
          </mu-list-item>
        </router-link>

        <!-- 用户操作 -->
        <router-link to="/newPost">
          <mu-list-item button>
            <mu-list-item-action>
              <mu-icon value="mode_edit"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>写文章</mu-list-item-title>
          </mu-list-item>
        </router-link>

        <mu-divider></mu-divider>

        <mu-list-item button>
          <mu-list-item-action>
            <mu-icon value="person"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>我的主页</mu-list-item-title>
        </mu-list-item>

        <mu-list-item button>
          <mu-list-item-action>
            <mu-icon value="favorite"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>我的关注</mu-list-item-title>
        </mu-list-item>

        <mu-list-item button>
          <mu-list-item-action>
            <mu-icon value="star"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>我的收藏</mu-list-item-title>
        </mu-list-item>

        <mu-divider></mu-divider>

        <mu-list-item button>
          <mu-list-item-action>
            <mu-icon value="settings"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>设置</mu-list-item-title>
        </mu-list-item>

        <mu-list-item button>
          <mu-list-item-action>
            <mu-icon value="info"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>关于</mu-list-item-title>
        </mu-list-item>

        <mu-divider></mu-divider>

        <mu-list-item
          @click="openAlertDialog"
          button
        >
          <mu-list-item-action>
            <mu-icon value="input"></mu-icon>
          </mu-list-item-action>
          <mu-list-item-title>退出</mu-list-item-title>
        </mu-list-item>

      </mu-list>
    </mu-popover>

    <!-- 确认退出模态框 -->
    <mu-dialog
      title="退出"
      width="360"
      max-width="80%"
      :open.sync="openAlert"
    >
      确认退出吗？
      <mu-button
        slot="actions"
        flat
        color="secondary"
        @click="closeAlertDialog"
      >取消</mu-button>
      <mu-button
        slot="actions"
        flat
        color="primary"
        @click="ensureSignout"
      >确定</mu-button>
    </mu-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { signOut } from "@/api/user";
import To from "@/utils/to";
import getPy from "@/utils/nameToPinyin";
import {} from "@/assets/js/dataType";
import cookie from "@/utils/cookie";
import { access_token } from "@/config";
import { hashId2DetaultAvatar } from "@/utils/hash";
import UserAvatar from "@/components/UserAvatar.vue";
import { UserDetail } from "@/assets/js/dataType";
@Component({
  components: { UserAvatar }
})
export default class UserOption extends Vue {
  // Props
  @Prop({
    type: Boolean,
    default: false,
    required: true
  })
  ifShow!: boolean;

  // 用户详细信息
  @Prop({
    default: <UserDetail>{},
    required: true
  })
  userDetail!: UserDetail | null;

  // Data
  openMenu: boolean = false;
  triggerMenu: any = null;
  // 退出确认框
  openAlert: boolean = false;

  // Lifecycle
  mounted() {
    // console.log(this.$refs.menuBtn)
    // mounted时，子组件还没有渲染出来
    // this.triggerMenu = (this.$refs.menuBtn as any).$el;
  }

  updated() {
    // mounted时，子组件还没有渲染出来
    if (!this.triggerMenu) {
      this.triggerMenu = (this.$refs.menuBtn as any).$el;
    }
  }

  // Computed

  // Methods
  openAlertDialog() {
    this.openAlert = true;
  }

  closeAlertDialog() {
    this.openAlert = false;
  }

  openMenuFun() {
    console.log(123)
    this.openMenu = !this.openMenu;
  }

  ensureSignout() {
    this.closeAlertDialog();
    this.signout();
    this.$router.push({ path: "/" });
  }

  async signout() {
    let err, res;
    [err, res] = await To(signOut());
    if (err) {
      return;
    }
    if (res && res.code === 0) {
      // 清除cookie里的token
      cookie.removeCookie(access_token);
      // 清除vuex里的用户信息
      this.clearUser();
    }
  }

  @Action("clearUser") clearUser: any;
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.user-option {
  // Phone
  margin-right: 10px;
  display: flex;
  align-items: center;
  .mu-button {
    width: $topAvatarSize;
    height: $topAvatarSize;
    background: transparent;
  }
}

@media screen and (min-width: 576px) {
  // Not Phone
  .user-option {
    margin-right: 36px;
  }
}
</style>
