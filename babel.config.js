module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 按需加载
  plugins: [['component', {
    "libraryName": "mint-ui",
    "style": true
  }]]
}
