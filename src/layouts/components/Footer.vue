<template>
  <div style="line-height: 20px;
  text-align: center;">
    {{ banQuan }}
    <span v-html="beiAn"></span>
  </div>
</template>

<script>
import {prefix, appCnName, beiAn, banQuan} from '@/config/global';
import Vue from 'vue';

export default Vue.extend({
  name: `${prefix}-footer`,
  methods: {
  },
  data() {
    return {
      prefix,
      appCnName: appCnName,
      banQuan: banQuan,
      beiAn: beiAn
    };
  },
});
</script>

<style lang="less" scoped>
@import '@/style/variables';

.@{starter-prefix}-footer {
  color: var(--td-text-color-placeholder);

}
</style>
