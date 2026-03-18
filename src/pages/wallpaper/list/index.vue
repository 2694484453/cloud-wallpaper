<template>
  <div>
    <!-- 内容区域 -->
    <div>
      <div class="image-grid-container">
        <div class="grid-container">
          <t-image-viewer
            v-for="(item, index) in data"
            :key="item.url"
            :images="imageList"
            :default-index="index"
            :title="item.name">
            <template #trigger="{ open }">
              <t-skeleton :loading="dataLoading" :animation="'gradient'" :theme="'tab'">
                <t-tooltip :content="item.name">
                  <t-card bordered
                          hover-shadow>
                    <template #cover>
                      <div class="wallpaper-card" :style="{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: computerRatio(item),
                            backgroundColor: '#f0f0f0',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            transition: 'transform 0.3s ease'
                          }">
                        <t-image
                          @click="open(index);handleView(item)"
                          :loading="dataLoading"
                          :src="computerSrc(item)"
                          :lazy="true"
                          class="wallpaper-image"
                          alt="Wallpaper"
                          fit="cover"
                          position="center"
                        />
                      </div>
                    </template>
                    <template #footer>
                      <t-space
                        wrap
                        :size="12"
                        style="width: 100%; font-size: 12px;"
                        class="adaptive-footer"
                        direction="horizontal"
                      >
                        <t-tooltip content="浏览">
                          <div class="stat-item">
                            <browse-icon class="icon"/>
                            <span class="stat-text">{{ item.viewCount }}</span>
                          </div>
                        </t-tooltip>
                        <t-tooltip content="下载">
                          <div class="stat-item">
                            <download-icon class="icon"/>
                            <span class="stat-text">{{ item.downloadCount }}</span>
                          </div>
                        </t-tooltip>
                        <t-tooltip content="详情">
                          <t-button size="small" theme="primary" variant="text" @click="handleDetail(item)">
                            <info-circle-icon/> <span class="btn-text">详情</span>
                          </t-button>
                        </t-tooltip>
                        <t-tooltip content="下载">
                          <t-button size="small" theme="primary" variant="text" @click="handleDownload(item)">
                            <download-icon/> <span class="btn-text">下载</span>
                          </t-button>
                        </t-tooltip>
                      </t-space>
                    </template>
                  </t-card>
                </t-tooltip>
              </t-skeleton>
            </template>
          </t-image-viewer>
        </div>
      </div>
      <t-space :style="{ width: '100%', height: '160px'}" v-show="data.length === 0">
        <t-empty v-show="dataLoading==false && data.length ==0"/>
      </t-space>
    </div>
    <div class="pagination-wrap">
      <t-pagination
        showFirstAndLastPageBtn
        v-model="searchForm.current"
        :total="pagination.total"
        :page-size="searchForm.size"
        :page-size-options="['12', '24','36','48']"
        show-jumper
        @current-change="onCurrentChange"
        @page-size-change="onsizeChange"
      />
    </div>
    <t-drawer
      :visible.sync="drawer.visible"
      :header="drawer.header"
      :on-overlay-click="() => (drawer.visible = false)"
      placement="right"
      destroyOnClose
      :show-overlay="true"
      :sizeDraggable="true"
      :on-size-drag-end="handleSizeDrag"
      :size="drawer.size"
      @cancel="drawer.visible = false"
      @close="drawer.visible = false">
      <t-space v-show="drawer.operation === 'add'|| drawer.operation ==='edit'" direction="vertical"
               style="width: 100%">
        <t-form
          ref="formRef"
          :data="formData"
          :label-width="120"
          @reset="onReset"
          @submit="onSubmit"
        >
          <t-form-item label="规则名称" name="ruleName" required-mark help="为您的规则定义个名称"
                       :rules="[{required: true,message: '规则名称必填'}]">
            <t-input v-model="formData.ruleName" placeholder="请输入英文字母和数字的组合名称" :maxlength="64" with="200"
                     clearable></t-input>
          </t-form-item>
          <t-form-item label="分组名称" name="groupId" required-mark help="您使用的接入点名称"
                       :rules="[{required:true}]">
            <t-select v-model="formData.groupId">
              <t-option v-for="(item,index) in groups" :label="item.jobName" :value="item.targetId"/>
            </t-select>
          </t-form-item>
          <t-form-item label="表达式" name="expr" required-mark help="输入您的PromQl表达式，失去焦点自动校验"
                       :rules="[{required: true,message: '表达式必填'}]">
            <t-textarea v-model="formData.expr" placeholder="请输入表达式" :autosize="{minRows:5}"
                        onBlur="checkPromQL"></t-textarea>
          </t-form-item>
          <t-form-item label="持续时间" name="forTime" required-mark :rules="[{required:true}]">
            <t-input-adornment append="m">
              <t-input-number v-model="formData.forTime" theme="column" min="1" placeholder="请输入内容"/>
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
          <t-descriptions-item label="名称">{{ formData.name }}</t-descriptions-item>
          <t-descriptions-item label="类型">{{ searchForm.cateName }}</t-descriptions-item>
          <t-descriptions-item label="标签">{{ formData.tags }}</t-descriptions-item>
          <t-descriptions-item label="大小">{{ formData.size }}</t-descriptions-item>
          <t-descriptions-item label="创建时间">{{ formData.createTime }}</t-descriptions-item>
          <t-descriptions-item label="创建者">{{ formData.createByUserName }}</t-descriptions-item>
          <t-descriptions-item label="更新时间">{{ formData.updateTime }}</t-descriptions-item>
          <t-descriptions-item label="更新者">{{ formData.updateByUserName }}</t-descriptions-item>
          <t-descriptions-item label="描述">{{ formData.description }}</t-descriptions-item>
        </t-descriptions>
      </t-space>
    </t-drawer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import CommonHeader from "@/layouts/components/Header.vue";
