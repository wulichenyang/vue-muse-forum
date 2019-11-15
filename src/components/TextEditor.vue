<template>
  <section
    class="text-editor"
    v-if="ifShowThis"
    @click="hiddenEmoji"
  >
    <!-- 标题 -->
    <h3 v-if="title && showTitle">
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

        <!-- 头像 -->
        <UserAvatar
          v-if="user"
          :user="user"
        ></UserAvatar>

        <!-- 表单 -->
        <div class="right-textarea">
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
              :placeholder="`${title}${toName ? `: ${toName}` : '...'}`"
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
              @click="onOpenEmoji()"
            >
              <mu-icon
                right
                value="tag_faces"
              ></mu-icon>
              表情
            </mu-button>
            <!-- 提交按钮 -->
            <div class="right-submit-wrapper">
              <span class="hiddenOnPhone">Ctrl or ⌘ + Enter</span>
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
          <!-- emoji picker-->
          <EmojiPicker
            @click.stop
            v-if="ifShowEmojiPicker"
            @select="selectEmoji"
            :data="emojiIndex"
          />

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
import { quillEditor } from "vue-quill-editor";
import { Getter, Action } from "vuex-class";
import { UserDetail } from "@/assets/js/dataType";
import To from "@/utils/to";
import { commentRules } from "@/utils/validate";
import { UserBrief } from "@/assets/js/dataType";
import UserAvatar from "@/components/UserAvatar.vue";
import { Picker as EmojiPicker, EmojiIndex, Emoji } from "emoji-mart-vue-fast";
import { emoji2Html } from "@/utils/emoji";
// import data from "emoji-mart-vue-fast/data/messenger.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { emojiIndex } from "../utils/emoji";

@Component({
  components: {
    UserAvatar,
    EmojiPicker,
    Emoji
  }
})
export default class TextEditor extends Vue {
  // Props
  // 标题
  @Prop({
    type: String,
    default: "",
    required: true
  })
  title!: string;

  // 评论/回复对象名
  @Prop({
    type: String,
    default: "",
    required: false
  })
  toName!: string;

  // 提交回调函数
  @Prop({
    type: Function,
    default: () => {},
    required: true
  })
  submitCallback!: Function;
  // 发表用户
  @Prop({
    required: false
  })
  user!: UserBrief;

  // 是否显示标题
  @Prop({
    type: Boolean,
    default: true,
    required: false
  })
  showTitle!: boolean;

  // 是否隐藏本身，当点击外部时
  @Prop({
    type: Boolean,
    default: false,
    required: false
  })
  hiddenWhenOutClick!: boolean;

  @Prop({
    type: Boolean,
    default: true,
    required: false
  })
  @Model("onShowThisChange")
  ifShowThis!: boolean;
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

  // 显示输入框更多操作
  ifShowTips: boolean = false;

  // 提交状态标志
  submitting: boolean = false;
  emoji2Html: any = emoji2Html;
  emojiIndex: any = emojiIndex;
  ifShowEmojiPicker: boolean = false;
  // searchValue: string = "";
  // ifFocusSearch: boolean = false;

  // Computed
  // get computedData() {
  //   return ' cc' + this.searchValue;
  // }

  // Lifecycle
  private mounted() {
    if (this.hiddenWhenOutClick) {
      this.hiddenThisHandler();
    }
    this.hiddenTipHandler();
    this.hiddenEmojiHandler();
  }

  destroyed() {
    if (this.hiddenWhenOutClick) {
      this.removeHiddenThisHandler();
    }
    this.removeHiddenTipHandler();
    this.removeHiddenEmojiHandler();
  }

  // Methods
  selectEmoji(emoji: any) {
    // const emojiHtml = this.emoji2Html(emoji);
    // console.log(this.emojiIndex.findEmoji(emoji.colons))
    this.form.content += emoji.colons;
    this.ifShowEmojiPicker = false;
  }

  clearForm() {
    this.form = {
      content: ""
    };
  }

  onFocusTextEditor() {
    // 显示提交组件
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }
    this.ifShowTips = true;
  }

  removeHiddenThisHandler() {
    document.body.removeEventListener("click", () => this.hiddenThis());
  }

  removeHiddenTipHandler() {
    document.body.removeEventListener("click", this.hiddenTips);
  }

  removeHiddenEmojiHandler() {
    document.body.removeEventListener("click", this.hiddenEmoji);
  }

  hiddenThisHandler() {
    // 点击外部，隐藏自身，内部stop阻止冒泡
    document.body.addEventListener("click", () => this.hiddenThis(), false);
  }

  hiddenTipHandler() {
    // 点击外部，隐藏操作按钮，内部stop阻止冒泡
    document.body.addEventListener("click", this.hiddenTips, false);
  }

  hiddenEmojiHandler() {
    // 点击外部，隐藏操作按钮，内部stop阻止冒泡
    document.body.addEventListener("click", this.hiddenEmoji, false);
  }

  hiddenThis() {
    this.onShowThisChange(false);
  }

  hiddenEmoji() {
    this.ifShowEmojiPicker = false;
  }

  hiddenTips() {
    this.ifShowTips = false;
  }

  // 弹出表情框
  onOpenEmoji() {
    this.ifShowEmojiPicker = !this.ifShowEmojiPicker;
  }

  // 提交
  async onSubmit() {
    // 如果未登录则弹出登录框
    if (!this.isLogin) {
      this.openLoginDialog();
      return;
    }

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
        // 隐藏该editor
        this.hiddenThis();
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

  @Getter("isLogin") isLogin!: boolean | null;
  @Action("openLoginDialog") openLoginDialog: any;

  @Emit("onShowThisChange")
  onShowThisChange(ifShowThis: boolean) {}

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
    display: flex;
    .right-textarea {
      flex: 1;
      .emoji-mart {
        margin-top: 10px;
        width: 100% !important;
        .emoji-mart-anchors {
          flex-wrap: wrap;
        }
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
          // Phone
          .hiddenOnPhone {
            display: none;
          }
          .right-submit {
          }
        }
      }
    }
  }
}

@media screen and (min-width: 576px) {
  .text-editor {
    .textarea-wrapper {
      .right-textarea {
        .more-option {
          .right-submit-wrapper {
            .hiddenOnPhone {
              display: initial;
            }
          }
        }
      }
    }
  }
}
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
