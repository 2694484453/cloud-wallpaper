<template>
  <div class="wallpaper-list-container">
    <!-- 页头 -->
    <wallpaper-header
      :theme="mode"
      :isFixed="setting.isHeaderFixed"
      :show-logo="showHeaderLogo"
      :isCompact="setting.isSidebarCompact"
      :maxLevel="setting.splitMenu ? 1 : 3"
      class="header-fixed"
      @cateName="changeCate"
      @name="changeSearchData"
      :cateList="cateList"/>
    <!-- 内容区域 -->
    <div class="list-content">
      <t-space direction="horizontal">
        <t-space direction="horizontal">
            <span v-for="(item, index) in tagList" :key="index">
            <t-tag
              @click="searchForm.name = item.keywordName"
              :color="item.keywordColor"
              :style="{ color: 'white' }"
              class="hover-pointer"
            >{{ item.keywordName }}
            </t-tag>
          </span>
        </t-space>
      </t-space>
      <div class="image-grid-container">
        <div class="grid-container">
          <t-image-viewer
            v-for="(item, index) in data"
            :key="item.url"
            :images="imageList"
            :default-index="index"
            :title="item.name">
            <template #trigger="{ open }" class="image-wrapper" style="align-content: center">
              <div>
                <t-skeleton :loading="dataLoading" :animation="'gradient'" :theme="'tab'">
                  <t-tooltip :content="'文件名称：'+item.name+'，分辨率：'+item.width+'x'+item.height">
                    <t-card bordered
                            hover-shadow>
                      <template #cover>
                        <t-image
                          @click="open(index)"
                          :loading="dataLoading"
                          class="grid-image"
                          :src="dynamic(item)"
                          :lazy="true"
                          overlayTrigger="hover"
                        />
                      </template>
                      <template #footer>
                        <t-space :size="24" direction="horizontal" style="font-size: 14px">
                          <t-tooltip content="浏览次数">
                            <browse-icon class="icon"/>
                            <span>{{ item.viewCount }}</span>
                          </t-tooltip>
                          <t-tooltip content="下载次数">
                            <download-icon class="icon"/>
                            <span>{{ item.downloadCount }}</span>
                          </t-tooltip>
                          <t-tooltip content="查看">
                            <info-circle-icon/>
                            <t-button size="small" theme="primary" variant="text" @click="handleDetail(item)">详情
                            </t-button>
                          </t-tooltip>
                          <t-tooltip content="下载">
                            <download-icon class="icon"/>
                            <t-button size="small" theme="primary" variant="text" @click="handleDownload(item)">下载
                            </t-button>
                          </t-tooltip>
                        </t-space>
                      </template>
                    </t-card>
                  </t-tooltip>
                </t-skeleton>
              </div>
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
    <!-- 页脚 -->
    <common-footer style="margin-top: 15px"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapGetters} from 'vuex';

import CommonHeader from "@/layouts/components/Header.vue";
import CommonFooter from "@/layouts/components/CommonFooter.vue";
import {SettingType} from "@/interface";
import WallpaperHeader from "@/layouts/components/WallpaperHeader.vue";
import {BrowseIcon, DownloadIcon, InfoCircleIcon} from "tdesign-icons-vue";
import {download} from "@/utils/download";

