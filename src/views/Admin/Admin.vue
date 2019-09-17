<template>
  <section class="admin">
    <!-- 后台管理选项 -->
    <aside class="sidebar">
      <mu-appbar title=""></mu-appbar>
      <mu-drawer :open="ifshowSidebar">
        <mu-list>
          <mu-list-item
            button
            :ripple="false"
          >
            <mu-list-item-action>
              <mu-icon value="inbox"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>分类管理</mu-list-item-title>
          </mu-list-item>
          <mu-list-item
            button
            :ripple="false"
          >
            <mu-list-item-action>
              <mu-icon value="grade"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>文章管理</mu-list-item-title>
          </mu-list-item>
          <mu-list-item
            button
            :ripple="false"
          >
            <mu-list-item-action>
              <mu-icon value="send"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>评论管理</mu-list-item-title>
          </mu-list-item>
          <mu-list-item
            button
            :ripple="false"
          >
            <mu-list-item-action>
              <mu-icon value="drafts"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>用户管理</mu-list-item-title>
          </mu-list-item>
        </mu-list>
        <mu-divider></mu-divider>
        <mu-list>
          <mu-list-item
            button
            :ripple="false"
          >
            <mu-list-item-title>All mail</mu-list-item-title>
            <mu-list-item-action>
              <mu-icon value="info"></mu-icon>
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item
            button
            :ripple="false"
          >
            <mu-list-item-title>Trash</mu-list-item-title>
            <mu-list-item-action>
              <mu-icon value="info"></mu-icon>
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item
            button
            :ripple="false"
          >
            <mu-list-item-title>Spam</mu-list-item-title>
            <mu-list-item-action>
              <mu-icon value="info"></mu-icon>
            </mu-list-item-action>
          </mu-list-item>
          <mu-list-item
            button
            :ripple="false"
          >
            <mu-list-item-title>Follow up</mu-list-item-title>
            <mu-list-item-action>
              <mu-icon value="info"></mu-icon>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
      </mu-drawer>
    </aside>
    <!-- 当前管理内容 -->
    <main class="main">
      <router-view></router-view>
    </main>
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

@Component({
  components: {}
})
export default class Admin extends Vue {
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
  ifshowSidebar: boolean = true;
  // ifFocusSearch: boolean = false;

  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  mounted() {}

  // Methods
  changeOpen() {
    this.$emit("changeState", "参数");
  }

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
.admin {
  overflow: auto;
  .sidebar {
    margin-left: -36px;
    top: 0;
    position: fixed;
    .mu-appbar {
      height: $homeTopHeight;
      background-color: transparent;
      color: #fff;
    }
    .mu-drawer {
      width: $asideMenuWidth;
      height: calc(100vh - #{$homeTopHeight});
      position: relative;
      .mu-list {
        padding-top: 0;
      }
    }
  }
  .main {
    margin-left: $asideMenuWidth;
  }
}
</style>
