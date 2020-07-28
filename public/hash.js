self.importScripts('/spark-md5.min.js');

self.onmessage = e => {
  const {fileList} = e.data;
  console.log(fileList);

  const spark = new self.SparkMD5.ArrayBuffer();
  let percentage = 0;
  let count = 0;
  const loadNext = index => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileList[index].chunk);
    reader.onload = e => {
      count ++;
      spark.append(e.target.result);
      if (count === fileList.length) {
        self.postMessage({
          percentage: 100,
          hash: spark.end()
        });
        self.close();
      } else {
        percentage += 100 / fileList.length;
        self.postMessage({
          percentage
        });
        loadNext(count);
      }
    }
  }
  loadNext(0);
}
