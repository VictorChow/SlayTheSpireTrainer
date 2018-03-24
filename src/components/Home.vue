<template>
  <div>
    <h2>状态</h2>
    <div class="role">
      <span>当前生命</span>
      <el-input class="input" placeholder="请输入当前生命" v-model="hp"></el-input>
      <span>最大生命</span>
      <el-input class="input" placeholder="请输入最大生命" v-model="hpMax"></el-input>
      <span>金币数量</span>
      <el-input class="input" placeholder="请输入金币数量" v-model="gold"></el-input>
      <span>费用数量</span>
      <el-input class="input" placeholder="请输入费用数量" v-model="energy"></el-input>
    </div>
    <h2>药水</h2>
    <div class="role">
      <el-select v-for="(i, index) in potions" :key="index + i" v-model="potions[index]" placeholder="请选择">
        <el-option v-for="item in dropAllPotions" :key="item" :label="potionNameFormatter(item)" :value="item">
        </el-option>
      </el-select>
    </div>
    <div class="flex-row">
      <div style="width:50%">
        <h2>卡片</h2>
        <el-button type="primary" @click="dialogCardsVisible = true">添加卡片</el-button>
        <el-button type="success" style="margin-left:50px" @click="upgradeSelectedCards">升级选中</el-button>
        <el-button type="danger" style="margin-left:50px" @click="deleteSelectedCards">删除选中</el-button>
        <el-table :data="cards" @selection-change="onCardsSelectionChange" ref="cardsTable">
          <el-table-column header-align="center" type="selection">
          </el-table-column>
          <el-table-column prop="id" header-align="center" label="id">
          </el-table-column>
          <el-table-column header-align="center" :formatter="cardsNameObjectFormatter" label="name">
          </el-table-column>
          <el-table-column header-align="center" prop="upgrades" label="upgrades">
          </el-table-column>
        </el-table>
      </div>

      <div style="width:50%">
        <h2>遗物</h2>
        <el-button type="primary" @click="dialogRelicsVisible = true">添加遗物</el-button>
        <el-button type="danger" style="margin-left:50px" @click="deleteSelectedRelics">删除选中</el-button>
        <el-table :data="relics" @selection-change="onRelicsSelectionChange">
          <el-table-column header-align="center" type="selection">
          </el-table-column>
          <el-table-column header-align="center" :formatter="singleFormatter" label="id">
          </el-table-column>
          <el-table-column header-align="center" :formatter="relicsNameFormatter" label="name">
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-button type="primary" style="margin-top:30px;margin-bottom:30px" @click="exportFile">生成存档编码</el-button>
    <el-button type="primary" style="margin-top:30px;margin-bottom:30px" v-clipboard:copy="output" v-clipboard:success="onCopySuccess" v-clipboard:error="onCopyFail">复制到剪贴板</el-button>

    <el-dialog :title="inputCardTitle" :visible.sync="dialogCardsVisible">
      <el-input v-model="filterCards" clearable placeholder="过滤卡片 id / name"></el-input>
      <el-table :data="tableCardsKeys" height="450" highlight-current-row @current-change="onCardsSelectedChange">
        <el-table-column header-align="center" type="index" width="50">
        </el-table-column>
        <el-table-column header-align="center" :formatter="singleFormatter" label="id">
        </el-table-column>
        <el-table-column header-align="center" :formatter="cardsNameFormatter" label="name">
        </el-table-column>
        <el-table-column header-align="center" :formatter="cardsDescFormatter" label="description">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCardsVisible = false">取消</el-button>
        <el-button type="primary" @click="addCard">添加</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="inputRelicTitle" :visible.sync="dialogRelicsVisible">
      <el-input v-model="filterRelics" clearable placeholder="过滤遗物 id / name"></el-input>
      <el-table style="margin-top:10px" :data="tableRelicsKeys" height="420" @current-change="onRelicsSelectedChange" highlight-current-row>
        <el-table-column header-align="center" type="index" width="50">
        </el-table-column>
        <el-table-column header-align="center" :formatter="singleFormatter" label="id">
        </el-table-column>
        <el-table-column header-align="center" :formatter="relicsNameFormatter" label="name">
        </el-table-column>
        <el-table-column header-align="center" :formatter="relicsDescFormatter" label="description">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRelicsVisible = false">取消</el-button>
        <el-button type="primary" @click="addRelic">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import allPotions from '@/config/potions'
import allRelics from '@/config/relics'
import allCards from '@/config/cards'

