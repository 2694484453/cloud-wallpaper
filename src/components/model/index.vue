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
        <t-form-item label="选择提示词">
          <t-select v-for="(item,index) in words" clearable @change="changeWords(item)" @clear="clearWords">
            <t-option :label="item.promptName" :value="item"></t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="提示词" required-mark help="">
          <t-textarea
            v-model="formData.prompt"
            placeholder="输入提示词..."
            :autosize="{minRows: 5, maxRows:10}"
            :maxlength="200"
          />
        </t-form-item>
        <!-- 反向提示词区域 -->
        <t-form-item label="反向提示词" help="">
          <t-textarea
            v-model="formData.negative_prompt"
            placeholder="输入负面提示词..."
            :autosize="{minRows: 5, maxRows:10}"
            :maxlength="200"
          />
        </t-form-item>
        <!-- 备注 -->
        <t-form-item v-show="description !== '' && description !== null" label="提示词备注">
          <span>{{description}}</span>
          <!--          <t-button @click="importRandom" theme="primary" size="medium">从随机词库导入</t-button>-->
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
            <t-image :style="{width: 512+'px',height:512+'px'}" v-show="!dataLoading && generatedImage !== ''" fit="cover" :src="generatedImage"></t-image>
            <t-empty size="large" style="width: 200px;height: 200px"
                     v-show="!dataLoading && generatedImage == ''"/>
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
        'Miaomiao Harem vPred Dogma 1.1',
        'MiaoMiao Pixel 像素 1.0',
        'NoobAIXL V1.1',
        'NoobAIXL V1.0',
        'illustrious_pencil 融合',
        '[自然语言文生图]Z-Image(步数请改成8步并取消勾选附加推荐质量提示词)',
        '[全新模型]MiaoMiao RealSkin EPS 1.3',
        '[全新模型]Newbie exp 0.1',
        '[全新模型-服务器2]Newbie exp 0.1',
        '[全新模型]MiaoMiao RealSkin vPred 1.1',
        '[新服开放]MiaoMiao RealSkin vPred 1.0',
        '[全新模型]Wainsfw illustrious v16',
        '[新服开放]Wainsfw illustrious v15',
        '[新服开放]MiaoMiao Harem 1.75',
        '[新服开放]MiaoMiao Harem 1.6G',
        '(testa)服务器1 Wainsfw Illustrious v13',
        '(testa)服务器2 Wainsfw Illustrious v13',
        '(testa) Wainsfw Illustrious v11',
        '(testa)真人模型Nsfw-Real',
        'Qwen Image Edit版',
        'Qwen Image Edit2511版',
        '视频生成模型服务器1 wan2.1-14B-fast(3秒视频)',
        '视频生成模型服务器2 wan2.2-14B-fast(5秒视频)(NSFW Lora)',
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
      words: [],
      formDataConfig: {
        prompt: true,
        negative_prompt: true,
        seed: true,
      },
      dataLoading: false,
      logs: "",
      remainTimes: 20,
      description: ""
    }
  },
  mounted() {
    const saveGenerate = localStorage.getItem('wallpaper.generate');
    if (saveGenerate) {
      //this.formData = JSON.parse(saveGenerate);
    }
    this.getWords();
  },
  watch: {

  },
  methods: {
    //
    getWords() {
      this.$request.get('/wallpaper/userPrompt/list',{}).then(res => {
        if (res.data.code === 200) {
          this.words = res.data.data;
        }
      })
    },
    //
    changeWords(words: any) {
      console.log("change:",words);
      this.formData.prompt = words.prompt;
      this.formData.negative_prompt = words.negativePrompt;
      this.formData.width = words.width ?? 512;
      this.formData.height = words.height ?? 512;
      //
      this.description = words.description ?? null;
    },
    clearWords() {
      this.formData.prompt = "";
      this.formData.negative_prompt = "";
      this.formData.width = 512;
      this.formData.height = 512;
      this.description = null
    },
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

