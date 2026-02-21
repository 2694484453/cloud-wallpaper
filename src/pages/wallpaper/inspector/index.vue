<template>
  <div class="text-center p-6 max-w-1024px mx-auto">
    <t-card
      :title="'Stable Diffusion 法术解析'">
        <p class="text-gray-500 my-2 text-sm">
          从 Stable Diffusion 生成的图片读取 prompt / Stable Diffusion 模型解析
        </p>
        <div v-if="imgFileRef" class="my-6">
          <div class="bg-white max-w-720px mx-auto border border-gray-300 p-2" v-if="imageRef">
            <img v-if="imageRef" v-bind="imageRef" alt="" style="display: block; width: auto; height: 30vh; margin:auto" />
          </div>
        </div>

        <div class="max-w-740px" style="margin: 0 auto;align-content: center;align-items: center">
          <t-upload
            class="upload-demo"
            drag
            multiple
            :before-upload="handleUpload"
            theme="custom"
          >
            <div class="upload-area">
              <cloud-upload-icon class="upload-icon" />
              <div class="upload-text">拖动文件到这里或者点击选择文件</div>
            </div>
          </t-upload>
        </div>

        <div v-if="imgFileRef" class="my-6">
          <div v-if="imgfileInfoRef" class="mt-4 text-left max-w-740px mx-auto">
            <h1 class="font-bold text-2xl mb-4">图片信息</h1>
            <div :class="[index === 0 && 'border-t border-t-gray-300']"
              class="bg-white border-b border-l border-r px-4 border-b-gray-300 border-l-gray-300 border-r-gray-300 py-2"
              v-for="(item, index) in imgfileInfoRef" :key="item.key">
              <h1 class="font-semibold text-sm text-gray-800">
                {{ item.key }}
                <t-tooltip content="点击复制" v-if="showCopyBtn(item.key)">
                  <t-button
                    style="margin-left: 6px"
                    variant="text"
                    shape="square"
                    @click="item.key == 'Comment' ? copy(jsonData.uc) : copy(item.value)"
                  >
                    <copy-icon />
                  </t-button>
                </t-tooltip>
              </h1>
              <p class="text-wrap break-all text-sm mt-1 text-gray-600" style="white-space: pre-wrap"
                v-if="!showJsonViewer(item.key)">
                {{ item.value }}
              </p>
              <json-viewer :value="jsonData" v-if="jsonData != null && showJsonViewer(item.key)" :expand-depth=4>
              </json-viewer>
            </div>
          </div>

          <div v-if="exifRef" class="mt-4 text-left max-w-740px mx-auto">
            <h1 class="font-bold text-2xl mb-4">EXIF</h1>
            <div :class="[index === 0 && 'border-t border-t-gray-300']"
              class="bg-white border-b border-l border-r px-4 border-b-gray-300 border-l-gray-300 border-r-gray-300 py-2"
              v-for="(item, index) in exifRef" :key="item.key">
              <h1 class="font-semibold text-sm text-gray-800">{{ item.key }}</h1>
              <p class="text-wrap break-all text-sm mt-1 text-gray-600" style="white-space: pre-wrap">
                {{ item.value.description }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="modelFileRef" class="my-6">
          <div class="mt-4 text-left max-w-740px mx-auto">
            <h1 class="font-bold text-2xl mb-4">模型信息</h1>
            <div :class="[index === 0 && 'border-t border-t-gray-300']"
              class="bg-white border-b border-l border-r px-4 border-b-gray-300 border-l-gray-300 border-r-gray-300 py-2"
              v-for="(item, index) in modelFileInfoRef" :key="item.k">
              <h1 class="font-semibold text-sm text-gray-800">
                {{ item.k }}
              </h1>
              <p class="text-wrap break-all text-sm mt-1 text-gray-600" style="white-space: pre-wrap"
                v-if="item.k != 'Info'">
                {{ item.v }}
              </p>
              <json-viewer :value="jsonData" v-if="item.k == 'Info'" :expand-depth=4></json-viewer>
            </div>
          </div>
          <div class="my-4 pt-4">
            <a class="text-gray-500" href="https://www.bilibili.com/read/cv21362202" target="_blank">图文详解！最全模型用法</a>
          </div>
        </div>

    </t-card>
    <t-card style="margin-top: 10px">
      <p class="text-gray-500 my-2 text-sm">
        *运算完全在你的设备上运行不会上传到云端
      </p>
      <div class="my-4 pt-4">
        如果您觉得本项目对您有帮助 请在 →
        <a class="inline-block text-sm text-gray-500"
           href="https://github.com/Akegarasu/stable-diffusion-inspector">GitHub</a>
        ←上点个star
        <br />
        <span class="inline-block mt-2 text-sm text-gray-500">
            Made with ❤️ by
            <a class="text-gray-500" href="https://github.com/Akegarasu">@Akegarasu</a>
            <a> | </a>
            <a class="text-gray-500" href="https://space.bilibili.com/12566101">秋葉aaaki</a>
            <a> | </a>
            <a class="text-gray-500" href="https://novelai.dev">NovelAI.Dev</a>
            <a> | </a>
            <a class="text-gray-500">Build: {{ commitHash }}</a>
          </span>
      </div>
    </t-card>
  </div>
</template>

<style>
.jv-container {
  line-height: 1.2;
}

.jv-code {
  padding: 10px 20px !important;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  border: 2px dashed #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #0052d9;
}

.upload-icon {
  font-size: 48px;
  color: #0052d9;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  color: #666;
}
</style>

<script>
import modelsig from '@/assets/modelsig.json'

import ExifReader from "exifreader";
import prettyBytes from "pretty-bytes";
import extractChunks from "png-chunks-extract";
import * as pngChunkText from "png-chunk-text";
import jsonViewer from "vue-json-viewer";
import { CloudUploadIcon, CopyIcon } from 'tdesign-icons-vue';
import VueClipboard from 'vue-clipboard2';

import { asyncFileReaderAsDataURL, getStealthExif, getSafetensorsMeta } from "@/utils/utils";

const commitHash = import.meta.env.VITE_COMMIT_HASH || "unknown"

export default {
  name: 'WallpaperInspector',
  components: {
    jsonViewer,
    CloudUploadIcon,
    CopyIcon
  },
  data() {
    return {
      imgFileRef: null,
      imageRef: null,
      exifRef: null,
      imgfileInfoRef: null,
      modelFileRef: null,
      modelFileInfoRef: null,
      jsonData: null,
      imageMaxSizeRef: 0,
      commitHash: commitHash,
      availableImgExt: ["png", "jpeg", "jpg", "webp", "bmp", "avif"],
      availableModelExt: ["pt", "pth", "ckpt", "safetensors", "bin"]
    }
  },
  mounted() {
    VueClipboard.config.autoSetContainer = true;
  },
  methods: {
    copy(value) {
      try {
        this.$copyText(value).then(() => {
          this.$message.success("复制成功");
        }).catch(() => {
          this.$message.warning("复制失败");
        });
      } catch (e) {
        console.log(e);
        this.$message.warning("复制失败");
      }
    },

    showCopyBtn(title) {
      if (!title) return false
      if (
        title == "Description" ||
        title == "Comment" ||
        title == "完整生成信息" ||
        title.indexOf("提示词") != -1
      ) {
        return true;
      }
      return false;
    },

    showJsonViewer(title) {
      if (
        title == "Comment" ||
        title == "workflow"
      ) {
        return true;
      }
      return false;
    },

    cleanData() {
      this.imgFileRef = null
      this.modelFileRef = null
      this.imgfileInfoRef = null
      this.modelFileInfoRef = null
      this.exifRef = null
      this.jsonData = null
    },

    async handleUpload(file) {
      console.log('Upload file:', file);

      // 验证文件对象
      if (!file || !file.raw) {
        this.$message.error("无效的文件对象");
        return false;
      }

      const actualFile = file.raw || file; // TDesign 可能包装了文件对象

      console.log('Actual file:', actualFile);
      this.cleanData()

      let fileExt = actualFile.name.split(".").pop().toLowerCase();
      if (this.availableModelExt.indexOf(fileExt) != -1) {
        this.modelFileRef = actualFile
        await this.inspectModel(actualFile)
      } else if (this.availableImgExt.indexOf(fileExt) != -1) {
        this.imgFileRef = actualFile;
        await this.inspectImage(actualFile)
      } else {
        this.$message.error("解析失败，该文件可能不是一个正常的图片/模型文件。");
      }
      return false;
    },

    async inspectImage(file) {
      await this.readImageBase64()
      this.exifRef = await this.readExif(file)
      this.imgfileInfoRef = await this.readFileInfo(file)
    },

    async inspectModel(file) {
      const modelTypes = modelsig.data
      const fileSize = file.size
      const fileExt = file.name.split(".").pop().toLowerCase()

      if (fileSize < 1024 * 10) {
        this.modelFileInfoRef = [{ k: "错误", v: "🤔 文件过小，怀疑可能不是模型文件。停止解析。" }];
        return;
      }

      let modelType = null;
      let knownIdentifier = modelTypes.map(x => x.identifier)
      let modelKeysContent = ""
      let metaJson

      if (fileExt == "safetensors") {
        let meta = {};
        try {
          meta = await getSafetensorsMeta(file)
        } catch (e) {
          this.modelFileInfoRef = [{ k: "错误", v: "😈 你传了个什么玩意进来？解析失败，该文件可能不是一个正常的模型文件。停止解析。" }];
          return;
        }

        if (meta["__metadata__"]) {
          let data = meta["__metadata__"]

          delete data["modelspec.thumbnail"]

          const jsonKeys = ["ss_bucket_info", "ss_network_args", "ss_dataset_dirs", "ss_tag_frequency"]
          for (let k of jsonKeys) {
            if (data[k] && data[k].length < 10000) {
              data[k] = JSON.parse(data[k])
            }
          }
          metaJson = data
          this.jsonData = data
        }
        const modelKeys = Object.keys(meta).filter(key => key != "__metadata__");
        modelKeysContent = modelKeys.join("\n")
        console.log(modelKeysContent)
      } else {
        modelKeysContent = await file.slice(0, 1024 * 50).text()
        console.log("[debug] file content: " + modelKeysContent)
      }

      if (metaJson && metaJson["modelspec.architecture"] && knownIdentifier.indexOf(metaJson["modelspec.architecture"]) != -1) {
        modelType = modelTypes.find(x => x.identifier == metaJson["modelspec.architecture"])
      } else {
        for (let m of modelTypes) {
          if (modelType) break;

          for (let sig of m.sigs) {
            if (modelKeysContent.indexOf(sig) != -1) {
              modelType = m
              break
            }
          }
        }
      }

      let modelTypeOk = modelType == null ? "😭 未知模型种类或非模型 如果你坚信这是一个模型文件，请提交issue。" : modelType.name
      let ok = [
        { k: "文件名", v: file.name },
        { k: "文件大小", v: this.printableBytes(fileSize) },
        { k: "模型种类", v: modelTypeOk },
      ];

      if (modelType != null) {
        ok.push({ k: "模型用法", v: modelType.usage });
      }

      if (fileExt == "safetensors" && this.jsonData) {
        ok.push({ k: "Info", v: this.jsonData });
      }
      this.modelFileInfoRef = ok;
    },

    async extractMetadata(file) {
      if (file.type === "image/png") {
        const buf = await file.arrayBuffer();
        let chunks = [];
        try {
          chunks = extractChunks(new Uint8Array(buf));
        } catch (err) {
          return chunks;
        }
        const textChunks = chunks
          .filter(function (chunk) {
            return chunk.name === "tEXt" || chunk.name === "iTXt";
          })
          .map(function (chunk) {
            if (chunk.name === "iTXt") {
              let data = chunk.data.filter((x) => x != 0x0);
              let header = new TextDecoder().decode(data.slice(0, 11));
              if (header == "Description") {
                data = data.slice(11);
                let txt = new TextDecoder().decode(data);
                return {
                  keyword: "Description",
                  text: txt,
                };
              } else {
                let txt = new TextDecoder().decode(data);
                return {
                  keyword: "Unknown",
                  text: txt,
                };
              }
            } else {
              return pngChunkText.decode(chunk.data);
            }
          });
        console.log(textChunks);
        return textChunks;
      } else if (file.type === "image/webp" || file.type === "image/jpeg" || file.type === "image/avif") {
        const data = await ExifReader.load(file);
        const metadata = String.fromCodePoint(...(data.UserComment.value)).replaceAll('\x00', '').slice(7);
        return [{ keyword: "parameters", text: metadata }];
      }
    },

    async readFileInfo(file) {
      this.jsonData = null

      let metaType = "SD-WEBUI"
      let parsed = []
      let metadata = await this.extractMetadata(file)

      if (metadata.length == 0) {
        let exif = await getStealthExif(this.imageRef.src)
        if (exif) {
          parsed = Object.keys(exif).map((key) => {
            return {
              keyword: key,
              text: exif[key],
            }
          });
          metaType = "NOVELAI"
        } else {
          return [{
            key: "提示",
            value: "😭 无法读取到图像 Metadata，这可能不是一张 Stable Diffusion 生成的图。或者不是原图, 经过了压缩。",
          }]
        }
      } else if (metadata.length == 1) {
        parsed = await this.handleWebUiTag(metadata[0])
      } else {
        parsed = metadata
        metaType = "NOVELAI"
      }

      let ok = [
        { key: "文件名", value: file.name },
        { key: "文件大小", value: prettyBytes(file.size) },
        ...parsed.map((v, k) => {
          if (this.showJsonViewer(v.keyword)) {
            this.jsonData = JSON.parse(v.text);
          }
          return {
            key: v.keyword,
            value: v.text,
          };
        }),
      ]

      if (metaType == "SD-WEBUI") {
        ok.push({ key: "完整生成信息", value: metadata[0]["text"] })
      }

      if (parsed.length == 0) {
        ok.push({
          key: "提示",
          value: "😭 无法读取到图像 Metadata，这可能不是一张 Stable Diffusion 生成的图。或者不是原图, 经过了压缩。",
        })
      }
      return ok
    },

    handleWebUiTag(data) {
      let [prompts, otherParas] = data.text.split("Steps: ");
      let promptSplit = prompts.split("Negative prompt: ");
      let negativePrompt = promptSplit.length > 1 ? promptSplit[1] : "无";
      return [
        {
          keyword: "提示词",
          text: promptSplit[0],
        },
        {
          keyword: "负面提示词",
          text: negativePrompt,
        },
        {
          keyword: "其他参数",
          text: "Steps: " + otherParas,
        },
      ];
    },

    async readImageBase64() {
      this.imageRef = null;
      let result = await asyncFileReaderAsDataURL(this.imgFileRef)
      const image = new Image();
      image.src = result;
      await image.decode();
      const { width, height } = image;
      this.imageRef = {
        width,
        height,
        src: result,
      };
      this.imageMaxSizeRef = width;
    },

    async readExif(file) {
      try {
        const data = await ExifReader.load(file);
        const entries = Object.entries(data);
        return entries.map(([key, value]) => ({ key, value }));
      }
      catch (MetadataMissingError) {
        return [];
      }
    },

    printableBytes(size) {
      const printable = (d, z) => {
        return `${d.toFixed(2)} ${z}`;
      };

      let kb = size / 1024;
      if (kb < 1024) {
        return printable(kb, "KB");
      }
      let mb = kb / 1024;
      if (mb < 1024) {
        return printable(mb, "MB");
      }

      let gb = mb / 1024;
      return printable(gb, "GB");
    }
  }
}
</script>