import CommonFooter from "@/layouts/components/CommonFooter.vue";
import WallpaperHeader from "@/layouts/components/WallpaperHeader.vue";
import {BrowseIcon, DownloadIcon, InfoCircleIcon} from "tdesign-icons-vue";
import {download} from "@/utils/download";
import {getJsonItem, setItem} from "@/config/storage";

export default Vue.extend({
  name: 'ListBase',
  props: ['cateName','name'],
  components: {
    CommonHeader,
    CommonFooter,
    WallpaperHeader,
    BrowseIcon,
    DownloadIcon,
    InfoCircleIcon
  },
  data: function () {
    return {
      dataLoading: false,
      data: [],
      searchForm: {
        name: '',
        cateName: "2d",
        current: 1,
        size: 24,
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
      pagination: {
        total: 0,
      },
      imagePreview: {
        visible: false,
        index: 0,
        url: ""
      },
      formData: {
        id: "",
        name: "",
        description: "",
        createTime: "",
        updateTime: "",
        createdBy: "",
        updateBy: "",
        createByUserName: "",
        updateByUserName: "",
        labels: "",
        tags: "",
        size: ''
      },
      imageList: [],
      cateList: [],
      tagList: [],
      total: 0,
      dynamicTotal: 0,
      height: 284,
      width: 160,
    };
  },
  created() {
    for (let i = 0; i < this.searchForm.size; i++) {
      this.data.push({
        id: i,
        name: i,
        url: i,
      })
    }
  },
  mounted() {
    this.getTags();
    this.getOverView();
    this.getList();
    //
    // setItem('wallpaper.searchForm.path',this.$route.fullPath)
    // this.searchForm.name = this.$route.query.name ?? ""
    // setItem('wallpaper.searchForm.name',this.searchForm.name);
    // setItem('wallpaper.searchForm.cateName', this.cateName);
  },
  beforeDestroy() {

  },
  watch: {
    "searchForm.current"(newVal, oldVal) {
      if (oldVal !== newVal) {
        // 存储
        localStorage.setItem('wallpaper.searchForm.current', newVal);
        // 刷新数据
        this.getList();
      }
    },
    "searchForm.size"(newVal, oldVal) {
      if (oldVal !== newVal) {
        // 存储
        localStorage.setItem('wallpaper.searchForm.size', newVal);
        // 刷新数据
        this.getList();
      }
    },
    "cateName"(newVal, oldVal) {
      console.log(newVal);
      if (oldVal !== newVal) {
        this.searchForm.cateName = newVal;
        this.searchForm.current = 1;
        this.searchForm.size = 24;
        // 刷新数据
        this.getList();
      }
    },
    // 监听 $route 对象
    '$route'(to, from) {
      console.log("xx", to, from);
      setItem('wallpaper.searchForm.path',to.fullPath)
      setItem('wallpaper.searchForm.cateName', this.cateName);
      if (to.query.name === localStorage.getItem('wallpaper.searchForm.name')) {
        this.searchForm.name = to.query.name;
        this.searchForm.cateName = this.cateName;
        this.getList();
      }
    },
  },
  methods: {
    getOverView() {
      this.$request.get("/wallpaper/overView", {}).then(res => {
        if (res.data.code === 200) {
          this.total = res.data.data.total;
          this.dynamicTotal = res.data.data.dynamicTotal;
        }
      }).catch(err => {
      }).finally(() => {

      })
    },
    getList() {
      this.imageList = [];
      this.dataLoading = true;
      this.$request.get('/wallpaper/page', {
        params: this.searchForm
      }).then((res) => {
        if (res.data.code === 200) {
          this.data = res.data.rows;
          res.data.rows.forEach(row => {
            this.imageList.push(row.url)
          })
          this.pagination.total = res.data.total;
        }
      }).catch((e: Error) => {
        console.error(e);
      }).finally(() => {
        // 等待图片大部分显示完成
        setTimeout(() => {
          this.dataLoading = false;
        }, 2200)
      });
    },
    getTags() {
      this.$request.get('/wallpaper/tags', {
        params: {
          size: 18
        }
      }).then((res) => {
        if (res.data.code === 200) {
          this.tagList = res.data.data;
        }
      }).catch((e: Error) => {
      }).finally(() => {
      })
    },
    onsizeChange(size: number) {
      this.searchForm.size = size;
      this.searchForm.current = 1;
    },
    onCurrentChange(current: number) {
      this.searchForm.current = current;
    },
    toggle() {
      this.$notify.info({
        title: '提醒',
        content: '为确保加载速度，封面采用缩略图形式，点击图片封面查看大图呦～，本站已收录' + this.total + '张静态壁纸，' + this.dynamicTotal + '张动态壁纸，新增模型下载',
        duration: 5000,
        closeBtn: true,
      });
    },
    handleDetail(item: any) {
      this.drawer.visible = true;
      this.drawer.header = item.name;
      this.drawer.operation = 'detail';
      this.formData = item;
    },
    handleDownload(item: any) {
      download(item.url, item.name).finally(
        this.$request.get('/wallpaper/operate', {
          params: {
            cateName: this.searchForm.cateName,
            type: 'download',
            id: item.id
          }
        }).then((res) => {

        })
      );
    },
    // drawer大小
    handleSizeDrag({size}) {
      console.log('size drag size: ', size);
    },
    handleView(item: any) {
      this.$request.get('/wallpaper/operate', {
        params: {
          cateName: this.searchForm.cateName,
          type: 'view',
          id: item.id
        }
      }).then((res) => {

      })
    },
    computerRatio(item: any) {
      switch (item.dirName) {
        case 'ai':
          return '9/14';
        case 'iphone':
          return '9/16';
        case 'vertical_screen':
          return '9/18';
        case 'dynamic_phone':
          return '9/16';
        case 'dynamic_wide':
          return '21/9';
        case 'widescreen':
          return '21/9';
        default:
          return '16:9';
      }
    },
    computerSrc(item: any) {
      const isVideo = /\.mp4(\?.*)?$/i.test(item.url);
      return isVideo ? (item.url + '?x-oss-process=video/snapshot,t_0,f_jpg,p_30') : (item.url + '?x-oss-process=image/resize,p_30')
    },
    onSubmit() {
      this.getList();
    },
    onReset() {
      this.searchForm.name = ''
    },

  },
});
</script>
<style lang="less" scoped>
.media-content {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 关键：保证视频和图片都填满容器且不变形 */
  display: block;
  border-radius: 8px;
}
/* 分页等其他样式保持不变 */
.pagination-wrap {
  margin-top: 15px;
  text-align: left;
}

/* 1. 容器设置 - 每行6个 */
.image-grid-container {
  max-width: 100%;
  padding: 0 10px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 10px;
}

/* 2. 每个图片项 */
.grid-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.grid-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* 2. 卡片容器：固定宽高比 (Aspect Ratio) */
.wallpaper-card {
  position: relative;
  width: 100%;
  /* 核心：强制容器保持 21:9 的比例 (约 2.38) */
  /* 无论屏幕多宽，高度都会自动根据宽度计算，保持比例一致 */
  aspect-ratio: 16 / 9;
  background-color: #f0f0f0; /* 加载前的背景色 */
  border-radius: 8px;
  overflow: hidden; /* 隐藏超出容器的图片部分 */
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.wallpaper-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  border-radius: 8px;
}

.icon {
  font-size: 14px;
  margin-right: 4px;
  color: #9ea6a6;
}

/* 1. 固定卡片总高度 */
.fixed-height-card {
  height: 200px; /* 设置你需要的高度 */
  /* 关键：覆盖 TDesign 默认的布局，防止内容撑开 */
  display: block;
  overflow: hidden; /* 核心：隐藏溢出的图片 */
}

/* 2. 强制封面容器（cover slot）占满卡片高度 */
/* TDesign Card 的 cover 插槽通常被包裹在 .t-card__cover 内 */
.fixed-height-card :deep(.t-card__cover) {
  width: 100%;
  height: 100%;
  /* 确保内部图片不撑破容器 */
  overflow: hidden;
  position: relative;
}

/* 5. 响应式调整 - 当屏幕较小时自动调整列数 */
@media (max-width: 1400px) {
  .grid-container {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 1200px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 900px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 400px) {
  .grid-container {
    grid-template-columns: repeat(1, 1fr);
  }
}

.stat-item, .t-button {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon {
  width: 14px;
  height: 14px;
}

/* 关键：当容器非常窄时，隐藏文字，只留图标 */
@media (max-width: 400px) {
  .stat-text, .btn-text {
    display: none;
  }

  /* 按钮去掉内边距，变成纯图标按钮 */
  .t-button {
    padding: 4px;
  }
}
</style>
