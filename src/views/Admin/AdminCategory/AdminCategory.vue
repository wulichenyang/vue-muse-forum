<template>
  <section class="admin-category">
    <!-- 头部导航 -->
    <section>
      <mu-breadcrumbs>
        <mu-icon
          value="chevron_right"
          slot="divider"
        ></mu-icon>
        <mu-breadcrumbs-item
          color="primary"
          v-for="(item, index) in breadcrumbs"
          :to="item.link"
          :key="item.text"
          :disabled="index === breadcrumbs.length - 1"
        >{{item.text}}</mu-breadcrumbs-item>
      </mu-breadcrumbs>
      <!-- 添加分类按钮 -->
      <mu-button
        @click="toAdd"
        fab
        color="primary"
      >
        <mu-icon value="add"></mu-icon>
      </mu-button>
    </section>

    <!-- 文章分类具体内容 -->
    <section>
      <router-view></router-view>
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

@Component({
  components: {}
})
export default class AdminCategory extends Vue {
  // Props
  // @Prop({
  //   default: [],
  //   required: true
  // })
  // list!: any;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data
  breadcrumbs: any = [
    {
      text: "分类管理",
      link: "/admin/categories"
    },
    {
      text: "所有分类",
      link: "/admin/categories"
    }
  ];
  // breadData: any = [
  //   {
  //     text: "分类管理",
  //     link: "/admin/categories",
  //     disabled: false
  //   },
  //   {
  //     text: "所有分类",
  //     link: "/admin/categories",
  //     disabled: true
  //   },
  //   {
  //     text: "添加分类",
  //     disabled: true
  //   },
  //   {
  //     text: "修改分类",
  //     disabled: true
  //   }
  // ];

  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  mounted() {
    console.log("mounded");
    if (this.$route.fullPath.includes("add")) {
      this.breadcrumbs.splice(2, 1, {
        text: "添加分类"
      });
    } else if (this.$route.fullPath.includes("update")) {
      this.breadcrumbs.splice(2, 1, {
        text: "修改分类"
      });
    }
    // this.breadcrumbs = [
    //   {
    //     text: "分类管理",
    //     link: "/admin/categories",
    //   },
    //   {
    //     text: "所有分类",
    //     link: "/admin/categories",
    //   }
    // ];
  }

  // Methods
  toAdd() {
    this.$router.push("/admin/categories/add");
    // 更新面包屑导航
    this.breadcrumbs.splice(2, 1, {
      text: "添加分类"
    });
    console.log(this.breadcrumbs);
  }
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  // @Getter("userDetail") userDetail!: UserDetail | null;

  // @Action("getUser") getUser: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  @Watch("$route", { immediate: true, deep: true })
  onRouterChanged(to: any, from: any) {
    if (from) {
      let fromPath = from.fullPath;
      if (fromPath.includes("/add") || fromPath.includes("update")) {
        this.breadcrumbs.splice(this.breadcrumbs.length - 1, 1);
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../../assets/css/var.scss";
.admin-category {
}
</style>
