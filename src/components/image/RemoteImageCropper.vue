<template>
  <div class="remote-image-cropper">
    <!-- 图片预览区域 -->
    <div v-if="!croppedImage" class="preview-container">
      <div class="preview-header">
        <t-icon name="image" size="20px" style="margin-right: 8px;" />
        <span>图片预览</span>
      </div>
      <div class="image-preview">
        <t-image
          id="image"
          :src="imageSrc"
          :alt="imageTitle"
          class="preview-image"
          @load="handleImageLoaded"
        />
      </div>
    </div>

    <!-- 裁剪区域 -->
    <div v-else class="cropper-container">
      <div class="cropper-header">
        <div class="cropper-title">裁剪图片 (284×160)</div>
        <t-button
          theme="default"
          size="small"
          @click="resetCrop"
          :disabled="!croppedImage"
        >
          重置
        </t-button>
      </div>

      <div ref="cropperContainer" class="cropper-area">
        <img ref="cropperImage" :src="imageSrc" alt="Original" />
      </div>

      <div class="cropper-controls">
        <t-button
          theme="primary"
          size="small"
          @click="confirmCrop"
          :disabled="!cropper"
        >
          确定裁剪
        </t-button>
        <t-button
          theme="default"
          size="small"
          @click="cancelCrop"
        >
          取消
        </t-button>
      </div>

      <!-- 裁剪预览 -->
      <div class="crop-preview">
        <div class="preview-label">裁剪结果预览</div>
        <div class="preview-box">
          <img
            :src="croppedImage"
            alt="Cropped Preview"
            class="preview-result"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs';
// import 'cropperjs/dist/cropper.css';

export default {
  name: 'RemoteImageCropper',
  props: {
    // 传入的远程图片URL
    imageSrc: {
      type: String,
      required: true
    },
    // 图片标题（用于显示）
    imageTitle: {
      type: String,
      default: '图片'
    },
    // 裁剪尺寸
    width: {
      type: Number,
      default: 284
    },
    height: {
      type: Number,
      default: 160
    }
  },
  data() {
    return {
      cropper: null,
      croppedImage: '',
      showCropper: false
    };
  },
  mounted() {
    // 初始化时检查图片URL
    if (this.imageSrc) {
      this.loadImage();
    }
    this.showCropper = true;
    this.$nextTick(() => {
      this.initCropper();
    });
  },
  methods: {
    loadImage() {
      // 创建临时图片对象检测图片是否有效
      const img = new Image();
      img.src = this.imageSrc;
      img.onload = () => {
        // 图片加载成功，准备裁剪
        this.showCropper = false;
        this.$nextTick(() => {
          this.initCropper();
        });
      };
      img.onerror = () => {
        console.error('图片加载失败:', this.imageSrc);
        this.$message.error('图片加载失败，请检查URL或网络连接');
      };
    },
    initCropper() {
      this.cropper = new Cropper("#image", {
        aspectRatio: this.width / this.height,
        viewMode: 1,
        preview: '.crop-preview',
        guides: true,
        autoCropArea: 0.8,
        movable: true,
        rotatable: true,
        scalable: true,
        zoomable: true,
        minCanvasWidth: this.width,
        minCanvasHeight: this.height
      });
    },
    confirmCrop() {
      if (!this.cropper) return;
      // 获取裁剪后的图片
      const canvas = this.cropper.getCroppedCanvas({
        width: this.width,
        height: this.height
      });
      // 转换为Base64
      this.croppedImage = canvas.toDataURL('image/png');
      // 通知父组件
      this.$emit('crop-complete', this.croppedImage);
    },
    cancelCrop() {
      this.croppedImage = '';
      this.showCropper = false;
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
      }
    },
    resetCrop() {
      this.croppedImage = '';
      if (this.cropper) {
        this.cropper.clear();
      }
    },
    handleImageLoaded() {
      if (this.cropper) {
        this.cropper.replace(this.imageSrc);
      }
    }
  },
  beforeDestroy() {
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
  }
};
</script>

<style scoped lang="less">
.remote-image-cropper {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.preview-container {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.preview-header {
  padding: 12px 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
  font-weight: 500;
  color: #606266;
  display: flex;
  align-items: center;
}

.image-preview {
  width: 100%;
  height: 300px;
  overflow: hidden;
  background-color: #fafafa;
  position: relative;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.3s;
}

.preview-footer {
  padding: 15px;
  text-align: center;
}

.cropper-container {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.cropper-header {
  padding: 12px 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cropper-title {
  font-weight: 500;
  color: #606266;
}

.cropper-area {
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-bottom: 1px solid #ebeef5;
}

.cropper-controls {
  padding: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.crop-preview {
  padding: 15px;
  background: #f8f9fa;
  border-top: 1px solid #ebeef5;
}

.preview-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}

.preview-box {
  width: 100%;
  height: 160px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-result {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .image-preview {
    height: 200px;
  }

  .cropper-area {
    height: 400px;
  }
}
</style>
