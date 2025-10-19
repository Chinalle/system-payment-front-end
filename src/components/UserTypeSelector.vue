<template>
  <div class="user-type-selector">
    <button
      type="button"
      :class="{ active: modelValue === 'client' }"
      @click="selectType('client')"
    >
      Cliente
    </button>
    <button
      type="button"
      :class="{ active: modelValue === 'company' }"
      @click="selectType('company')"
    >
      Empresa
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'UserTypeSelector',
  props: {
    modelValue: {
      type: String as PropType<'client' | 'company'>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  methods: {
    selectType(type: 'client' | 'company') {
      this.$emit('update:modelValue', type);
    }
  }
});
</script>

<style scoped>
.user-type-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}
.user-type-selector button {
  flex: 1;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background-color: transparent;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: 600;
}
.user-type-selector button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.user-type-selector button.active {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}
</style>