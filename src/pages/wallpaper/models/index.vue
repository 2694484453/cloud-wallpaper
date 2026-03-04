<template>
  <div>
      <t-card class="list-card-container" :bordered="false">
        <t-form
          ref="form"
          :data="formData"
          :label-width="80"
          colon
          @reset="onReset"
          @submit="page"
          :style="{ marginBottom: '8px' }"
        >
        <t-row justify="space-between">
          <div class="left-operation-container">
  <!--          <t-button @click="handleSetupContract"> 新建合同 </t-button>-->
  <!--          <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length"> 导出合同 </t-button>-->
  <!--          <p v-if="!!selectedRowKeys.length" class="selected-count">已选{{ selectedRowKeys.length }}项</p>-->
          </div>
          <t-col :span="3">
            <t-input v-model="searchForm.modelName" class="search-input" placeholder="请输入你需要搜索的内容" clearable>
              <template #suffix-icon>
                <search-icon size="20px"/>
              </template>
            </t-input>
          </t-col>
          <t-col :span="2" class="operation-container">
            <t-button theme="primary" type="submit" :style="{ marginLeft: '8px' }"> 查询</t-button>
            <t-button type="reset" variant="base" theme="default"> 重置</t-button>
          </t-col>
        </t-row>
        </t-form>
        <div class="table-container">
<!--          <t-table-->
<!--            :columns="columns"-->
<!--            :data="data"-->
<!--            :rowKey="rowKey"-->
<!--            :verticalAlign="verticalAlign"-->
<!--            :hover="hover"-->
<!--            :pagination="pagination"-->
<!--            :selected-row-keys="selectedRowKeys"-->
<!--            :loading="dataLoading"-->
<!--            @page-change="rehandlePageChange"-->
<!--            @change="rehandleChange"-->
<!--            @select-change="rehandleSelectChange"-->
<!--            :headerAffixedTop="true"-->
<!--            :headerAffixProps="{ offsetTop: offsetTop, container: getContainer }"-->
<!--          >-->
<!--            <template #status="{ row }">-->
<!--              <t-tag v-if="row.status === CONTRACT_STATUS.FAIL" theme="danger" variant="light">审核失败</t-tag>-->
<!--              <t-tag v-if="row.status === CONTRACT_STATUS.AUDIT_PENDING" theme="warning" variant="light">待审核</t-tag>-->
<!--              <t-tag v-if="row.status === CONTRACT_STATUS.EXEC_PENDING" theme="warning" variant="light">待履行</t-tag>-->
<!--              <t-tag v-if="row.status === CONTRACT_STATUS.EXECUTING" theme="success" variant="light">履行中</t-tag>-->
<!--              <t-tag v-if="row.status === CONTRACT_STATUS.FINISH" theme="success" variant="light">已完成</t-tag>-->
<!--            </template>-->
<!--            <template #url="{row}">-->
<!--              <a :href="row.url" target="_blank">{{row.url}}</a>-->
<!--            </template>-->
<!--            <template #contractType="{ row }">-->
<!--              <p v-if="row.contractType === CONTRACT_TYPES.MAIN">审核失败</p>-->
<!--              <p v-if="row.contractType === CONTRACT_TYPES.SUB">待审核</p>-->
<!--              <p v-if="row.contractType === CONTRACT_TYPES.SUPPLEMENT">待履行</p>-->
<!--            </template>-->
<!--            <template #paymentType="{ row }">-->
<!--              <p v-if="row.paymentType === CONTRACT_PAYMENT_TYPES.PAYMENT" class="payment-col">-->
<!--                付款-->
<!--                <trend class="dashboard-item-trend" type="up" />-->
<!--              </p>-->
<!--              <p v-if="row.paymentType === CONTRACT_PAYMENT_TYPES.RECEIPT" class="payment-col">-->
<!--                收款-->
<!--                <trend class="dashboard-item-trend" type="down" />-->
<!--              </p>-->
<!--            </template>-->
<!--            <template #op="slotProps">-->
<!--              <a class="t-button-link" @click="handleClickDetail(slotProps.row)">详情</a>-->
<!--              <a class="t-button-link" @click="handleClickDownload(slotProps.row)">加速下载</a>-->
<!--  &lt;!&ndash;            <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a>&ndash;&gt;-->
<!--            </template>-->
<!--          </t-table>-->
          <template >
              <div class="list-card-items">
                <t-row :gutter="[16, 16]">
                  <t-col
                    :lg="4"
                    :xs="6"
                    :xl="2"
                    v-for="(item,index) in data"
                    :key="index"
                  >
                    <t-card :bordered="true" :hover-shadow="true">
                      <template #title>
                        <span style="font-size: 12px">{{item.modelName+'-'+item.modelVersion}}</span>
                      </template>
                      <template #cover>
                        <t-image :src="item.imageView+'?x-oss-process=image/resize,p_50'" />
                      </template>
                      <template #actions>
                        <t-dropdown :options="options" :min-column-width="112" @click="clickHandler">
                          <div class="tdesign-demo-dropdown-trigger">
                            <t-button variant="text" shape="square">
                              <more-icon />
                            </t-button>
                          </div>
                        </t-dropdown>
                      </template>
                      <template #footer>
                        <t-button theme="default">
                          <heart-icon />readme
                        </t-button>
