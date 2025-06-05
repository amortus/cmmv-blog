<template>
  <picture>
    <!-- AVIF format support -->
    <source
      v-if="avifSrc"
      :srcset="avifSrc"
      type="image/avif"
    />
    <!-- WebP format support -->
    <source
      v-if="webpSrc"
      :srcset="webpSrc"
      type="image/webp"
    />
    <!-- Regular image fallback -->
    <img
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="critical ? 'eager' : 'lazy'"
      :fetchpriority="critical ? 'high' : 'auto'"
      :class="imgClass"
      @load="onLoad"
      @error="onError"
    />
  </picture>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  webpSrc: {
    type: String,
    default: ''
  },
  avifSrc: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [Number, String],
    default: null
  },
  height: {
    type: [Number, String],
    default: null
  },
  critical: {
    type: Boolean,
    default: false
  },
  imgClass: {
    type: String,
    default: ''
  }
});

// Automaticamente gerar URLs para formatos modernos se não fornecidos explicitamente
const generatedWebpSrc = computed(() => {
  if (props.webpSrc) return props.webpSrc;
  if (props.src && props.src.match(/\.(jpe?g|png)$/i)) {
    return props.src.replace(/\.(jpe?g|png)$/i, '.webp');
  }
  return '';
});

const generatedAvifSrc = computed(() => {
  if (props.avifSrc) return props.avifSrc;
  if (props.src && props.src.match(/\.(jpe?g|png)$/i)) {
    return props.src.replace(/\.(jpe?g|png)$/i, '.avif');
  }
  return '';
});

// Detectar quando a imagem é carregada
const isLoaded = ref(false);

const onLoad = () => {
  isLoaded.value = true;
};

const onError = (e) => {
  console.warn(`Failed to load image: ${e.target.src}`);
};
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
  transition: opacity 0.3s ease;
  backface-visibility: hidden;
}

.placeholder {
  background-color: #f0f0f0;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 0.8; }
  100% { opacity: 0.6; }
}
</style> 