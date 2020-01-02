<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class OtherUserMixin extends Vue {
  // Computed
  get otherUserId() {
    return this.$route.params.id;
  }
}
</script>
