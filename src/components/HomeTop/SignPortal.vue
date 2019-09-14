<template>
  <div
    v-show="ifShow"
    class="sign-portal"
  >
    <a
      @click="onShowSignIn"
      class="sign-in"
    >登录</a>
    <a
      @click="onShowSignUp"
      class="sign-up"
    >注册</a>
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
    type: [Boolean],
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
  .sign-in {
    margin-right: 18px;
  }
  .sign-up {
  }
}
</style>
