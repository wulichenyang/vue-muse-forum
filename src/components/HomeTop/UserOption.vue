<template>
  <div class="user-option">
    user-option
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { } from "@/assets/js/dataType";

@Component({
  components: { 
    
  }
})
export default class UserOption extends Vue {
  // @Getter("userDetail") userDetail!: UserDetail | null;
  // @Action("getUser") getUser: any;

  // Lifecycle
  mounted() {

  }
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
 .user-option {
   display: flex;
   align-items: center;
}
</style>
