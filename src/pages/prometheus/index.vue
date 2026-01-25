<template>
  <div class="dashboard-detail">
    <TopCard :data="overViewData"/>
    <t-card size="medium"
            title="接入步骤"
            :bordered="true"
            :hover-shadow="true"
            style="margin-top: 15px">
      <t-steps :defaultCurrent="0" :current="current">
        <t-step-item title="步骤1">
          <template #content>
            <t-link href="/prometheus/targets">添加端点</t-link>
          </template>
          <template #extra v-if="current === 0">
            <t-button size="small" variant="base" @click.stop="current++">下一步</t-button>
          </template>
        </t-step-item>
        <t-step-item title="步骤2(可选)">
          <template #content>
            <t-link href="#">查看可视化数据</t-link>
          </template>
          <template #extra v-if="current === 1">
            <t-button size="small" variant="base" @click.stop="current++">下一步</t-button>
          </template>
        </t-step-item>
        <t-step-item title="步骤3">
          <template #content>
            <t-link href="/prometheus/rules">添加告警规则</t-link>
          </template>
          <template #extra v-if="current === 2">
            <t-button size="small" variant="base" @click.stop="current++">下一步</t-button>
          </template>
        </t-step-item>
        <t-step-item title="步骤4">
          <template #content>
            <t-link href="/prometheus/alerts">查看告警消息</t-link>
          </template>
          <template #extra v-if="current === 3">
            <t-button size="small" variant="base" @click.stop="current++">完成</t-button>
          </template>
        </t-step-item>
      </t-steps>
    </t-card>
    <t-card size="medium"
            style="margin-top: 15px"
            title="端点类型及参数及可视化"
    >
      <t-swiper :navigation="{ type: 'fraction' }"
                :autoplay="true"
                :current="0"
                :interval="6000"
                :stop-on-hover="true"
                :trigger="'click'"
                :loop="true">
        <t-swiper-item v-for="(item,index) in swiper">
          <t-row>
            <t-col :span="2">
              <t-descriptions :column="1" layout="vertical" :size="'small'">
                  <t-descriptions-item label="类型名称">{{ item.name }}</t-descriptions-item>
                  <t-descriptions-item label="label参数">{{item.label}}</t-descriptions-item>
                  <t-descriptions-item label="描述">
                    {{ item.description }}
                  </t-descriptions-item>
              </t-descriptions>
            </t-col>
            <t-col :span="10">
              <t-image style="width: 100%;height: 65vh;align-self: center;float: right" :src="item.image"></t-image>
            </t-col>
          </t-row>
        </t-swiper-item>
      </t-swiper>
      <t-descriptions v-show="selectType !== null">
        <t-descriptions-item>

        </t-descriptions-item>
      </t-descriptions>
    </t-card>
    <div style="margin-top: 15px">
      <NoticeCard :data="sysNoticeData"/>
    </div>
  </div>
</template>
<script lang="ts">
import {ChevronRightIcon} from 'tdesign-icons-vue';
import Trend from '@/components/trend/index.vue';
import ProductCard from '@/components/product-card/index.vue';
import TopCard from "@/components/top-card/TopCard.vue";
import NoticeCard from "@/components/notice-card/NoticeCard.vue";
import {exporterTypes, exporterTypesItems} from "@/api/prometheus";
import nodeExporterImage from '@/assets/prometheus/node-exporter.png';
import kubeImage from "@/assets/prometheus/kube-state-metrics-exporter.png";
import springBootImage from "@/assets/prometheus/spring-boot-exporter.png";

export default {
  name: 'DashboardDetail',
  components: {NoticeCard, TopCard, Trend, ProductCard, ChevronRightIcon},
  data() {
    return {
      overViewData: [],
      sysNoticeData: [],
      typeList: [],
      swiper: [
        {
          name: 'node-exporter',
          label: '<UNK>',
          image: nodeExporterImage,
          description: '用于linux主机/服务器监控',
        },
        {
          name: 'kube-state-metrics-exporter',
          label: '<UNK>',
          image: kubeImage,
          description: '<UNK>',
        },
        {
          name: 'spring-boot-exporter',
          label: '<UNK>',
          image: springBootImage,
          description: '<UNK>',
        }
      ],
      selectType: "node-exporter",
      current: 0,
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.overView();
    this.getNotice();
    this.types();
  },
  created() {

  },
  methods: {
    overView() {
      this.$request.get("/prometheus/overView", {}).then((res) => {
        this.overViewData = res.data.data;
      }).catch((err) => {
        console.log(err);
      }).finally(() => {

      })
    },
    getNotice() {
      this.$request.get('/sysNotice/page', {
        params: {
          type: 'prometheus',
        }
      }).then((res) => {
        if (res.data.code === 200) {
          this.sysNoticeData = res.data.rows;
        }
      }).catch((e: Error) => {
        console.log(e);
      }).finally(() => {
        this.dataLoading = false;
      });
    },
    onCurChanged(cur, pre) {
      this.current = cur;
      console.log('TDesign Steps:', `current: ${cur}, previous: ${pre}`);
    },
    // 查询类型
    types() {
      exporterTypesItems().then(res => {
        if (res.data.code === 200) {
          this.typeList = res.data.data;
        }
      }).catch((e: Error) => {
        console.log(e);
      }).finally(() => {

      })
    }
  },
};
</script>
<style lang="less" scoped>
@import '@/style/variables.less';

.row-margin {
  margin-top: 16px;
}

// 统一增加8px;
.dashboard-detail-card {
  padding: 8px;

  /deep/ .t-card__title {
    font-size: 20px;
    font-weight: 500;
  }

  /deep/ .t-card__actions {
    display: flex;
    align-items: center;
  }
}

.dashboard-list-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 170px;
  padding: 8px;

  /deep/ .t-card__header {
    padding-bottom: 8px;
  }

  /deep/ .t-card__body {
    flex: 1;
    display: flex;
    padding-top: 0;
    flex-direction: column;
    justify-content: space-between;
  }

  &.dark {
    &:hover {
      background: var(--td-gray-color-14);
      cursor: pointer;
    }
  }

  &.light {
    &:hover {
      background: var(--td-gray-color-14);
      cursor: pointer;
    }
  }

  &__number {
    font-size: 36px;
    line-height: 44px;
    color: var(--td-text-color-primary);
  }

  &__text {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: var(--td-text-color-placeholder);
    text-align: left;
    line-height: 18px;

    &-left {
      display: flex;

      .icon {
        margin: 0 8px;
      }
    }
  }
}
</style>
