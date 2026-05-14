<template>
  <div
    v-if="props.active_queries > 0"
    class="absolute left-0 top-0 h-full w-full bg-white opacity-50"
    style="z-index: 10000000 !important"
  >
    <div
      class="spinner flex items-center justify-center absolute"
      style="left: calc(50% - 30px); top: calc(50% - 30px)"
    ></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  active_queries: number
}>()
</script>

<style>
.spinner {
  position: relative;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.spinner::before {
  border: 6.7px solid #00876e;
  border-radius: 50%;
  position: absolute;
  content: '';
  display: block;
}
.spinner::after {
  border: 6.7px solid #002e91;
  border-radius: 50%;
  position: absolute;
  content: '';
  display: block;
}
.spinner::before {
  width: 33.6px;
  height: 33.6px;
  border-bottom-color: transparent;
  border-left-color: transparent;
  animation: spinner-1o3y8q 1.0499999999999998s infinite linear reverse;
}
.spinner::after {
  animation: spinner-1o3y8q 0.7s infinite linear;
  height: 56px;
  width: 56px;
  border-right-color: transparent;
  border-top-color: transparent;
}
@keyframes spinner-1o3y8q {
  to {
    transform: rotate(360deg);
  }
}
</style>
