<template>
  <div class="scrollContainer">
    <div class="cardBox">
      <div class="header">
        <div class="title">
          <span>销量表现</span>
        </div>
      </div>
      <div class="bodyBox">
        <div class="countBox">
          <el-row :gutter="normalPadding">
            <el-col :span="6">
              <CountNumberCard
                :count="27430.15"
                count-prefix="$"
                title="商品销售额"
              />
            </el-col>
            <el-col :span="6">
              <CountNumberCard
                :count="29608.55"
                count-prefix="$"
                title="已支付金额"
              />
            </el-col>
            <el-col :span="6">
              <CountNumberCard :count="871" :decimals="0" title="已售出" />
            </el-col>
            <el-col :span="6">
              <CountNumberCard
                :count="779"
                :decimals="0"
                title="已支付订单数"
              />
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="cardBox">
      <div class="header">
        <div class="title">
          <span>SKU销量表现</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import CountNumberCard from "./components/countNumberCard.vue";
import { getCssVariableValue } from "@/utils/css";

let normalPadding: string | number = getCssVariableValue("--normal-padding");
normalPadding = parseFloat((normalPadding as string).replace("px", ""));
</script>
<style lang="scss" scoped>
.scrollContainer {
  & > .cardBox {
    background-color: #fff;
    border-radius: 4px;
    padding: 16px;
    &:not(:last-child) {
      margin-bottom: 16px;
    }
    & > .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      & > .title {
        font-size: 15px;
        font-weight: 500;
        color: #333;
      }
      & > .rightBox {
        font-size: 14px;
        color: #666;
      }
    }
    & > .bodyBox {
      & > .countBox {
        margin-top: 16px;
      }
    }
  }
}
</style>
