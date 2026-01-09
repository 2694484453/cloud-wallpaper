<template>
  <div class="image-grid-container">
    <t-skeleton :loading="dataLoading" :animation="'gradient'" :theme="'tab'">
      <div class="grid-container">
        <div
          v-for="(item, index) in data"
          :key="index"
          class="grid-item"
        >
          <div class="image-wrapper" style="align-content: center">
            <t-image-viewer
              :key="item.url"
              :images="imageList"
              :index="index"
              :default-index="index"
            >
              <template #trigger="{ open }">
                <div @click="open(index)">
                  <t-image
                    class="grid-image"
                    :src="dynamic(item)"
                    :lazy="true"
                  />
                </div>
              </template>
            </t-image-viewer>
          </div>
          <div class="image-footer">
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
              <t-button size="small" theme="primary" variant="text" @click="handleDetail(item)">详情</t-button>
            </t-tooltip>
            <t-tooltip content="下载">
              <download-icon class="icon"/>
              <t-button size="small" theme="primary" variant="text" @click="handleDownload(item)">下载</t-button>
            </t-tooltip>
          </div>
        </div>
      </div>
    </t-skeleton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {BrowseIcon, DownloadIcon, InfoCircleIcon} from "tdesign-icons-vue";
import {download} from "@/utils/download";

export default Vue.extend({
  name: "ImageCard",
  props: {
    imageList: {
      type: Array,
    },
    data: {
      type: Array,
    },
    searchForm: {
      type: Object,
    },
    dataLoading: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    BrowseIcon,
    DownloadIcon,
    InfoCircleIcon
  },
  computed() {
  },
  mounted() {

  },
  data() {
    return {
      height: 284,
      width: 160,
    }
  },
  methods: {
    handleDetail(item: any) {
      localStorage.setItem('wallpaper.detail', JSON.stringify(item));
      const url = "/info?id=" + item.id + (this.searchForm.cateName === 'dynamic' ? "&cateName=dynamic" : "");
      this.$router.push(url);
    },
    handleDownload(item: any) {
      download(item.url, item.name);
      const url = "/download?id=" + item.id + (this.searchForm.cateName === 'dynamic' ? "&cateName=dynamic" : "");
      this.$router.push(url);
    },
    dynamic(item: any) {
      // 计算显示宽高
      switch (this.searchForm.cateName) {
        // 动态壁纸
        case 'dynamic':
          this.width = 284;
          this.height = 140;
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
        // 默认
        default:
          this.width = 284;
          this.height = 160;
          return item.url + '?x-oss-process=image/resize,w_' + this.width + ',h_' + this.height;
      }
    }
  }
})
</script>

<style scoped lang="less">
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
