<template>
  <div
    v-show="ifShow"
    class="user-option"
  >
    user-option
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";

@Component({
  components: {}
})
export default class UserOption extends Vue {
  // Props
  @Prop({
    type: [Boolean],
    default: false,
    required: true
  })
  ifShow!: boolean;

  // Lifecycle
  mounted() {}
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.user-option {
  margin-right: 36px;
  display: flex;
  align-items: center;
}
</style>
