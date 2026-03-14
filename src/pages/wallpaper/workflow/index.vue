<template>
  <div style="padding: 20px">
    <t-card>
      <template #title>
        <h2>完整资源购买</h2>
      </template>
      <span>
        一次购买永久更新
      </span>
      <t-space direction="vertical">
      </t-space>
    </t-card>
    <t-card
      size="medium"
      :bordered="true"
      :shadow="true"
    >
      <template #title>
        <h2>
          如果觉得网站做得好，请您支持一下呦～
        </h2>
      </template>
      <span>
        <t-image style="width: 220px;height: 220px" shape="square" src="https://dev-gpg.oss-cn-hangzhou.aliyuncs.com/image/wx/IMG_1555.JPG">
        </t-image>
      </span>
      <template #footer>
        <h3>您的支持就是我前进的动力！</h3>
      </template>
    </t-card>
    <t-card>
      <template #title>
        <h2>阿里云优惠活动</h2>
      </template>
        <a href="https://www.aliyun.com/minisite/goods?userCode=bbtle8h8">https://www.aliyun.com/minisite/goods?userCode=bbtle8h8</a>
    </t-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: "index"
})
</script>


<style scoped lang="less">

</style>
