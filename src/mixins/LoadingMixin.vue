<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";

@Component
export default class LoadingMixin extends Vue {
  @Getter("ifLoading") ifLoading!: boolean;
  @Action("closeLoading") closeLoading: any;
}
</script>
