<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { dateDiff } from "@/utils/time";
import { formatNumber } from "@/utils/format";

@Component
export default class FormatMixin extends Vue {
  // Data

  // 时间差函数
  dateDiff: any = dateDiff;
  // 数字格式化单位函数 单位k
  formatNumber: any = formatNumber;
}
</script>
