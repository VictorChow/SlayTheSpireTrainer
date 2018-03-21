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
      <el-select
        v-for="(i, index) in potions"
        :key="index + i"
        v-model="potions[index]"
        placeholder="请选择">
        <el-option
          v-for="item in dropAllPotions"
          :key="item"
          :label="item"
          :value="item">
          </el-option>
        </el-select>
    </div>
    <div class="flex-row">
      <div style="width:50%">
        <h2>卡片</h2>
        <el-autocomplete 
          v-model="inputCard"
          clearable 
          placeholder="请输入卡片名称"
          :trigger-on-focus="false">
        </el-autocomplete>
        <el-button type="primary" style="margin-left:30px" @click="addCard">添加卡片</el-button>
        <el-button type="success" style="margin-left:30px" @click="upgradeSelectedCards">升级选中</el-button>
        <el-button type="danger" style="margin-left:30px" @click="deleteSelectedCards">删除选中</el-button>
        <el-table :data="cards" @selection-change="onCardsSelectionChange" ref="cardsTable">
          <el-table-column
            header-align="center"
            type="selection">
          </el-table-column>
          <el-table-column
            prop="id"
            header-align="center"
            label="卡片">
          </el-table-column>
          <el-table-column
            header-align="center"
            prop="upgrades"
            label="升级">
          </el-table-column>
        </el-table>
      </div>
      
     <div style="width:50%">
        <h2>遗物</h2>
        <el-button type="primary" @click="dialogRelicsVisible = true">添加遗物</el-button>
        <el-button type="danger" style="margin-left:50px" @click="deleteSelectedRelics">删除选中</el-button>
        <el-table :data="relics" @selection-change="onRelicsSelectionChange">
          <el-table-column
            header-align="center"
            type="selection">
          </el-table-column>
          <el-table-column
            header-align="center"
            :formatter="singleFormatter"
            label="遗物">
          </el-table-column>
        </el-table>
      </div>
    </div>
    
    <el-button type="primary" style="margin-top:30px;margin-bottom:30px" @click="exportFile">生成存档编码</el-button>
    <el-button type="primary" style="margin-top:30px;margin-bottom:30px" v-clipboard:copy="output" v-clipboard:success="onCopySuccess" v-clipboard:error="onCopyFail">复制到剪贴板</el-button>

    <el-dialog :title="inputRelicTitle" :visible.sync="dialogRelicsVisible">
      <el-table
        :data="tableRelicsKeys"
        height="450"
        @current-change="onRelicsSelectedChange"
        highlight-current-row>
        <el-table-column
          header-align="center"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          header-align="center"
          :formatter="singleFormatter"
          label="id">
        </el-table-column>
        <el-table-column
          header-align="center"
          :formatter="relicsNameFormatter"
          label="name">
        </el-table-column>
        <el-table-column
          header-align="center"
          :formatter="relicsDescFormatter"
          label="description">
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
import { mapState } from "vuex";
import allPotions from "@/config/potions";
import allRelics from "@/config/relics";
import { Base64 } from "js-base64";

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
      inputCard: "",
      inputRelic: "",
      inputRelicTitle: "选择遗物",
      output: "",
      dialogRelicsVisible: false
    };
  },
  methods: {
    singleFormatter: row => row,
    relicsNameFormatter: row => allRelics[row].NAME,
    relicsDescFormatter: row => allRelics[row].DESCRIPTIONS.join(),
    onCardsSelectionChange(data) {
      this.selectedCards = data;
    },
    onRelicsSelectionChange(data) {
      this.selectedRelics = data;
    },
    deleteSelectedCards() {
      this.selectedCards.forEach(item => {
        for (let i = this.cards.length - 1; i >= 0; i--) {
          if (item === this.cards[i]) {
            this.cards.splice(i, 1);
          }
        }
      });
    },
    upgradeSelectedCards() {
      this.selectedCards.forEach(item => {
        for (let i = this.cards.length - 1; i >= 0; i--) {
          if (item === this.cards[i]) {
            this.cards[i].upgrades = 1;
          }
        }
      });
      this.$refs.cardsTable.clearSelection();
    },
    deleteSelectedRelics() {
      this.selectedRelics.forEach(item => {
        for (let i = this.relics.length - 1; i >= 0; i--) {
          if (item === this.relics[i]) {
            this.relics.splice(i, 1);
          }
        }
      });
    },
    onRelicsSelectedChange(row) {
      this.inputRelic = row;
    },
    addCard() {
      if (!this.inputCard.trim()) {
        this.$message({
          message: "请输入卡片名称",
          type: "warning"
        });
        return;
      }
      this.cards.push({
        id: this.inputCard.trim(),
        upgrades: 0
      });
      this.inputCard = "";
    },
    addRelic() {
      let value = this.inputRelic.trim()
      if (!value) {
        this.$message({
          message: "请输入遗物名称",
          type: "warning"
        });
        return;
      }
      if(this.relics.includes(value)){
        this.$message({
          message: "已经添加过该遗物",
          type: "error"
        });
        return
      }
      this.relics.push(value);
      this.dialogRelicsVisible = false;
      this.$message({
        message: "添加成功",
        type: "success"
      });
    },
    exportFile() {
      this.$store.commit("updateGameData", {
        hp: this.hp,
        hpMax: this.hpMax,
        gold: this.gold,
        energy: this.energy,
        cards: this.cards,
        potions: this.potions,
        relics: this.relics
      });

      let jsonString = JSON.stringify(this.$store.state.json);

      let key = ["k", "e", "y"];
      let chars = jsonString.split("").map(c => c.charCodeAt(0));
      for (let i = 0; i < chars.length; i++) {
        chars[i] = chars[i] ^ key[i % key.length].charCodeAt(0);
      }
      console.log(String.fromCharCode(...chars));

      this.output = Base64.encode(String.fromCharCode(...chars));
      this.$message({
        message: "生成存档编码成功",
        type: "success"
      });
    },
    onCopySuccess(e) {
      this.$message({
        message: "已复制到剪贴板",
        type: "success"
      });
    },
    onCopyFail(e) {
      this.$message({
        message: "复制失败",
        type: "danger"
      });
    }
  },
  computed: {
    dropAllPotions() {
      let out = [];
      for (let key in allPotions) {
        out.push(key);
      }
      return out;
    },
    tableRelicsKeys() {
      let out = [];
      for (let key in allRelics) {
        out.push(key);
      }
      return out;
    }
  },
  mounted() {
    if (this.hp === -1) {
      this.$router.replace({ name: "Upload" });
    }
  },
  watch: {
    inputRelic(curVal, oldVal) {
      this.inputRelicTitle =
        "选择遗物\u3000( " +
        this.inputRelic +
        " - " +
        allRelics[this.inputRelic].NAME +
        " )";
    }
  }
};
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