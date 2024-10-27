<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const checkoutId = route.query.checkout_id;
</script>

<template>
  <div>
    <h1>Thank you! Your checkout is now being processed.</h1>
  </div>
</template>
