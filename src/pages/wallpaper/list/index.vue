<template>
  <div class="wallpaper-list-container">
    <!-- 页头 -->
    <WallpaperHeader class="header-fixed" @cateName="changeCate" @name="changeSearchData" :cateList="cateList"/>
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
      <ImageCard :data="data" :imageList="imageList" :data-loading="dataLoading" :search-form="searchForm"/>
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
    <Footer style="margin-top: 10px"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import WallpaperHeader from "@/layouts/components/WallpaperHeader.vue";
import Footer from "@/layouts/components/Footer.vue";

import ImageCard from "@/pages/wallpaper/list/card.vue";

export default Vue.extend({
  name: 'ListBase',
  components: {
    ImageCard,
    Footer,
    WallpaperHeader,

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
      dynamicTotal: 0
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
    this.getCate();
    this.getTags();
    this.getOverView();
    // 确保在 DOM 更新后执行
    const savedCurrent = localStorage.getItem("wallpaper.searchForm.current");
    const savedSize = localStorage.getItem("wallpaper.searchForm.size");
    // 假设你有一个方法来处理分页点击
    this.searchForm.current = savedCurrent ? Number.parseInt(savedCurrent) : 1;
    this.searchForm.size = savedSize ? Number.parseInt(savedSize) : 24;
    this.searchForm.cateName = localStorage.getItem('wallpaper.searchForm.cateName') ?? this.searchForm.cateName;
    this.getList();
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
        },1000)
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
        },1800)
      });
    },
    getCate() {
      this.$request.get('/wallpaper/category', {}).then((res) => {
        if (res.data.code === 200) {
          this.cateList = res.data.data;
        }
      }).catch((e: Error) => {
      }).finally(() => {
      })
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
        content: '为确保加载速度，封面采用缩略图形式，点击图片封面查看大图呦～，本站已收录'+this.total+'张静态壁纸，'+this.dynamicTotal+'张动态壁纸',
        duration: 5000,
        closeBtn: true,
      });
    },
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

</style>
