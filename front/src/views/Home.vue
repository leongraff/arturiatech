<script setup>
import SingleComp from '@/components/SingleComp.vue'
</script>
<template>
  <div class="prod-container">
    <SingleComp />
  </div>
</template>

<style scoped>
.prod-container {
  background-color: rgb(172, 154, 154);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 25px 65px 25px 65px;
}
</style>
