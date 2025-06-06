<template>
    <div class="w-full relative bg-neutral-100">
        <div class="lg:max-w-6xl md:max-w-3xl mx-auto px-4 py-6">
            <div v-if="!category" class="text-center">
                <h1 class="text-2xl font-bold text-neutral-800 mb-4">Categoria não encontrada</h1>
                <p class="text-neutral-600">A categoria que você está procurando não existe ou está indisponível.</p>
            </div>

            <div v-else>
                <header class="mb-8">
                    <h1 class="text-4xl font-bold text-[#0052cc] mb-3 text-center">{{ category.name }}</h1>
                    <p v-if="category.description" class="text-neutral-600 mb-4 text-center">{{ category.description }}</p>
                    <div class="text-sm text-neutral-500 mb-2">{{ category.postCount }} posts nesta categoria</div>
                    <div class="w-full h-[3px] bg-yellow-500"></div>
                </header>

                <!-- Anúncio horizontal abaixo do cabeçalho -->
                <div class="w-full bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center mb-8 overflow-hidden">
                    <div class="h-24 md:h-28 lg:h-32 w-full flex items-center justify-center text-gray-400">
                        <!-- Slot para anúncio -->
                        <span class="text-sm">Espaço para anúncio</span>
                    </div>
                </div>

                <!-- Initial loading state -->
                <div v-if="loading && posts.length === 0" class="flex justify-center items-center py-20">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0052cc]"></div>
                </div>

                <!-- Posts Grid Layout -->
                <div v-else-if="posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <template v-for="(post, index) in posts" :key="post.id">
                        <div class="card flex flex-col h-full border border-neutral-200 rounded-md overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                            <!-- Feature Image -->
                            <a :href="`/post/${post.slug}`" class="block relative aspect-video overflow-hidden" aria-label="Ler mais sobre este post">
                                <div v-if="post.featureImage" class="w-full h-full">
                                    <img :src="post.featureImage" :alt="post.featureImageAlt || post.title" class="w-full h-full object-cover" />
                                </div>
                            </a>

                            <div class="flex flex-col flex-grow p-4">
                                <!-- Category Badge -->
                                <div class="mb-2">
                                    <span class="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                        {{ category.name }}
                                    </span>
                                </div>

                                <!-- Post Title -->
                                <h2 class="text-lg font-bold text-neutral-900 mb-2">
                                    <a :href="`/post/${post.slug}`" class="hover:text-[#0052cc] transition-colors" aria-label="Ler mais sobre este post">
                                        {{ post.title }}
                                    </a>
                                </h2>

                                <!-- Post Date -->
                                <div class="text-sm text-neutral-500 mb-3">
                                    {{ formatDate(post.publishedAt || post.updatedAt) }}
                                </div>
                            </div>
                        </div>
                        
                        <!-- Anúncio no formato de card a cada 6 posts -->
                        <div v-if="(index + 1) % 6 === 0 && index !== 0" class="card flex flex-col h-full border border-gray-300 bg-gray-100 rounded-md overflow-hidden">
                            <div class="h-full min-h-[280px] w-full flex items-center justify-center text-gray-400">
                                <!-- Slot para anúncio entre cards -->
                                <span class="text-sm">Anúncio</span>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- No posts state -->
                <div v-else-if="!loading && posts.length === 0" class="text-center py-16">
                    <h2 class="text-2xl font-bold mb-2 text-neutral-800">Nenhum post encontrado nesta categoria</h2>
                    <p class="text-neutral-600">Volte mais tarde para novos conteúdos!</p>
                </div>

                <!-- Anúncio horizontal antes do carregamento de mais posts -->
                <div v-if="posts.length > 0 && hasMorePosts" class="w-full bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center my-8 overflow-hidden">
                    <div class="h-24 md:h-28 w-full flex items-center justify-center text-gray-400">
                        <!-- Slot para anúncio -->
                        <span class="text-sm">Espaço para anúncio</span>
                    </div>
                </div>

                <!-- Loading more indicator -->
                <div v-if="loadingMore" class="mt-8 flex justify-center items-center py-6">
                    <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0052cc]"></div>
                </div>

                <!-- Intersection observer target -->
                <div ref="observerTarget" class="h-4 w-full"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
//@ts-nocheck
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue'
import { vue3 } from '@cmmv/blog/client';
import { useSettingsStore } from '../../store/settings';

import {
    formatDate, stripHtml
} from '../../composables/useUtils';

