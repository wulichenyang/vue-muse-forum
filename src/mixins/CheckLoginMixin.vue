<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";

@Component
export default class CheckLoginMixin extends Vue {
  @Getter("isLogin") isLogin!: boolean | null;
  @Action("openLoginDialog") openLoginDialog: any;
  @Action("closeLoginDialog") closeLoginDialog: any;

  ifLogin() {
    if (!this.isLogin) {
      this.openLoginDialog();
      return false;
    } else {
      return true;
    }
  }
}
</script>
