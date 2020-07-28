<template>
  <div>
    <div>
      <input type="file" @change="changeFile">
      <button @click="uploadRequest">上传</button>
      <button @click="pause">暂停</button>
    </div>
    <div>
      <h3>上传进度: {{totalPrecent || ''}}</h3>
      <ul>
        <li v-for="(item, index) in uploadParams" :key="index">
          {{item.hash}}{{item.percentage}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/*
大文件上传：
1、使用Blob.prototype.slice将文件切片进行上传，最后发送一个合并文件请求
2、服务端接收文件切片，并对切片进行合并
3、通过XHR的onprogerss监听上传进度

断点续传：
1、使用md5根据文件内容生成hash值；
2、通过hash值可以判断该文件是否已经上传；
3、通过XHR的abort方法暂停上传请求;
4、续传前可以先验证哪些切片已经上传，并返回客户端;
 */
import Vue from 'vue'
import { Select, Option } from 'element-ui'

Vue.use(Select);
Vue.use(Option);

export default {
  name: '',
  data() {
    return {
      fileList: [], // 文件切片列表
      uploadParams: [], // 文件切片上传列表
      fileHash: '', // 文件hash值
      source: null, // 取消请求token
      uploadFile: null, // 所上传的文件
    }
  },
  mounted() {
  },
  computed: {
    totalPrecent() {
      if (this.uploadFile) {
        const total = this.uploadParams
        .map(item => item.chunk.size * item.percentage)
        .reduce((pre, cur) => cur + pre, 0);
        return parseInt(total / this.uploadFile.size).toFixed(2);
      }
      return 0;
    }
  },
  methods: {
    // 暂停
    pause() {
      this.requestList = [];
      this.source.cancel('取消上传');
    },
    // 文件选择
    changeFile(e) {
      const [File] = e.target.files;
      if (!File) return;
      this.uploadFile = File;
    },
    // 生成文件切片
    createFileChunk(file, length = 5) {
      const fileList = [];
      const chunkSize = Math.ceil(file.size / length);
      let cur = 0;
      while (cur < file.size) {
        fileList.push({file: file.slice(cur, cur + chunkSize)});
        cur += chunkSize;
      }
      return fileList;
    },
    // 计算hash
    calcuateHash(fileList) {
      return new Promise((resolve) => {
        const worker = new Worker('/hash.js');
        worker.postMessage({fileList});
        worker.onmessage = e => {
          const { percentage, hash } = e.data;
          this.hashPerentage = percentage;
          if (hash) {
            resolve(hash);
          }
        }
      })
    },
    // 核实上传文件
    async verifyUpload() {
      this.fileHash = await this.calcuateHash(this.fileList);
      return this.$http({
        url:'/api/verifyFile',
        method: 'POST',
        data: {
          fileHash: this.fileHash,
          filename: this.uploadFile.name
        },
      });
    },
    //上传切片
    async uploadChunks() {
      const result = await this.verifyUpload();
      if (!result.data.shouldUpload) {
        return '上传成功';
      }
      const uploadeds = result.data.list || [];
      // 筛选出已经成功上传的文件切片
      const uploadList = this.fileList
      .filter((chunk) => !uploadeds.some((value) => value === chunk));
      this.source = this.$axios.CancelToken.source();
      const chunkList = this.collectChunks(uploadList);
      // 请求列表
      this.requestList = chunkList.map(async ({formData}, index) =>
        this.$http({
          url:'/api/upload',
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: this.uploadProgress(this.uploadParams[index]),
          cancelToken: this.source.token
        })
      );
      await Promise.all(this.requestList);
      this.mergeFile();
    },
    // 收集需要上传的文件切片
    collectChunks(uploadList) {
      this.uploadParams = [];
      return uploadList.map(({chunk}, index) => {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('hash', this.fileHash);
        formData.append('filename', this.fileHash + '-' + index);
        this.uploadParams.push(
          {
            chunk: chunk,
            index: index,
            hash: this.fileHash,
            percentage: 0
          }
        );
        return {formData}
      })
    },
    // 文件上传进度
    uploadProgress(item) {
      return e => {
        item.percentage = parseInt(String((e.loaded / e.total) * 100));
        console.log(item.percentage);
      }
    },
    // 通知合并文件
    mergeFile() {
      const filename = this.uploadFile.name
      const extendStr = filename.slice(filename.indexOf('.'));
      this.$http({
        url: '/api/mergeFile',
        method: 'POST',
        data: {
          filename: this.fileHash,
          extendname: extendStr
        }
      })
    },
    // 上传文件
    async uploadRequest() {
      if (!this.uploadFile) return
      const fileChunkList = this.createFileChunk(this.uploadFile);
      this.fileList = fileChunkList.map(({file}) => ({
        chunk: file
      }));
      await this.uploadChunks();
    },
  }
}
</script>