const settingsStore = useSettingsStore();
const blogAPI = vue3.useBlog();
const route = useRoute();

const isSSR = import.meta.env.SSR
const posts = ref<any[]>([]);
const settings = ref<any>(settingsStore.getSettings);
const category = ref<any>(null);
const pagination = ref<any>(null);
const loading = ref(true);
const loadingMore = ref(false);
const hasMorePosts = ref(true);
const currentPage = ref(0);
const observerTarget = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);

loading.value = true;

const data = ref<any>(route.params.id ?
    await blogAPI.categories.getById(route.params.id as string) :
    await blogAPI.categories.getBySlug(route.params.slug as string));

category.value = data.value.category;
posts.value = data.value.posts?.data || [];
pagination.value = data.value.posts?.pagination;

hasMorePosts.value = posts.value.length < (data.value.posts?.count || 0);

const pageUrl = computed(() => {
    return `${import.meta.env.VITE_WEBSITE_URL}/category/${category.value?.slug || ''}`
})

const headData = ref({
    title: category.value.name + ' - ' + settings.value['blog.title'],
    meta: [
        { name: 'description', content: category.value.description },
        { name: 'keywords', content: settings.value['blog.keywords'] },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: category.value.name + ' - ' + settings.value['blog.title'] },
        { property: 'og:description', content: category.value.description },
        { property: 'og:image', content: settings.value['blog.logo'] },
        { property: 'og:url', content: pageUrl.value }
    ],
    link: [
        { rel: 'canonical', href: pageUrl.value },
        { rel: 'alternate', href: `${settings.value['blog.url']}/feed`, type: 'application/rss+xml', title: settings.value['blog.title'] }
    ]
})

useHead(headData);

const loadMorePosts = async () => {
    if (loadingMore.value || !hasMorePosts.value) return;

    try {
        loadingMore.value = true;
        currentPage.value++;

        const response = route.params.id ?
            await blogAPI.categories.getById(route.params.id as string, posts.value.length) :
            await blogAPI.categories.getBySlug(route.params.slug as string, posts.value.length);

        if (response && response.posts && response.posts.data && response.posts.data.length > 0) {
            posts.value = [...posts.value, ...response.posts.data];
            hasMorePosts.value = posts.value.length < (response.posts.count || 0);
        } else {
            hasMorePosts.value = false;
        }
    } catch (err) {
        console.error('Failed to load more posts:', err);
    } finally {
        loadingMore.value = false;
    }
};

const setupIntersectionObserver = () => {
    observer.value = new IntersectionObserver(
        (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMorePosts.value && !loadingMore.value) {
                loadMorePosts();
            }
        },
        { threshold: 0.1 }
    );

    if (observerTarget.value) {
        observer.value.observe(observerTarget.value);
    }
};

onMounted(async () => {
    loading.value = false;
    setupIntersectionObserver();
});

onUnmounted(() => {
    if (observer.value && observerTarget.value) {
        observer.value.unobserve(observerTarget.value);
        observer.value.disconnect();
    }
});
</script>

<style scoped>
.post-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1rem 0;
}

.post-content :deep(iframe) {
    max-width: 100%;
    border-radius: 4px;
    margin: 1rem 0;
}

.post-content :deep(table) {
    max-width: 100%;
    overflow-x: auto;
    display: block;
    border-collapse: collapse;
    margin: 1rem 0;
}

.post-content :deep(table td),
.post-content :deep(table th) {
    border: 1px solid #e5e5e5;
    padding: 0.5rem;
}

.post-content :deep(pre) {
    max-width: 100%;
    overflow-x: auto;
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
}

.post-content :deep(code) {
    white-space: pre-wrap;
    word-break: break-word;
    background-color: #f5f5f5;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 0.9em;
}

.post-content :deep(blockquote) {
    border-left: 4px solid #0052cc;
    padding-left: 1rem;
    margin: 1rem 0;
    color: #666;
}

.post-content :deep(h2),
.post-content :deep(h3),
.post-content :deep(h4),
.post-content :deep(h5),
.post-content :deep(h6) {
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.post-content :deep(p) {
    margin-bottom: 1rem;
    line-height: 1.7;
}

.post-content :deep(ul),
.post-content :deep(ol) {
    margin: 1rem 0;
    padding-left: 2rem;
}

.post-content :deep(li) {
    margin-bottom: 0.5rem;
}

.post-content :deep(a) {
    color: #0052cc;
    text-decoration: underline;
}

.post-content :deep(a:hover) {
    color: #003d99;
}
</style>
