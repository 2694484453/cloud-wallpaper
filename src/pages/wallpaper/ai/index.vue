<template>
  <div class="container">
    <!-- 提示词区域 -->
    <t-space align="center" direction="horizontal">
      <t-button theme="primary" tag="a" href="/" variant="text">返回首页</t-button>
      <t-button theme="warning" tag="a" variant="text">今日剩余次数:{{ remainTimes }}</t-button>
    </t-space>
    <!--生成-->
    <ImageGenerator/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ImageGenerator from "@/components/model/index.vue";

export default Vue.extend( {
  name: 'AiIndex',
  components: {ImageGenerator},
  data() {
    return {
      dataLoading: false,
      logs: "",
      remainTimes: 20
    }
  },
  mounted() {
    this.getRemainTimes();
  },
  methods: {
    getRemainTimes() {
      this.$request.get('/wallpaper/ai/remain', {}).then((res) => {
        if (res.data.code === 200) {
          this.remainTimes = res.data.data;
        }
      })
    }
  }
});
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: "Microsoft YaHei", sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  background: #f9f9f9;
}

h3 {
  color: #333;
  margin-top: 0;
  font-size: 16px;
  font-weight: bold;
}

.grid div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

label {
  font-size: 14px;
  color: #666;
}

.checkbox-row label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
}

.log ul {
  padding-left: 20px;
  margin: 8px 0;
}

.log li {
  margin: 4px 0;
}
</style>
