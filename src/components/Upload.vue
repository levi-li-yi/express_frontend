<template>
  <div>
    <div>
      <input type="file" @change="changeFile">
      <button>上传</button>
    </div>
  </div>
</template>

<script>

export default {
  name: '',
  data() {
    return {
      container: {
        file: null
      }
    }
  },
  methods: {
    changeFile(e) {
      const [File] = e.target.files;
      console.log(File);

      if (!File) return;
      this.container.file = File;
    },
    uploadRequest() {

    },
    request({method, url, data, headers = {}}) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(headers[key]);
        })
        xhr.send(data);
        xhr.onload = (e) => {
          resolve({
            data: e.target.response
          })
        }
      })
    }
  }
}
</script>
