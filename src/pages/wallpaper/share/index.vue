<template>
  <div style="padding: 20px">
    <t-card :shadow="true"
            :bordered="true"
            size="medium"
    >
      <template #title>
        <h2>Stable Diffusion合租计划</h2>
      </template>
      <h2>
        资源选择
      </h2>
      <t-space direction="horizontal">
        <span>
          GPU极智算
        </span>
        <span>
               <a href="https://www.jygpu.com/markets">https://www.jygpu.com/markets</a>
        </span>
      </t-space>
      <div style="margin-top: 15px">
        <h2>资源套餐费用</h2>
        <t-space direction="horizontal" style="padding: 20px">
          <t-image shape="square" style="width: 720px;height: 420px"
                   src="https://dev-gpg.oss-cn-hangzhou.aliyuncs.com/image/jygpu/截屏2026-01-11 18.25.04.png">

          </t-image>
          <t-image shape="square" style="width: 720px;height: 420px"
                   src="https://dev-gpg.oss-cn-hangzhou.aliyuncs.com/image/jygpu/截屏2026-01-11 18.25.44.png">

          </t-image>
        </t-space>
      </div>

      <template #footer>
        <h3>博主打算开通一个GPU计算实例，需要找人合租分担费用（每人每月费用=资源每月费用/人数），期望合租人数>=5人，那么每人每月只需要200元就能用上RTX4090</h3>
        <h4>用途：Ai绘画、跑图、渲染测试等</h4>
        <h3>有兴趣/打算的请添加QQ群：2694484453</h3>
        <t-image style="width: 220px;height: 240px"
                 src="https://dev-gpg.oss-cn-hangzhou.aliyuncs.com/image/qq/IMG_1554 2.JPG">
        </t-image>
      </template>
    </t-card>
    <t-card
      size="medium"
      style="margin-top: 10px"
      :bordered="true"
      :shadow="true"
    >
      <template #title>
        <h2>
          如果觉得网站做得好，请您支持一下呦～
        </h2>
      </template>
      <span>
        <t-image style="width: 220px;height: 220px" shape="square"
                 src="https://dev-gpg.oss-cn-hangzhou.aliyuncs.com/image/wx/IMG_1555.JPG">

        </t-image>
      </span>
      <template #footer>
        <h3>您的支持就是我前进的动力！</h3>
      </template>
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