<!--                        <t-button theme="primary" variant="base">-->
<!--                          <chat-icon />-->
<!--                        </t-button>-->
                        <t-button theme="primary">
                          <share-icon />download
                        </t-button>
                      </template>
                    </t-card>
                  </t-col>
                </t-row>
              </div>
          </template>
        </div>
      </t-card>
      <t-dialog
        header="确认删除当前所选合同？"
        :body="confirmBody"
        :visible.sync="confirmVisible"
        @confirm="onConfirmDelete"
        :onCancel="onCancel"
      >
      </t-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { SearchIcon } from 'tdesign-icons-vue';
import Trend from '@/components/trend/index.vue';
import { prefix } from '@/config/global';

import { CONTRACT_STATUS, CONTRACT_STATUS_OPTIONS, CONTRACT_TYPES, CONTRACT_PAYMENT_TYPES } from '@/constants';
import ProductCard from "@/components/product-card/index.vue";

export default Vue.extend({
  name: 'ListBase',
  components: {
    ProductCard,
    SearchIcon,
    Trend,
  },
  data() {
    return {
      CONTRACT_STATUS,
      CONTRACT_STATUS_OPTIONS,
      CONTRACT_TYPES,
      CONTRACT_PAYMENT_TYPES,
      prefix,
      dataLoading: false,
      data: [],
      selectedRowKeys: [1, 2],
      value: 'first',
      columns: [
        { colKey: 'row-select', type: 'multiple', width: 32, fixed: 'left' },
        {
          title: '模型名称',
          align: 'left',
          width: 250,
          ellipsis: true,
          colKey: 'modelName',
          fixed: 'left',
        },
        {
          title: '版本',
          colKey: 'modelVersion',
          width: 120,
          cell: { col: 'status' }
        },
        {
          title: '类型',
          width: 80,
          ellipsis: true,
          colKey: 'type',
        },
        {
          title: '链接地址',
          width: 200,
          ellipsis: true,
          colKey: 'url',
        },
        {
          title: '描述',
          width: 200,
          ellipsis: true,
          colKey: 'description',
        },
        {
          title: '创建时间',
          width: 200,
          ellipsis: true,
          colKey: 'createTime',
        },
        {
          align: 'left',
          fixed: 'right',
          width: 200,
          colKey: 'op',
          title: '操作',
        },
      ],
      rowKey: 'index',
      tableLayout: 'auto',
      verticalAlign: 'top',
      hover: true,
      rowClassName: (rowKey: string) => `${rowKey}-class`,
      // 与pagination对齐
      pagination: {
        defaultPageSize: 20,
        total: 0,
        defaultCurrent: 1,
      },
      searchForm: {
        modelName: '',
        current: 1,
        size: 10
      },
      searchValue: '',
      confirmVisible: false,
      deleteIdx: -1,
    };
  },
  computed: {
    confirmBody() {
      if (this.deleteIdx > -1) {
        const { name } = this.data?.[this.deleteIdx];
        return `删除后，${name}的所有合同信息将被清空，且无法恢复`;
      }
      return '';
    },
    offsetTop() {
      return this.$store.state.setting.isUseTabsRouter ? 48 : 0;
    },
  },
  mounted() {
    this.page();
  },
  methods: {
    getContainer() {
      return document.querySelector('.tdesign-starter-layout');
    },
    rehandlePageChange(curr, pageInfo) {
      console.log('分页变化', curr, pageInfo);
    },
    rehandleSelectChange(selectedRowKeys: number[]) {
      this.selectedRowKeys = selectedRowKeys;
    },
    rehandleChange(changeParams, triggerAndData) {
      console.log('统一Change', changeParams, triggerAndData);
    },
    handleClickDetail(row: any) {
      this.$router.push('/detail/base');
    },
    handleClickDownload(row: any) {
      //
      const url = 'https://hubproxy.gpg123.vip/'+row.downloadUrl
      window.open(url, '_blank');
    },
    handleSetupContract() {
      this.$router.push('/form/base');
    },
    handleClickDelete(row: { rowIndex: any }) {
      this.deleteIdx = row.rowIndex;
      this.confirmVisible = true;
    },
    onConfirmDelete() {
      // 真实业务请发起请求
      this.data.splice(this.deleteIdx, 1);
      this.pagination.total = this.data.length;
      const selectedIdx = this.selectedRowKeys.indexOf(this.deleteIdx);
      if (selectedIdx > -1) {
        this.selectedRowKeys.splice(selectedIdx, 1);
      }
      this.confirmVisible = false;
      this.$message.success('删除成功');
      this.resetIdx();
    },
    onCancel() {
      this.resetIdx();
    },
    onReset() {
      this.page();
    },
    resetIdx() {
      this.deleteIdx = -1;
    },
    page() {
      this.dataLoading = true;
      this.$request.get('/wallpaper/models/page',{
        params: this.searchForm
      }).then((res) => {
        if (res.data.code === 200) {
          this.data = res.data.rows;
          this.pagination.total = res.data.total;
        }
      }).finally(() => {
        this.dataLoading = false;
      })
    }
  },
});
</script>

<style lang="less" scoped>
@import '@/style/variables';

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}

.left-operation-container {
  padding: 0 0 6px 0;
  margin-bottom: 16px;

  .selected-count {
    display: inline-block;
    margin-left: var(--td-comp-margin-s);
    color: var(--td-text-color-secondary);
  }
}

.search-input {
  width: 360px;
}

.t-button + .t-button {
  margin-left: var(--td-comp-margin-s);
}
</style>
