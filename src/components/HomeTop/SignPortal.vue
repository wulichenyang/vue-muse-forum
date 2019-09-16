<template>
  <div
    v-show="ifShow"
    class="sign-portal"
  >
    <mu-button
      @click="onShowSignIn"
      class="sign-in"
      flat
    >
      登录
    </mu-button>
    <mu-button
      @click="onShowSignUp"
      class="sign-up"
      flat
    >
      注册
    </mu-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";

@Component({
  components: {}
})
export default class SignPortal extends Vue {
  // Props
  @Prop({
    type: Boolean,
    default: false,
    required: true
  })
  ifShow!: boolean;

  // Lifecycle
  mounted() {}

  // Methods
  onShowSignIn(): void {
    this.emitAlertSignIn();
  }

  onShowSignUp(): void {
    this.emitAlertSignUp();
  }

  @Emit("emitAlertSignIn")
  emitAlertSignIn() {}

  @Emit("emitAlertSignUp")
  emitAlertSignUp() {}
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.sign-portal {
  display: flex;
  align-items: center;
  margin-left: 36px;
  margin-right: 24px;
  .mu-flat-button {
    min-width: 45px;
  }
  .mu-button-wrapper {
    padding: 0 15px;
  }
  .mu-button {
    border-radius: 20px;
    overflow: hidden;
  }
  .sign-in,
  .sign-up {
    color: $linkFontColor;
  }
}
</style>
