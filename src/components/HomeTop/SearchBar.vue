<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="searchValue"
      @focus="onSearchFocus"
      @keydown="onSearchKeyDown($event)"
      :placeholder="placeholder"
    />
    <mu-button
      color="gray"
      icon
      @click="onClickSearch"
    >
      <mu-icon value="search"></mu-icon>
    </mu-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import {} from "@/assets/js/dataType";

@Component({
  components: {}
})
export default class SearchBar extends Vue {
  // Props
  @Prop({
    type: String,
    default: "",
    required: false
  })
  placeholder!: string;

  // Data
  searchValue: string = "";

  // Lifecycle
  private mounted() {}

  // Methods
  onSearchFocus(): void {
    // TODO:
    // 过渡动画class
  }

  onSearchKeyDown(e: any): void {
    // Enter键按下
    if (e.keyCode === 13 && this.searchValue) {
      this.emitOnSearch(this.searchValue);
    }
  }

  onClickSearch(): void {
    if (this.searchValue) {
      this.emitOnSearch(this.searchValue.trim());
    }
  }

  @Emit("emitOnSearch")
  public emitOnSearch(key: string) {}
}
</script>

<style lang="scss">
@import "../../assets/css/var.scss";
.search-bar {
  height: 32px;
  margin-right: 20px;
  align-items: center;
  background-color: $mainBodyBgColor;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 4px;
  input {
    // Phone
    max-width: 80px;

    color: $mainHeaderFontColor;
    height: 33px;
    border: none;
    outline: none;
    background: transparent;
  }
  i {
    color: $mainContentFontColor;
    cursor: pointer;
  }
  .mu-icon-button {
    margin-right: -3px;
    padding: 3px;
    width: initial !important ;
    height: initial !important ;
  }
}

@media screen and (min-width: 576px) {
  // Not Phone
  .search-bar {
    display: flex;
    input {
      max-width: 200px;
    }
  }
}
</style>
