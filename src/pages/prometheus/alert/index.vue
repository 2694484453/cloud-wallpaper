<template>
  <div>
    <t-card class="list-card-container" :bordered="false">
      <t-form
        ref="form"
        :data="formData"
        :label-width="80"
        colon
        @reset="onReset"
        @submit="onSubmit"
        :style="{ marginBottom: '8px' }"
      >
        <t-row justify="space-between">
          <div class="left-operation-container">
            <!--            <t-button @click="handleSetupContract">添加端点</t-button>-->
            <!--            <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length"> 导出配置</t-button>-->
            <!--            <p v-if="!!selectedRowKeys.length" class="selected-count">已选{{ selectedRowKeys.length }}项</p>-->
          </div>
          <t-input v-model="searchForm.job" class="search-input" placeholder="请输入你需要搜索的内容" clearable>
            <template #suffix-icon>
              <search-icon size="20px"/>
            </template>
          </t-input>
          <!--          <t-col :span="3">-->
          <!--            <t-form-item label="类型" name="type">-->
          <!--              <t-select-->
          <!--                v-model="formData.type"-->
          <!--                :style="{ width: '200px' }"-->
          <!--                placeholder="请选择类型"-->
          <!--                class="demo-select-base"-->
          <!--                clearable-->
          <!--              >-->
          <!--                <t-option v-for="(item, index) in typeList" :key="index" :value="item" :label="item">-->
          <!--                  {{ item }}-->
          <!--                </t-option>-->
          <!--              </t-select>-->
          <!--            </t-form-item>-->
          <!--          </t-col>-->
          <!--        <t-input v-model="searchValue" class="search-input" placeholder="请输入你需要搜索的内容" clearable>-->
          <!--          <template #suffix-icon>-->
          <!--            <search-icon size="20px"/>-->
          <!--          </template>-->
          <!--        </t-input>-->
          <t-col :span="2" class="operation-container">
            <t-button theme="primary" type="submit" :style="{ marginLeft: '8px' }"> 查询</t-button>
            <t-button type="reset" variant="base" theme="default"> 重置</t-button>
          </t-col>
        </t-row>
      </t-form>
      <div class="table-container">
        <t-table
          :columns="columns"
          :sort="searchForm.orders"
          :data="data"
          :multipleSort="true"
          lazyLoad
          @sort-change="sortChange"
          :rowKey="rowKey"
          :verticalAlign="verticalAlign"
          :hover="hover"
          :selected-row-keys="selectedRowKeys"
          :loading="dataLoading"
          :headerAffixedTop="true"
          :headerAffixProps="{ offsetTop: offsetTop, container: getContainer }"
        >
          <template #status="{row}">
            <t-tag v-show="row.status === '' || row.status === null " theme="warning" variant="light">未知</t-tag>
            <t-tag v-show="row.status === 'resolved'" theme="default" variant="light">已恢复</t-tag>
            <t-tag v-show="row.status === 'firing'" theme="danger" variant="light">触发中</t-tag>
          </template>
          <template #exporterType="{row}">
            <t-tag theme="primary" variant="light">{{ row.exporterType }}</t-tag>
          </template>
          <template #labels="{row}">
            <div v-for="(v,k) in row.labels">
              <t-space>
                <t-tag theme="primary" variant="light">{{ k }}:{{ v }}</t-tag>
              </t-space>
            </div>
          </template>
          <template #op="slotProps">
            <a class="t-button-link" @click="handleClickDetail(slotProps.row)">详情</a>
            <a class="t-button-link" @click="handleClickRelease(slotProps.row)">已读</a>
          </template>
        </t-table>
      </div>
    </t-card>
    <t-pagination style="margin-top: 15px"
                  v-model="searchForm.current"
                  :total="pagination.total"
                  :page-size.sync="searchForm.size"
                  @current-change="onCurrentChange"
                  @page-size-change="onsizeChange"
                  @change="onChange"
    />
    <t-dialog
      :header="confirm.header"
      :body="confirm.body"
      :visible.sync="confirm.visible"
      @confirm=""
      :onCancel="onCancel">
    </t-dialog>
    <!--抽屉-->
    <t-drawer
      :visible.sync="drawer.visible"
      :header="drawer.header"
      :on-overlay-click="() => (drawer.visible = false)"
      :on-size-drag-end="handleSizeDrag"
      showOverlay
      :sizeDraggable="true"
      placement="right"
      destroyOnClose
      size="30%"
      @close="onCancelDrawer"
      :onConfirm="handleDrawerOk"
      @cancel="onCancelDrawer"
    >
      <t-space v-show="drawer.operation === 'add'|| drawer.operation ==='edit'" direction="vertical"
               style="width: 100%">
        <t-form
          ref="formValidatorStatus"
          :data="formData"
          :label-width="100"
          @reset="onReset"
        >
          <t-form-item label="id" name="id" v-show="false">
            <t-input v-model="formData.id" :maxlength="32" with="120"></t-input>
          </t-form-item>
          <t-form-item label="名称" name="name">
            <t-input v-model="formData.name" placeholder="请输入仓库名称" :maxlength="64" with="120"></t-input>
          </t-form-item>
          <t-form-item label="类型" name="type">
            <t-input v-model="formData.type" placeholder="请输入仓库名称" :maxlength="64" with="120"></t-input>
          </t-form-item>
          <t-form-item label="地址" name="url">
            <t-input v-model="formData.url" placeholder="请输入仓库地址" :maxlength="64" with="120"></t-input>
          </t-form-item>
        </t-form>
      </t-space>
      <t-space v-show="drawer.operation === 'detail'" direction="vertical" style="width: 100%">
        <t-descriptions bordered :layout="'vertical'" :item-layout="'horizontal'" :column="2">
          <t-descriptions-item label="告警名称">{{ formData.alertName }}</t-descriptions-item>
          <t-descriptions-item label="类型">{{ formData.exporterType }}</t-descriptions-item>
          <t-descriptions-item label="分组名称">{{ formData.groupName }}</t-descriptions-item>
          <t-descriptions-item label="状态">{{ formData.status }}</t-descriptions-item>
          <t-descriptions-item label="等级">{{ formData.alertLevel }}</t-descriptions-item>
          <t-descriptions-item label="创建时间">{{ formData.createTime }}</t-descriptions-item>
          <t-descriptions-item label="归属人">{{ formData.createByUserName }}</t-descriptions-item>
          <t-descriptions-item label="描述">{{ formData.description }}</t-descriptions-item>
        </t-descriptions>
      </t-space>
      <t-space v-show="drawer.operation === 'install'" direction="vertical" style="width: 100%">
        <t-form
          ref="formValidatorStatus"
          :data="drawer.dynamicForm"
          :label-width="100"
          @reset="onReset"
        >
          <div v-for="(v,k) in drawer.dynamicForm">
            <t-form-item :label="k" :name="k">
              <t-input v-model="drawer.dynamicForm[k]" :type="typeof drawer.dynamicForm[k]" placeholder="请输入仓库名称"
                       :maxlength="64" with="120"></t-input>
            </t-form-item>
          </div>
        </t-form>
      </t-space>
    </t-drawer>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import {SearchIcon} from 'tdesign-icons-vue';
