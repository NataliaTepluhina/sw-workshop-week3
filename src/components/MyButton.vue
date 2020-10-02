<template>
  <button @click="$emit('click')">
    <slot name="button"></slot>
  </button>
</template>

<script>
export default {
  props: {
    double: {
      type: Number,
      required: true,
    },
  },
}
</script>
