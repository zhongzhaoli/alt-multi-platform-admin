<template>
  <div class="loadingContainer">
    <div class="first-loading-wrp">
      <div class="loading-wrp">
        <span class="dot dot-spin">
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.loadingContainer {
  width: calc(100vw - var(--sidebar-width) - calc(var(--normal-padding) * 2));
  height: 100vh;
  position: fixed;
  top: 0;
  left: calc(var(--sidebar-width) + var(--normal-padding));
  z-index: 9999;
  .first-loading-wrp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 100%;
  }

  .first-loading-wrp .loading-wrp {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px;
  }

  .dot {
    position: relative;
    box-sizing: border-box;
    display: inline-block;
    width: 64px;
    height: 64px;
    font-size: 64px;
    transform: rotate(45deg);
    animation: antRotate 1.2s infinite linear;
  }

  .dot i {
    position: absolute;
    display: block;
    width: 28px;
    height: 28px;
    background-color: #0960bd;
    border-radius: 100%;
    opacity: 0.5;
    transform: scale(0.75);
    transform-origin: 50% 50%;
    animation: antSpinMove 1s infinite linear alternate;
  }

  .dot i:nth-child(1) {
    top: 0;
    left: 0;
  }

  .dot i:nth-child(2) {
    top: 0;
    right: 0;
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }

  .dot i:nth-child(3) {
    right: 0;
    bottom: 0;
    -webkit-animation-delay: 0.8s;
    animation-delay: 0.8s;
  }

  .dot i:nth-child(4) {
    bottom: 0;
    left: 0;
    -webkit-animation-delay: 1.2s;
    animation-delay: 1.2s;
  }

  @keyframes antRotate {
    to {
      -webkit-transform: rotate(405deg);
      transform: rotate(405deg);
    }
  }

  @-webkit-keyframes antRotate {
    to {
      -webkit-transform: rotate(405deg);
      transform: rotate(405deg);
    }
  }

  @keyframes antSpinMove {
    to {
      opacity: 1;
    }
  }

  @-webkit-keyframes antSpinMove {
    to {
      opacity: 1;
    }
  }
}
</style>
