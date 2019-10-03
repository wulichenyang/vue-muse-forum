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
          v-for="(item, index) in breadcrumbs"
          :to="item.link"
          :key="item.text"
          :disabled="index === breadcrumbs.length - 1"
        >
          {{item.text}}
        </mu-breadcrumbs-item>
      </mu-breadcrumbs>

    </section>

    <!-- 文章分类具体内容 -->
    <section>
      <router-view
        v-on:toAdd="toAdd"
        v-on:toEdit="toEdit"
      ></router-view>
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
import To from "@/utils/to";
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
    this.initBreadcrumbs();
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
  initBreadcrumbs() {
    if (this.$route.fullPath.includes("add")) {
      this.breadcrumbs.splice(2, 1, {
        text: "添加分类"
      });
    } else if (this.$route.fullPath.includes("edit")) {
      this.breadcrumbs.splice(2, 1, {
        text: "编辑分类"
      });
    }
  }

  toEdit() {
    this.breadcrumbs.splice(2, 1, {
      text: "编辑分类"
    });
  }

  toAdd() {
    this.breadcrumbs.splice(2, 1, {
      text: "添加分类"
    });
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
      if (fromPath.includes("/add") || fromPath.includes("edit")) {
        this.breadcrumbs.splice(this.breadcrumbs.length - 1, 1);
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../../assets/css/var.scss";
.admin-category {
  margin: 5px;
}
</style>
