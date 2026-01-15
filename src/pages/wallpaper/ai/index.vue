<template>
  <div class="container">
    <!-- 提示词区域 -->
    <t-space align="center" direction="horizontal">
      <t-button theme="primary" tag="a" href="/" variant="text">返回首页</t-button>
      <t-button theme="warning" tag="a" variant="text">今日剩余次数:{{ remainTimes }}</t-button>
      <t-button theme="default" variant="text" @click="openHistory">历史记录</t-button>
    </t-space>
    <!--生成-->
    <image-generator/>
    <!--历史记录-->
    <t-drawer
      :visible.sync="drawer.visible"
      :header="drawer.header"
      :on-overlay-click="() => (drawer.visible = false)"
      :on-size-drag-end="handleSizeDrag"
      showOverlay
      :sizeDraggable="true"
      placement="right"
      destroyOnClose
      size="55%"
      @close="drawer.visible = false"
      :onConfirm="handleDrawerOk"
      @cancel="drawer.visible = false"
    >
      <t-timeline v-for="(item,key) in records" :layout="'vertical'" mode="same">
        <t-timeline-item :label="item.createTime">
          <a :href="item.url" target="_blank">{{ item.url }}</a>
        </t-timeline-item>
      </t-timeline>
    </t-drawer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ImageGenerator from "@/components/model/index.vue";

export default Vue.extend({
  name: 'AiIndex',
  components: {ImageGenerator},
  data() {
    return {
      dataLoading: false,
      logs: "",
      remainTimes: 20,
      // 抽屉
      drawer: {
        header: "",
        visible: false,
        type: "",
        operation: "add",
        row: {}
      },
      records: []
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
    },
    getHistoryRecords() {
      this.$request.get('/wallpaper/upload/list', {}).then((res) => {
        if (res.data.code === 200) {
          this.records = res.data.data;
        }
      })
    },
    // drawer大小
    handleSizeDrag({size}) {
      console.log('size drag size: ', size);
    },
    openHistory() {
      this.drawer.visible = true;
      this.drawer.header = "生成记录";
      this.getHistoryRecords();
    },
    handleDrawerOk() {
      this.drawer.visible = false;
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
