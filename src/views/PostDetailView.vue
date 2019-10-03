<template>
  <mu-container>
    <ContainerInner>
      <article class="post-wrapper">
        <h2 class="post-title">{{postData.title}}</h2>
        <main
          class="post-content"
          v-html="postData.content"
        >
        </main>

      </article>
    </ContainerInner>
  </mu-container>
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
import ContainerInner from "@/components/ContainerInner.vue";
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";

@Component({
  components: {
    ContainerInner
  }
})
export default class PostDetailView extends Vue {
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
  // ifFocusSearch: boolean = false;

  // Computed
  get postIdNow() {
    return this.$route.params.id;
  }

  get postData() {
    return this.postDetail(this.postIdNow);
  }

  // Lifecycle
  mounted() {
    if (!this.postData || !this.postData._id) {
      this.initPostDetail();
    }
  }

  // Methods
  initPostDetail() {
    console.log(123)
    this.getPostDetail(this.postIdNow);
  }
  // selectSong(song: Song, index: number): void {
  //   this.select(song, index);
  // }

  @Getter("postDetail") postDetail!: any;

  @Action("getPostDetail") getPostDetail: any;

  // @Emit("select")
  // select(listItem: Song, index: number) {}

  // @Watch("child", { immediate: true, deep: true })
  // onChildChanged(val: string, oldVal: string) {}
}
</script>

<style lang="scss">
@import "../assets/css/var.scss";
.post-wrapper {
  .category-name {
    
  }
  .post-title {
    border-bottom: $postBottomBorder;
    margin-top: 0;
    padding-bottom: 10px;
  }
  main.post-content {
    // TODO: style for content
    margin-top: 10px;
    img {
      text-align: center;
      max-width: 80%;
    }
  }
}

// @media screen and (min-width: 576px) {
//   .post-wrapper {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .post-wrapper {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .post-wrapper {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .post-wrapper {
//     max-width: 1024px;
//   }
// }
</style>