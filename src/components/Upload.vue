<template>
  <el-upload style="margin-top:100px" action="" drag accept=".autosave" :before-upload="getUploadFile">
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将.autosave文件拖到此处</div>
  </el-upload>
</template>

<script>
import { Base64 } from 'js-base64'

export default {
  methods: {
    getUploadFile(file) {
      let fileReader = new FileReader()
      fileReader.readAsText(file)
      fileReader.onload = e => this.decodeData(fileReader.result)
      return false
    },
    decodeData(text) {
      let key = ['k', 'e', 'y']
      let result = Base64.decode(text)
        .split('')
        .map(c => c.charCodeAt(0))
      for (let i = 0; i < result.length; i++) {
        result[i] = result[i] ^ key[i % key.length].charCodeAt(0)
      }
      let json = JSON.parse(String.fromCharCode(...result))

      this.$store.commit('setGameData', json)
      this.$router.push('Home')
    }
  }
}
</script>

<style scoped>

</style>