export default Vue.extend({
  name: 'ListBase',
  components: {
    CommonHeader,
    CommonFooter,
    WallpaperHeader,
    BrowseIcon,
    DownloadIcon,
    InfoCircleIcon
  },
  computed: {
    ...mapGetters({
      showHeader: 'setting/showHeader',
      showHeaderLogo: true,
      mode: 'setting/mode',
      menuRouters: 'permission/routers',
    }),
    setting(): SettingType {
      return this.$store.state.setting;
    },
    headerMenu() {
      const {layout, splitMenu} = this.$store.state.setting;
      const {menuRouters} = this;
      if (layout === 'mix') {
        if (splitMenu) {
          return menuRouters.map((menu) => ({
            ...menu,
            children: [],
          }));
        }
        return [];
      }
      return menuRouters;
    },
  },
  data: function () {
    return {
      dataLoading: false,
      data: [],
      searchForm: {
        name: '',
        cateName: "二次元",
        current: 1,
        size: 24,
        orders: []
      },
      pagination: {
        total: 0,
      },
      imagePreview: {
        visible: false,
        index: 0,
        url: ""
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
    // 确保在 DOM 更新后执行
    const savedCurrent = localStorage.getItem("wallpaper.searchForm.current");
    const savedSize = localStorage.getItem("wallpaper.searchForm.size");
    // 假设你有一个方法来处理分页点击
    this.searchForm.current = savedCurrent ? Number.parseInt(savedCurrent) : 1;
    this.searchForm.size = savedSize ? Number.parseInt(savedSize) : 24;
    this.searchForm.cateName = localStorage.getItem('wallpaper.searchForm.cateName') ?? this.searchForm.cateName;
    //this.getList();
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
    "searchForm.name"(newVal, oldVal) {
      if (oldVal !== newVal) {
        // 刷新数据
        localStorage.setItem('wallpaper.searchForm.name', newVal);
        this.getList();
      }
    },
    "searchForm.cateName"(newVal, oldVal) {
      if (oldVal !== newVal) {
        // 存储
        localStorage.setItem('wallpaper.searchForm.cateName', newVal);
        // 变更分类，num设置为1
        this.searchForm.current = 1;
        this.searchForm.name = null;
        // 刷新数据
        this.getList();
      }
    }
  },
  methods: {
    changeCate(val: string) {
      this.searchForm.cateName = val;
    },
    changeSearchData(val: string) {
      this.searchForm.name = val;
    },
    getOverView() {
      this.$request.get("/wallpaper/overView", {}).then(res => {
        if (res.data.code === 200) {
          this.total = res.data.data.total;
          this.dynamicTotal = res.data.data.dynamicTotal;
        }
      }).catch(err => {
      }).finally(() => {
        setTimeout(() => {
          this.toggle();
        }, 1000)
      })
    },
    getList() {
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
        content: '为确保加载速度，封面采用缩略图形式，点击图片封面查看大图呦～，本站已收录' + this.total + '张静态壁纸，' + this.dynamicTotal + '张动态壁纸',
        duration: 5000,
        closeBtn: true,
      });
    },
    handleDetail(item: any) {
      localStorage.setItem('wallpaper.detail', JSON.stringify(item));
      const url = "/info?id=" + item.id + "&cateName=" + this.searchForm.cateName;
      window.open(url, '_blank');
    },
    handleDownload(item: any) {
      download(item.url, item.name);
      const url = "/download?id=" + item.id + "&cateName=" + this.searchForm.cateName;
      window.open(url, '_blank');
    },
    dynamic(item: any) {
      // 计算显示宽高
      switch (this.searchForm.cateName) {
        // 动态壁纸
        case 'dynamic':
          this.width = 284;
          this.height = 140;
          return item.url + '?x-oss-process=video/snapshot,t_0,f_jpg,w_' + this.width + ',h_' + this.height;
        case 'dynamic_phone':
          this.width = 160;
          this.height = 284;
          return item.url + '?x-oss-process=video/snapshot,t_0,f_jpg,w_' + this.width + ',h_' + this.height;
        // 手机
        case 'iphone':
          this.width = 160;
          this.height = 320;
          return item.url + '?x-oss-process=image/resize,w_' + this.width + ',h_' + this.height;
        // 带鱼屏
        case 'widescreen':
          this.height = 160;
          this.width = 320;
          return item.url + '?x-oss-process=image/resize,w_' + this.width + ',h_' + this.height;
        // ai
        case  'ai':
          this.width = 160;
          this.height = 248;
          return item.url + '?x-oss-process=image/resize,w_' + this.width + ',h_' + this.height;
        // fuli
        case 'fuli':
          this.width = 160;
          this.height = 248;
          return item.url + '?x-oss-process=image/resize,w_' + this.width + ',h_' + this.height;
        // fuli
        case 'other':
          this.width = 284;
          this.height = 160;
          return item.url + '?x-oss-process=image/resize,w_' + this.width + ',h_' + this.height;
        // 默认
        default:
          this.width = 284;
          this.height = 160;
          return item.url + '?x-oss-process=image/resize,w_' + this.width + ',h_' + this.height;
      }
    }
  },
});
</script>

<style lang="less" scoped>
.header-fixed {
  position: fixed; /* 关键：固定定位 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 999; /* 确保在最上层 */
  height: 44px; /* 导航栏高度 */
  line-height: 44px;
  background-color: #008489; /* 主题色 */
  color: #fff;
  text-align: center;
  font-size: 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* 添加一点阴影 */
}

.wallpaper-list-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 15px;
  box-sizing: border-box;
}

.list-content {
  margin-top: 50px; /* 留出Header空间 */
  flex: 1;
  overflow: hidden;
}

.image-grid {
  flex: 1 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
  padding: 10px 0;
}

/* 分页等其他样式保持不变 */
.pagination-wrap {
  margin-top: 10px;
  text-align: left;
}

/* 关键：添加悬停样式 */
.hover-pointer:hover {
  cursor: pointer !important; /* 确保覆盖其他样式 */
}

/* 1. 容器设置 - 每行6个 */
.image-grid-container {
  max-width: 100%;
  padding: 0 15px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 15px;
  margin-top: 10px;
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

/* 3. 图片容器 - 固定284x160 */
.image-wrapper {
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.grid-image {
  object-fit: cover;
  display: block;
  border-radius: 8px;
}

/* 4. 底部信息栏 */
.image-footer {
  padding: 4px 30px;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-top: 1px solid #eee;
}

.icon {
  font-size: 14px;
  margin-right: 4px;
  color: #9ea6a6;
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
</style>