import Trend from '@/components/trend/index.vue';
import {prefix} from '@/config/global';

import {CONTRACT_STATUS, CONTRACT_STATUS_OPTIONS, CONTRACT_TYPES, CONTRACT_PAYMENT_TYPES} from '@/constants';

export default Vue.extend({
  name: 'ListBase',
  components: {
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
        {
          title: '名称',
          align: 'left',
          width: 140,
          ellipsis: true,
          colKey: 'alertName',
          fixed: 'left',
          sorter: true,
        },
        {
          title: '类型',
          width: 120,
          ellipsis: true,
          fixed: 'left',
          colKey: 'exporterType',
          sorter: true,
        },
        {
          title: '状态',
          colKey: 'status',
          align: 'center',
          width: 60,
          sorter: true,
        },
        {
          title: '等级',
          colKey: 'alertLevel',
          align: 'center',
          width: 60,
          sorter: true,
        },
        {
          title: '分组',
          width: 120,
          ellipsis: true,
          colKey: 'groupName',
          sorter: true,
        },
        {
          title: '描述',
          width: 150,
          ellipsis: true,
          colKey: "description"
        },
        {
          title: '触发时间',
          width: 160,
          ellipsis: true,
          colKey: "createTime",
          sorter: true,
        },
        {
          align: 'left',
          fixed: 'right',
          width: 80,
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
        defaultsize: 10,
        total: 0,
        defaultCurrent: 1,
      },
      // 搜索框
      searchForm: {
        job: "",
        type: "",
        health: "",
        current: 1,
        size: 10,
        orders: [
          {
            sortBy: 'createTime',
            descending: true,
          }
        ]
      },
      // 抽屉
      drawer: {
        header: "",
        visible: false,
        type: "",
        operation: "add",
        row: {},
        dynamicForm: {}
      },
      // 对话框
      confirm: {
        header: "",
        body: "",
        operation: "update",
        visible: false
      },
      searchValue: '',
      confirmVisible: false,
      deleteIdx: -1,
      deleteType: -1,
      // 当前数据
      formData: {
        id: 0,
        alertName: "",
        exporterType: "",
        alertLevel: "",
        groupName: "",
        description: "",
        createTime: "",
        updateTime: "",
        createBy: "",
        createByUserName: "",
        updateBy: "",
        updateByUserName: "",
        status: "",
      },
      typeList: []
    };
  },
  computed: {
    confirmBody() {
      if (this.deleteIdx > -1) {
        const {name} = this.data?.[this.deleteIdx];
        return `删除后，${name}的所有合同信息将被清空，且无法恢复`;
      }
      return '';
    },
    offsetTop() {
      return this.$store.state.setting.isUseTabsRouter ? 48 : 0;
    },
  },
  mounted() {
  },
  created() {
    this.page();
  },
  watch: {
    "searchForm.job"(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page()
      }
    },
    "searchForm.size"(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page()
      }
    },
    "searchForm.current"(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page()
      }
    }
  },
  methods: {
    getContainer() {
      return document.querySelector('.tdesign-starter-layout');
    },
    onsizeChange(size, pageInfo) {
      console.log('Page Size:', this.size, size, pageInfo);
      // 刷新
      this.searchForm.size = size
    },
    onCurrentChange(current, pageInfo) {
      console.log('Current Page', this.current, current, pageInfo);
      // 刷新
      this.searchForm.current = current
    },
    onChange(pageInfo) {
      console.log('Page Info: ', pageInfo);
    },
    handleClickDetail(row: any) {
      this.formData = row;
      this.drawer.operation = 'detail';
      this.drawer.header = '详情';
      this.drawer.visible = true;
    },
    handleClickRelease(row) {
      this.confirm.visible = true;
      this.confirm.operation = 'delete';
      this.confirm.header = '解除';
      this.confirm.body = '确定要解除此告警信息吗？';
    },
    handleSetupContract() {
      this.$emit('transfer', "form")
    },
    handleClickDelete(row) {
      this.confirm.visible = true;
      this.confirm.operation = 'delete';
    },
    onConfirmDelete() {
      switch (this.confirm.operation) {
        case 'delete':
          // 请求删除
          this.$request.delete("/prometheus/alert/delete?id=" + this.formData.id, {}).then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.confirm.visible = false;
              this.page();
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(err => {
          })
          break;
        case 'release':
          // 解除
          this.$request.put("/prometheus/alert/edit?id=" + this.formData.id, {}).then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.confirm.visible = false;
              this.page();
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(err => {
          })
          break;
      }
    },
    onCancel() {
      this.resetIdx();
    },
    resetIdx() {
      this.deleteIdx = -1;
    },
    onReset(data) {
      console.log(data);
      this.searchForm = {};
    },
    onSubmit(data) {
      console.log(this.searchForm);
      this.page();
    },
    handleDrawerOk() {
      switch (this.drawer.operation) {
        case 'add':
          break;
        case 'edit':
          break;
      }
    },
    // 取消抽屉
    onCancelDrawer() {
      this.drawer.visible = false;
      this.dataLoading = false;
    },
    // drawer大小
    handleSizeDrag({size}) {
      console.log('size drag size: ', size);
    },
    getTypeList() {
      this.$request.get("/monitor/typeList").then(res => {
        this.typeList = res.data.data
      }).catch((err) => {

      })
    },
    sortChange(sort: any) {
      // 对于受控属性而言，这里的赋值很重要，不可缺少
      console.log('sort-change', sort);
      this.searchForm.orders = sort;
      this.page();
    },
    page() {
      this.dataLoading = true;
      this.$request.get('/prometheus/alert/page', {
        params: this.searchForm
      }).then((res) => {
        if (res.data.code === 200) {
          this.data = res.data.rows;
          this.pagination.total = res.data.total;
        }
      }).catch((e: Error) => {
        console.log(e);
      }).finally(() => {
        this.dataLoading = false;
      });
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
