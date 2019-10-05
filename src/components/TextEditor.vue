<template>
  <section class="text-editor">
    <!-- 标题 -->
    <h3 v-if="title">
      {{title}}
    </h3>

    <!-- 输入提交 -->
    <mu-form
      @click.stop
      ref="form"
      :model="form"
      class="mu-demo-form"
      label-position="top"
      label-width="100"
    >
      <section class="textarea-wrapper">

        <!-- 输入框表单 -->
        <mu-form-item
          prop="content"
          :rules="commentRules"
        >
          <mu-text-field
            @focus="onFocusTextEditor"
            prop="content"
            multi-line
            :rows="2"
            :placeholder="`输入${title}...`"
            :max-length="500"
            v-model="form.content"
          ></mu-text-field>
        </mu-form-item>

        <!-- emoji 和 提交按钮 -->
        <div
          v-show="ifShowTips"
          class="more-option"
        >

          <!-- emoji按钮 -->
          <mu-button
            small
            flat
            color="primary"
            class="left-emoji"
            @click="onEmoji()"
          >
            <mu-icon
              right
              value="tag_faces"
            ></mu-icon>
            表情
          </mu-button>

          <!-- 提交按钮 -->
          <div class="right-submit-wrapper">
            <span>Ctrl or ⌘ + Enter</span>
            <mu-button
              v-loading="submitting"
              small
              color="primary"
              class="right-submit"
              @click="onSubmit()"
            >
              {{title}}
            </mu-button>
          </div>

        </div>

      </section>

    </mu-form>
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
import { commentRules } from "@/utils/validate";

@Component({
  components: {}
})
export default class TextEditor extends Vue {
  // Props
  @Prop({
    type: String,
    default: "",
    required: true
  })
  title!: string;
  // 提交回调函数
  @Prop({
    type: Function,
    default: () => {},
    required: true
  })
  submitCallback!: Function;

  // @Model("onChange", {
  //   type: String
  // })
  // searchKey!: string;

  // Data
  // 表单
  form: any = {
    content: ""
  };
  // 正则验证
  commentRules: any = commentRules(this.title);
  // 展示输入框更多操作
  ifShowTips: boolean = false;
  // 提交状态标志
  submitting: boolean = false;

  // searchValue: string = "";
  // ifFocusSearch: boolean = false;

  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  mounted() {
    this.hiddenTipHandler();
  }

  destroyed() {
    this.removeHiddenTipHandler();
  }

  // Methods
  clearForm() {
    this.form = {
      content: ""
    };
  }

  onFocusTextEditor() {
    // 显示提交组件
    this.ifShowTips = true;
  }

  removeHiddenTipHandler() {
    document.body.removeEventListener("click", this.hiddenTips);
  }

  hiddenTipHandler() {
    // 点击外部，隐藏操作按钮，内部stop阻止冒泡
    document.body.addEventListener("click", this.hiddenTips, false);
  }

  hiddenTips() {
    this.ifShowTips = false;
  }

  // 选择表情
  onEmoji() {}

  // 提交
  async onSubmit() {
    // 已经提交了请求就不继续发送
    if (this.submitting) {
      return;
    }

    let isCheckOk = await (this.$refs.form as any).validate();
    if (isCheckOk) {
      console.log("ok");
      this.submitting = true;
      // 调用父组件回调，传入编辑框内容
      let isOk = await this.submitCallback(this.form.content);
      // 执行成功
      if (isOk) {
        // 关闭提交中标志
        this.submitting = false;
        // 清除表单
        this.clearForm();
        return;
      } else {
        // 执行失败
        // 关闭提交中标志
        this.submitting = false;
        return;
      }
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
@import "../assets/css/var.scss";
.text-editor {
  h3 {
    color: $linkFontColor;
    font-weight: lighter;
    text-align: center;
  }

  .textarea-wrapper {
    padding: 14px 20px;
    background: $mainBodyBgColor;
  }

  .more-option {
    display: flex;
    justify-content: space-between;
    .left-emoji {
      i {
        margin-left: 0;
      }
    }
    .right-submit-wrapper {
      span {
        color: $linkFontColor;
        margin-right: 12px;
      }
      .right-submit {
      }
    }
  }
}

// @media screen and (min-width: 576px) {
//   .text-editor {
//     max-width: 540px;
//   }
// }
// @media screen and (min-width: 768px) {
//   .text-editor {
//     max-width: 720px;
//   }
// }

// @media screen and (min-width: 992px) {
//   .text-editor {
//     max-width: 960px;
//   }
// }

// @media screen and (min-width: 1200px) {
//   .text-editor {
//     max-width: 1024px;
//   }
// }
</style>
