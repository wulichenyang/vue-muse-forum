<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { UserDetail } from "@/assets/js/dataType";

@Component
export default class UserDetailMixin extends Vue {
  @Getter("userDetail") userDetail!: UserDetail | null;
  @Action("getUser") getUser: any;
}
</script>
