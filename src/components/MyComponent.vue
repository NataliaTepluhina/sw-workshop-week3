<template>
  <div>
    <div>
      <h1 v-if="showTitle" data-testid="title">My Component Title</h1>
      <span class="test-count">Count: {{ count }}</span>
      <button class="test-increment-button" @click="increment">
        Increment
      </button>
      <p class="test-double">Count x2: {{ double }}</p>
    </div>
    <hr />
    <div>
      <button
        class="test-emitter"
        @click="$emit('custom-event', 'Hello World')"
      >
        Emit an event!
      </button>
    </div>
    <hr />
    <div>
      <MyButton @click="onChildButtonClick">Child Component Button</MyButton>
      {{ childCounter }}
    </div>
  </div>
</template>

<script>
import MyButton from "./MyButton.vue";
export default {
  name: "MyComponent",
  components: {
    MyButton,
  },
  props: {
    showTitle: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      count: 0,
      childCounter: 1,
    };
  },
  computed: {
    double() {
      return this.count * 2;
    },
  },
  methods: {
    increment() {
      this.count++;
    },
    onChildButtonClick() {
      this.childCounter++;
    },
  },
  watch: {
    showTitle() {
      this.$emit("watcher-triggered");
    },
  },
};
</script>

<style>
button {
  margin-left: 10px;
}
</style>
