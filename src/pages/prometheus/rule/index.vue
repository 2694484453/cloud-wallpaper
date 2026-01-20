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
            <t-button @click="handleSetupContract"> 添加规则</t-button>
            <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length"> 导出配置</t-button>
            <!--            <p v-if="!!selectedRowKeys.length" class="selected-count">已选{{ selectedRowKeys.length }}项</p>-->
          </div>
          <t-col :span="3">
            <t-input v-model="searchForm.ruleName" class="search-input" placeholder="请输入你需要搜索的内容" clearable>
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
        <t-table
          :columns="columns"
          :data="data"
          :sort="searchForm.orders"
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
          <template #ruleState="{row}">
            <t-tag v-if="row.ruleState === '' || row.ruleState === null " theme="warning">异常</t-tag>
            <t-tag v-if="row.ruleState === 'firing'" theme="danger" >已触发</t-tag>
            <t-tag v-if="row.ruleState === 'inactive'" theme="default">未激活</t-tag>
          </template>
          <template #status="{row}">
            <t-tag v-if="row.status === 'ok'" theme="success" variant="light">已上线</t-tag>
            <t-tag v-if="row.status === '' || row.status === null " theme="warning" variant="light">未知</t-tag>
          </template>
          <template #groupName="{row}">
            <t-tag theme="primary" variant="light">{{ row.groupName }}</t-tag>
          </template>
          <template #op="slotProps">
            <a class="t-button-link" @click="handleClickDetail(slotProps.row)">详情</a>
            <a class="t-button-link" @click="handleClickEdit(slotProps.row)">编辑</a>
            <a class="t-button-link" @click="handleClickDelete(slotProps.row)">删除</a>
          </template>
        </t-table>
      </div>
    </t-card>
    <t-pagination
      style="margin-top: 15px"
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
      @confirm="handleConfirmOk"
      :onCancel="onCancel">
    </t-dialog>
    <t-drawer
      :visible.sync="drawer.visible"
      :header="drawer.header"
      :on-overlay-click="() => (drawer.visible = false)"
      placement="right"
      destroyOnClose
      showOverlay
      :sizeDraggable="true"
      :on-size-drag-end="handleSizeDrag"
      :size="drawer.size"
      @close="onCancelDrawer">
      <t-space v-show="drawer.operation === 'add'|| drawer.operation ==='edit'" direction="vertical"
               style="width: 100%">
        <t-form
          ref="formRef"
          :data="formData"
          :label-width="120"
          @reset="onReset"
          @submit="onSubmit"
        >
          <t-form-item label="规则名称" name="ruleName" required-mark help="为您的规则定义个名称" :rules="[{required:true,message: '规则名称必填'}]">
            <t-input v-model="formData.ruleName" placeholder="请输入英文字母和数字的组合名称" :maxlength="64" with="200"
                     clearable></t-input>
          </t-form-item>
          <t-form-item label="分组名称" name="groupId" required-mark help="您使用的接入点名称" :rules="[{required:true}]">
            <t-select v-model="formData.groupId">
              <t-option v-for="(item,index) in groups" :label="item.jobName" :value="item.targetId"/>
            </t-select>
          </t-form-item>
          <t-form-item label="表达式" name="expr" required-mark help="输入您的PromQl表达式，失去焦点自动校验" :rules="[{required:true,message: '表达式必填'}]">
            <t-textarea v-model="formData.expr" placeholder="请输入表达式" :autosize="{minRows:5}"></t-textarea>
          </t-form-item>
          <t-form-item label="持续时间" name="forTime" required-mark :rules="[{required:true}]">
            <t-input-adornment append="m">
              <t-input-number v-model="formData.forTime" theme="column" min="1" placeholder="请输入内容" />
            </t-input-adornment>
          </t-form-item>
          <t-form-item label="级别" name="severityLevel">
            <t-select v-model="formData.severityLevel">
              <t-option v-for="(item,index) in levels" :label="item" :value="item"/>
            </t-select>
          </t-form-item>
          <t-form-item label="summary" name="summary">
            <t-textarea v-model="formData.summary" placeholder="请输入备注内容" :maxlength="9999" with="200"
                        :autosize="{minRows:3}"></t-textarea>
          </t-form-item>
          <t-form-item label="描述" name="description">
            <t-textarea v-model="formData.description" placeholder="请输入备注内容" :maxlength="200" with="200"
                        :autosize="{minRows:3}"></t-textarea>
          </t-form-item>
        </t-form>
      </t-space>
      <t-space v-show="drawer.operation === 'detail'" direction="vertical" style="width: 100%">
        <t-descriptions bordered :layout="'vertical'" :item-layout="'horizontal'" :column="3">
          <t-descriptions-item label="规则名称">{{ formData.ruleName }}</t-descriptions-item>
          <t-descriptions-item label="分组名称">{{ formData.groupName }}</t-descriptions-item>
          <t-descriptions-item label="类型">{{ formData.type }}</t-descriptions-item>
          <t-descriptions-item label="表达式">{{ formData.expr }}</t-descriptions-item>
          <t-descriptions-item label="持续时间">{{ formData.forTime }}</t-descriptions-item>
          <t-descriptions-item label="状态">{{ formData.status }}</t-descriptions-item>
          <t-descriptions-item label="summary">{{ formData.summary }}</t-descriptions-item>
          <t-descriptions-item label="级别">{{ formData.severityLevel }}</t-descriptions-item>
          <t-descriptions-item label="创建时间">{{ formData.createTime }}</t-descriptions-item>
          <t-descriptions-item label="创建者">{{ formData.createByUserName }}</t-descriptions-item>
          <t-descriptions-item label="更新时间">{{ formData.updateTime }}</t-descriptions-item>
          <t-descriptions-item label="更新者">{{ formData.updateByUserName }}</t-descriptions-item>
          <t-descriptions-item label="描述">{{ formData.description }}</t-descriptions-item>
        </t-descriptions>
      </t-space>
      <!-- 自定义底部按钮 -->
      <template #footer>
        <t-button theme="primary" @click="handleDrawerOk" :loading="drawer.loading">
          确认
        </t-button>
        <t-button theme="default" @click="onCancelDrawer">取消</t-button>
      </template>
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
          title: '规则名称',
          align: 'left',
          width: 150,
          ellipsis: true,
          colKey: 'ruleName',
          fixed: 'left',
          sorter: true,
        },
        {
          title: '类型',
          width: 120,
          ellipsis: true,
          fixed: 'left',
          colKey: 'exporterType',
        },
        {
          title: '健康状态',
          colKey: 'status',
          width: 80,
        },
        {
          title: '告警状态',
          colKey: 'ruleState',
          width: 80,
        },
        {
          title: '分组名称',
          align: 'left',
          width: 120,
          ellipsis: true,
          colKey: 'groupName',
          fixed: 'left',
        },
        {
          title: 'summary',
          width: 120,
          ellipsis: true,
          colKey: 'summary',
        },
        {
          title: '描述',
          width: 140,
          ellipsis: true,
          colKey: "description"
        },
        {
          title: '创建时间',
          width: 140,
          ellipsis: true,
          colKey: "createTime",
          sorter: true,
        },
        {
          title: '更新时间',
          width: 140,
          ellipsis: true,
          colKey: "updateTime",
          sorter: true,
        },
        {
          align: 'center',
          fixed: 'right',
          width: 150,
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
      searchValue: '',
      confirmVisible: false,
      deleteIdx: -1,
      deleteType: -1,
      formData: {
        ruleId: "",
        ruleName: "",
        groupId: 0,
        groupName: "",
        description: "",
        createTime: "",
        updateTime: "",
        createdBy: "",
        updateBy: "",
        createByUserName: "",
        updateByUserName: "",
        type: "",
        expr: "",
        forTime: "",
        labels: "",
        summary: "",
        severityLevel: "",
        status: ""
      },
      // 搜索框
      searchForm: {
        ruleName: "",
        groupName: "",
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
        operation: "add",
        size: '40%',
        loading: false,
      },
      // 对话框
      confirm: {
        header: "",
        body: "",
        operation: "update",
        visible: false
      },
      typeList: [],
      levels: [],
      groups: [],
    };
  },
  computed: {
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
    "searchForm.name"(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page();
      }
    },
    "searchForm.size"(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page();
      }
    },
    "searchForm.current"(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page();
      }
    },
    "searchForm.isAsc"(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page()
      }
    },
    "searchForm.orderByColumn"(newVal, oldVal) {
      if (newVal != oldVal) {
        this.page()
      }
    }
  },
  methods: {
    // drawer大小
    handleSizeDrag({size}) {
      console.log('size drag size: ', size);
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
    sortChange(sort: any) {
      // 对于受控属性而言，这里的赋值很重要，不可缺少
      console.log('sort-change', sort);
      this.searchForm.orders = sort;
      this.page();
    },
    // 确认抽屉
    handleDrawerOk() {
      // 提交
      this.$refs.formRef.submit();
    },
    onSubmit({ validateResult}) {
      if (validateResult === true) {
        this.$message.success('提交成功');
        switch (this.drawer.operation) {
          case 'add':
            this.$request.post('/prometheus/rule/add', this.formData).then((res) => {
              if (res.data.code === 200) {
                this.$message.success(res.data.msg);
                this.drawer.visible = false;
                this.page();
              } else {
                this.$message.error(res.data.msg);
              }
            }).catch((e: Error) => {
              console.log(e);
            }).finally(() => {
              this.dataLoading = false;
            });
            break;
          case "edit":
            this.$request.put('/prometheus/rule/edit', this.formData).then((res) => {
              if (res.data.code === 200) {
                this.$message.success(res.data.msg);
                this.page();
              } else {
                this.$message.error(res.data.msg);
              }
            }).catch((e: Error) => {
              console.log(e);
            }).finally(() => {
              this.dataLoading = false;
            });
            break;
        }
      } else {
        console.log('Errors: ', validateResult);
        this.$message.warning(validateResult);
      }
    },
    // 对话框信息自定义
    handleConfirmOk() {
      switch (this.confirm.operation) {
        case 'delete':
          // 真实业务请发起请求
          this.confirm.visible = false;
          // 请求删除
          this.$request.delete("/prometheus/rule/delete?id=" + this.formData.ruleId, {}).then(res => {
            if (res.data.code === 200) {
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
    // 取消抽屉
    onCancelDrawer() {
      this.drawer.visible = false;
      this.dataLoading = false;
    },
    getContainer() {
      return document.querySelector('.tdesign-starter-layout');
    },
    handleClickDetail(row: any) {
      this.formData = row;
      this.drawer.visible = true;
      this.drawer.operation = 'detail';
      this.drawer.header = row.ruleName;
    },
    handleClickEdit(row: any) {
      this.formData = row;
      this.drawer.visible = true;
      this.drawer.operation = 'edit';
      this.drawer.header = row.ruleName;
    },
    handleSetupContract() {
      this.formData = {}
      this.drawer.visible = true;
      this.drawer.operation = 'add';
      this.drawer.header = '新增';
      this.getLevels();
      this.getGroups();
    },
    handleClickDelete(row: any) {
      this.formData = row;
      this.confirm.visible = true;
      this.confirm.header = "删除" + row.ruleName;
      this.confirm.operation = 'delete';
      this.confirm.body = "此操作会删除" + row.ruleName + "，是否继续？";
    },
    onCancel() {
      this.resetIdx();
    },
    resetIdx() {
      this.deleteIdx = -1;
    },
    onReset() {
      this.page();
    },
    getLevels() {
      this.$request.get("/prometheus/rule/levels").then(res => {
        this.levels = res.data.data
      }).catch((err) => {
      }).finally(() => {

      })
    },
    getGroups() {
      this.$request.get("/prometheus/exporter/list").then(res => {
        this.groups = res.data.data
      }).catch((err) => {
      }).finally(() => {

      })
    },
    page() {
      this.dataLoading = true;
      this.$request.get('/prometheus/rule/page', {
        params: this.searchForm
      }).then((res) => {
        if (res.data.code === 200) {
          this.data = res.data.rows;
          this.pagination = {
            ...this.pagination,
            total: res.data.total,
          };
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
