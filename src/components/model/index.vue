<template>
  <div>
    <t-card class="list-card-container" :bordered="true">
      <t-form
        colon
        ref="form"
        :label-width="120"
        @reset="onReset"
        @submit="onSubmit"
        :data="formData"
        :style="{ marginBottom: '8px' }"
      >
        <t-form-item label="提示词" required-mark help="">
          <t-textarea
            v-model="formData.prompt"
            placeholder="输入提示词..."
            :autosize="{minRows: 5, maxRows:10}"
            :maxlength="200"
          />
        </t-form-item>
<!--        <t-form-item>-->
<!--          <t-button @click="importRandom" theme="primary" size="medium">从随机词库导入</t-button>-->
<!--        </t-form-item>-->
        <!-- 反向提示词区域 -->
        <t-form-item label="反向提示词" help="">
          <t-textarea
            v-model="formData.negative_prompt"
            placeholder="输入负面提示词..."
            :autosize="{minRows: 5, maxRows:10}"
            :maxlength="200"
          />
        </t-form-item>
        <!-- 参数设置区域 -->
        <t-form-item label="参数设置">
          <t-space direction="vertical">
            <t-form-item label="宽度">
              <t-input-number v-model="formData.width" theme="column" :min="0" :max="2048" style="width: 90px"/>
            </t-form-item>
            <t-form-item label="高度">
              <t-input-number v-model="formData.height" theme="column" :min="0" :max="2048" style="width: 90px"/>
            </t-form-item>
            <t-form-item label="步数">
              <t-input-number v-model="formData.steps" theme="column" :min="0" :max="100" style="width: 90px"/>
            </t-form-item>
            <t-form-item label="CFG">
              <t-input-number v-model="formData.cfg" theme="column" :min="0" :max="100" style="width: 90px"/>
            </t-form-item>
            <t-form-item label="种子">
              <t-input-number
                v-model="formData.seed"
                theme="column"
                style="width: 90px"
              />
            </t-form-item>
          </t-space>
        </t-form-item>
        <t-form-item label="开关">
          <t-space direction="horizontal">
            <t-checkbox v-model="formDataConfig.prompt">附加推荐质量提示词</t-checkbox>
            <t-checkbox v-model="formDataConfig.negative_prompt">使用负面词条</t-checkbox>
            <t-checkbox v-model="formDataConfig.seed">随机种子</t-checkbox>
          </t-space>
        </t-form-item>
        <t-form-item label="模型">
          <t-select v-model="formData.model_index">
              <t-option v-for="(item,index) in models" :key="index" :value="index" :title="item" :label="item"/>
          </t-select>
        </t-form-item>
        <!-- 图片预览区域 -->
        <t-form-item label="图片预览">
          <t-space direction="vertical">
            <t-loading v-show="dataLoading"/>
            <t-image v-show="!dataLoading && generatedImage !== null && generatedImage !== ''" fit="cover" src="https://menyu-miaomiaoharemdogma11.hf.space/gradio_api/file=/tmp/gradio/43667574f7cc4bcf46df245766e3e63a5086c7a6362d6b3c1ea463f0848f69fd/image.png"></t-image>
            <t-empty size="large" style="width: 200px;height: 200px"
                     v-show="!dataLoading && generatedImage === null && generatedImage === ''"/>
            <t-button theme="primary" variant="text" size="small" @click="viewInBrowser">
              在浏览器中查看原文件
            </t-button>
          </t-space>
        </t-form-item>

        <t-form-item label="提醒">
          <t-space direction="vertical">
            <ul>
              <li>
                您对测试生成的内容负全部责任。
              </li>
            </ul>
          </t-space>
        </t-form-item>
        <!-- 日志区域 -->
        <t-form-item label="日志">
          <p>{{ logMessage }}</p>
        </t-form-item>
        <t-form-item style="margin-left: 15px">
          <t-space>
            <t-button theme="primary" type="submit" :disabled="dataLoading">提交</t-button>
            <t-button theme="default" variant="base" type="reset">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {zImageJson, acgJson} from "@/config/json";

export default Vue.extend({
  name: 'ImageGenerator',
  components: {},
  data() {
    return {
      models: [
        'Miaomiao Harem vPred Dogma 1.1',
        'Another Model v1.0',
      ],
      model: 'Miaomiao Harem vPred Dogma 1.1',
      qualityPrompt: true,
      negativeTerms: true,
      randomSeed: true,
      // 图片预览
      generatedImage: '',
      // 日志
      logMessage: '',
      //
      formData: {
        prompt: "a beautiful anime girl, detailed face, high quality",
        negative_prompt: "blurry, low quality, distorted",
        width: 512,
        height: 512,
        steps: 20,
        cfg: 7.0,
        model_index: 0,
        seed: -1
      },
      formDataConfig: {
        prompt: true,
        negative_prompt: true,
        seed: true,
      },
      dataLoading: false,
      logs: "",
      remainTimes: 20
    }
  },
  mounted() {
    const saveGenerate = localStorage.getItem('wallpaper.generate');
    if (saveGenerate) {
      //this.formData = JSON.parse(saveGenerate);
    }
  },
  watch: {

  },
  methods: {
    // 从随机词库导入提示词
    importRandom() {
      // 示例：模拟导入逻辑（可替换为实际接口调用）
      this.formData.prompt += '1girl, solo, barefoot, feet, halo, purple eyes, toes, looking at viewer, white hair, sitting, side ponytail, foreshortening, long hair, gloves, hair ornament, foot focus, blush, bare legs, soles, white gloves, indoors, frills, bangs, couch';
      this.$message?.info('已从随机词库导入提示词'); // 若使用 Element UI
    },
    // 生成图像逻辑（需对接后端接口）
    generateImage() {
      this.dataLoading = true;
      // 示例：模拟生成图像（实际需上传参数到后端，获取图片 URL/Base64）
      this.generatedImage = ''; // 占位图
      this.acgRequest();
    },
    aiYunZImageRequest() {
      this.formData.extend = false;
      this.$request.post('/wallpaper/ai/z-image', zImageJson(this.formData)).then((res) => {
        this.generatedImage = res.data.output.choices[0].message.content[0].image;
      }).catch((err) => {
      }).finally(() => {
        this.dataLoading = false;
      })
    },
    acgRequest() {
      this.$request.post('/wallpaper/ai/generate_image', acgJson(this.formData)).then((res) => {
        this.logs = res.data;
        if (res.data.code === 200) {
          this.$message?.success(res.data.msg);
          this.generatedImage = res.data.data.url;
          this.logMessage = res.data.data.logs;
          this.remainTimes = res.data.data.remain;
        } else {
          this.$message?.error(res.data.msg);
        }
      }).catch((err) => {
      }).finally(() => {
        this.dataLoading = false;
      })
    },
    // 在浏览器中查看原文件
    viewInBrowser() {
      if (this.generatedImage) {
        window.open(this.generatedImage, '_blank');
      } else {
        this.$message?.warning('请先生成图像');
      }
    },
    onSubmit() {
      this.generateImage();
    },
    onReset() {

    }
  }
});
</script>

<style scoped>

.input,

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