export default {
  data() {
    return {
      hp: this.$store.state.hp,
      hpMax: this.$store.state.hpMax,
      gold: this.$store.state.gold,
      energy: this.$store.state.energy,
      cards: this.$store.state.cards,
      potions: this.$store.state.potions,
      relics: this.$store.state.relics,
      selectedCards: [],
      selectedRelics: [],
      inputCard: '',
      inputCardTitle: '选择卡片',
      inputRelic: '',
      inputRelicTitle: '选择遗物',
      output: '',
      dialogRelicsVisible: false,
      dialogCardsVisible: false,
      allTableCards: allCards,
      allTableRelics: allRelics,
      filterRelics: '',
      filterCards: ''
    }
  },
  methods: {
    singleFormatter: row => row,
    relicsNameFormatter: row => allRelics[row].NAME,
    relicsDescFormatter: row => allRelics[row].DESCRIPTIONS.join(),
    cardsNameFormatter: row => allCards[row].NAME,
    cardsNameObjectFormatter: row => allCards[row.id].NAME,
    cardsDescFormatter: row => allCards[row].DESCRIPTION,
    potionNameFormatter: row => allPotions[row].NAME,
    onCardsSelectionChange(data) {
      this.selectedCards = data
    },
    onRelicsSelectionChange(data) {
      this.selectedRelics = data
    },
    deleteSelectedCards() {
      this.selectedCards.forEach(item => {
        for (let i = this.cards.length - 1; i >= 0; i--) {
          if (item === this.cards[i]) {
            this.cards.splice(i, 1)
          }
        }
      })
    },
    upgradeSelectedCards() {
      this.selectedCards.forEach(item => {
        for (let i = this.cards.length - 1; i >= 0; i--) {
          if (item === this.cards[i]) {
            this.cards[i].upgrades = 1
          }
        }
      })
      this.$refs.cardsTable.clearSelection()
    },
    deleteSelectedRelics() {
      this.selectedRelics.forEach(item => {
        for (let i = this.relics.length - 1; i >= 0; i--) {
          if (item === this.relics[i]) {
            this.relics.splice(i, 1)
          }
        }
      })
    },
    onRelicsSelectedChange(row) {
      this.inputRelic = row
    },
    onCardsSelectedChange(row) {
      this.inputCard = row
    },
    addCard() {
      if (!this.inputCard || !this.inputCard.trim()) {
        this.$message({
          message: '请选择卡片',
          type: 'warning'
        })
        return
      }
      let value = this.inputCard.trim()
      this.cards.push({
        id: value,
        upgrades: 0
      })
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    addRelic() {
      if (!this.inputRelic || !this.inputRelic.trim()) {
        this.$message({
          message: '请选择遗物',
          type: 'warning'
        })
        return
      }
      let value = this.inputRelic.trim()
      if (this.relics.includes(value)) {
        this.$message({
          message: '已经添加过该遗物',
          type: 'error'
        })
        return
      }
      this.relics.push(value)
      this.$message({
        message: '添加成功',
        type: 'success'
      })
    },
    exportFile() {
      this.$store.commit('updateGameData', {
        hp: this.hp,
        hpMax: this.hpMax,
        gold: this.gold,
        energy: this.energy,
        cards: this.cards,
        potions: this.potions,
        relics: this.relics
      })

      let jsonString = JSON.stringify(this.$store.state.json)

      let key = ['k', 'e', 'y']
      let chars = jsonString.split('').map(c => c.charCodeAt(0))
      for (let i = 0; i < chars.length; i++) {
        chars[i] = chars[i] ^ key[i % key.length].charCodeAt(0)
      }

      this.output = Base64.encode(String.fromCharCode(...chars))
      this.$message({
        message: '生成存档编码成功',
        type: 'success'
      })
    },
    onCopySuccess(e) {
      this.$message({
        message: '已复制到剪贴板',
        type: 'success'
      })
    },
    onCopyFail(e) {
      this.$message({
        message: '复制失败',
        type: 'danger'
      })
    }
  },
  computed: {
    dropAllPotions() {
      let out = []
      for (let key in allPotions) {
        out.push(key)
      }
      return out
    },
    tableRelicsKeys() {
      let out = []
      for (let key in this.allTableRelics) {
        out.push(key)
      }
      out.sort()
      return out
    },
    tableCardsKeys() {
      let out = []
      for (let key in this.allTableCards) {
        out.push(key)
      }
      out.sort()
      return out
    },
    cardsNameIdMap() {
      let map = {}
      for (let key in allCards) {
        let name = allCards[key].NAME
        map[name] = key
      }
      return map
    },
    relicsNameIdMap() {
      let map = {}
      for (let key in allRelics) {
        let name = allRelics[key].NAME
        map[name] = key
      }
      return map
    }
  },
  mounted() {
    if (this.hp === -1) {
      this.$router.replace({ name: 'Upload' })
    }
  },
  watch: {
    inputRelic(curVal, oldVal) {
      this.inputRelicTitle =
        '选择遗物\u3000( ' + curVal + ' - ' + allRelics[curVal].NAME + ' )'
    },
    inputCard(curVal, oldVal) {
      this.inputCardTitle =
        '选择卡片\u3000( ' + curVal + ' - ' + allCards[curVal].NAME + ' )'
    },
    filterCards(curVal, oldVal) {
      let value = curVal.trim()
      if (!value) {
        this.allTableCards = allCards
        return
      }
      let keys = []
      let hasAdd = false
      for (let key in allCards) {
        if (key.toLowerCase().includes(value.toLowerCase())) {
          keys.push(key)
          hasAdd = true
        }
      }
      if (!hasAdd) {
        for (let key in this.cardsNameIdMap) {
          if (key.toLowerCase().includes(value.toLowerCase())) {
            keys.push(this.cardsNameIdMap[key])
          }
        }
      }
      let result = {}
      keys.forEach(item => (result[item] = allCards[item]))
      this.allTableCards = result
    },
    filterRelics(curVal, oldVal) {
      let value = curVal.trim()
      if (!value) {
        this.allTableRelics = allRelics
        return
      }
      let keys = []
      let hasAdd = false
      for (let key in allRelics) {
        if (key.toLowerCase().includes(value.toLowerCase())) {
          keys.push(key)
          hasAdd = true
        }
      }
      if (!hasAdd) {
        for (let key in this.relicsNameIdMap) {
          if (key.toLowerCase().includes(value.toLowerCase())) {
            keys.push(this.relicsNameIdMap[key])
          }
        }
      }
      let result = {}
      keys.forEach(item => (result[item] = allRelics[item]))
      this.allTableRelics = result
    }
  }
}
</script>

<style scoped>
.title-text {
  font-size: 16px;
}
.match {
  height: 100%;
}
.input {
  width: 180px;
}
.role {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
</style>
