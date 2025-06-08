<template>
    <div class="w-full max-w-[1200px] mx-auto px-4 relative">
        <!-- Banner Lateral (Apenas Desktop) -->
        <div 
            v-if="adSettings.enableAds" 
            ref="sidebarLeftAdContainer" 
            class="ad-sidebar-left fixed left-0 top-1/4 hidden xl:block z-10"
            style="margin-left: min(calc((100vw - 1320px) / 2), 10px);"
        >
            <div class="ad-container ad-sidebar-left py-2 px-4" v-if="getAdHtml('sidebarLeft')">
                <div v-html="getAdHtml('sidebarLeft')"></div>
            </div>
            <div class="ad-container ad-sidebar-left py-2 px-4" v-else>
                <div class="ad-placeholder h-[600px] w-[120px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                    <span>Anúncio Lateral</span>
                </div>
            </div>
        </div>

        <div v-if="error" class="text-center py-16 bg-gray-50 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-2xl font-bold mb-2 text-gray-800">Erro ao carregar posts</h2>
            <p class="text-gray-600 mb-4">Não foi possível carregar os posts. Por favor, tente novamente.</p>
            <button @click="loadPosts" class="px-4 py-2 bg-[#0891b2] text-white rounded-md hover:bg-[#06b6d4] transition-colors">
                Tentar novamente
            </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="posts.length === 0" class="text-center py-16 bg-gray-50 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-2xl font-bold mb-2 text-gray-800">Nenhum post encontrado</h2>
            <p class="text-gray-600">Volte mais tarde para novos conteúdos!</p>
        </div>

        <div v-else>
            <!-- Cover Section - 3 Mais Notícias -->
            <section v-if="posts.length > 0" class="mb-6 md:block hidden">
                <h2 class="text-2xl font-bold mb-4 text-[#0891b2] border-b-2 border-[#fbbf24] pb-2">
                    Destaques
                </h2>
                
                <!-- Layout Split Fixo (1 grande, 2 pequenas) -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px]">
                    <!-- Post Principal (Grande - à esquerda) -->
                    <div class="md:col-span-2 bg-gray-50 rounded-lg overflow-hidden shadow-md">
                        <a v-if="posts[0]" :href="`/post/${posts[0].slug}`" class="block h-full">
                            <div class="relative h-full">
                                <OptimizedImage
                                    v-if="posts[0] && posts[0].featureImage"
                                    :src="posts[0].featureImage"
                                    :alt="posts[0].title"
                                    class="w-full h-full object-cover"
                                    width="890"
                                    height="606"
                                    :title="posts[0].title"
                                    aria-label="Cover Image"
                                    :critical="true"
                                />
                                <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white">
                                    <div v-if="posts[0] && posts[0].categories && posts[0].categories.length > 0" class="mb-2">
                                        <span class="bg-[#fbbf24] text-[#333] px-3 py-1 rounded-md text-sm font-medium">
                                            {{ posts[0].categories[0].name }}
                                        </span>
                                    </div>
                                    <h2 v-if="posts[0]" class="text-xl md:text-2xl font-bold mb-3 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] bg-black/30 inline-block py-1 px-2 rounded">{{ posts[0].title }}</h2>
                                    <p v-if="posts[0]" class="text-gray-100 mb-4 line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] bg-black/25 p-2 rounded max-w-2xl">
                                        {{ posts[0].excerpt || stripHtml(posts[0].content).substring(0, 150) + '...' }}
                                    </p>
                                    <span class="inline-block bg-[#0891b2] hover:bg-[#06b6d4] text-white px-4 py-2 rounded-md transition-colors">
                                        Continuar lendo
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
                    
                    <!-- Posts Secundários (Pequenos - à direita) -->
                    <div class="md:col-span-1 flex flex-col gap-4">
                        <div v-for="(post, index) in posts.slice(1, 3)" :key="post.id" class="flex-1 bg-gray-50 rounded-lg overflow-hidden shadow-md min-h-[190px]">
                            <a :href="`/post/${post.slug}`" class="block h-full">
                                <div class="relative h-full">
                                    <img
                                        v-if="post.featureImage"
                                        :src="post.featureImage"
                                        :alt="post.title"
                                        class="w-full h-full object-cover"
                                    />
                                    <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white">
                                        <div v-if="post.categories && post.categories.length > 0" class="mb-2">
                                            <span class="bg-[#fbbf24] text-[#333] px-2 py-1 rounded-md text-xs font-medium">
                                                {{ post.categories[0].name }}
                                            </span>
                                        </div>
                                        <h3 class="text-base font-bold mb-2 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] bg-black/30 inline-block py-1 px-2 rounded">{{ post.title }}</h3>
                                        <span class="text-sm text-white hover:bg-[#06b6d4] transition-colors drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] bg-[#0891b2] px-2 py-1 rounded inline-block ml-2">
                                            Continuar lendo &rarr;
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

            </section>

            <!-- Anúncio entre o carrossel e as Mais Notícias -->
            <div v-if="adSettings.enableAds" class="w-full bg-gray-100 rounded-lg mb-6 overflow-hidden flex justify-center">
                <div class="ad-container ad-banner-mid py-2 px-4" v-if="getAdHtml('betweenSections')">
                    <div v-html="getAdHtml('betweenSections')"></div>
                </div>
                <div class="ad-container ad-banner-mid py-2 px-4" v-else>
                    <div class="ad-placeholder h-[90px] w-full max-w-[728px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                        <span>Anúncio Entre Seções</span>
                    </div>
                </div>
            </div>

            <!-- Main Content Layout -->
            <div class="flex flex-col lg:flex-row gap-6">

                <!-- Main Content Area -->
                <div class="flex-grow">
                    <!-- Título principal que abrange toda a largura -->
                    <h2 class="text-xl font-bold mb-4 pb-2 text-[#0891b2] border-b-2 border-[#fbbf24]">
                        Mais Notícias
                    </h2>
                    
                    <!-- Main Content em um único grid de 3 colunas com scroll infinito -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <!-- Posts começando do 4º (já que os 3 primeiros estão na seção de destaque) -->
                        <template v-for="(post, index) in visibleMainPosts" :key="post.id">
                            <article
                                class="rounded-lg overflow-hidden transition-transform hover:-translate-y-1 duration-300 shadow-sm"
                            >
                                <!-- Conteúdo do card do post -->
                                <a :href="`/post/${post.slug}`" class="block">
                                    <div class="h-48 overflow-hidden relative">
                                        <img
                                            v-if="post.featureImage"
                                            :src="post.featureImage"
                                            :alt="post.title"
                                            class="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                            width="400"
                                            height="225"
                                            :loading="index < 6 ? 'eager' : 'lazy'"
                                        />
                                        <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div v-if="post.categories && post.categories.length > 0" class="absolute top-2 left-2">
                                            <span class="bg-[#fbbf24] text-[#333] px-2 py-1 rounded-md text-xs font-medium">
                                                {{ post.categories[0].name }}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                                <div class="p-4">
                                    <a :href="`/post/${post.slug}`" class="block">
                                        <h3 class="text-lg font-bold text-gray-800 mb-2 hover:text-[#0891b2] transition-colors">
                                            {{ post.title }}
                                        </h3>
                                    </a>
                                    <div class="flex justify-between items-center text-xs text-gray-700">
                                        <span v-if="getAuthor(post)">Por {{ getAuthor(post).name }}</span>
                                        <span>{{ formatDate(post.publishedAt) }}</span>
                                    </div>
                                </div>
                            </article>
                            
                            <!-- Anúncio nativo a cada 6 posts -->
                            <div 
                                v-if="adSettings.enableAds && (index + 1) % 6 === 0" 
                                class="rounded-lg overflow-hidden shadow-sm bg-gray-50"
                            >
                                <div class="ad-container ad-native py-2 px-4 h-full flex flex-col" v-if="getAdHtml('native')">
                                    <div v-html="getAdHtml('native')" class="h-full"></div>
                                </div>
                                <div class="ad-container h-full" v-else>
                                    <div class="h-48 bg-gray-200 flex items-center justify-center">
                                        <span class="text-gray-400 text-sm">Anúncio</span>
                                    </div>
                                    <div class="p-4">
                                        <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <!-- Bottom AdSense Banner -->
                    <div v-if="adSettings.enableAds && adSettings.homePageAfterPosts" class="w-full bg-gray-100 rounded-lg mb-6 overflow-hidden flex justify-center">
                        <div class="ad-container ad-banner-bottom py-2 px-4" v-if="getAdHtml('belowContent')">
                            <div v-html="getAdHtml('belowContent')"></div>
                        </div>
                        <div class="ad-container ad-banner-bottom py-2 px-4" v-else>
                            <div class="ad-placeholder h-[90px] w-full max-w-[728px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                <span>Anúncio Inferior</span>
                            </div>
                        </div>
                    </div>

                    <!-- Loading More Indicator -->
                    <div v-if="loadingMore" class="flex justify-center items-center py-4">
                        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0891b2]"></div>
                        <span class="ml-3 text-gray-600">Carregando mais posts...</span>
                    </div>

                    <!-- Infinite Scroll Observer Target -->
                    <div ref="observerTarget" class="h-4 w-full"></div>
                </div>
            </div>
            


        </div>
    </div>

    <!-- Taboola JS Code -->
    <div v-if="adSettings.enableAds && adSettings.enableTaboolaAds && adSettings.taboolaJsCode" v-html="adSettings.taboolaJsCode"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useHead } from '@unhead/vue';
import { vue3 } from '@cmmv/blog/client';
import { useSettingsStore } from '../../store/settings';
import { useCategoriesStore } from '../../store/categories';
import { usePostsStore } from '../../store/posts';
import { formatDate, stripHtml } from '../../composables/useUtils';
import { useAds } from '../../composables/useAds';
import OptimizedImage from '../composables/OptimizedImage.vue';

// Declare adsbygoogle for TypeScript
declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

const settingsStore = useSettingsStore();
const categoriesStore = useCategoriesStore();
const postsStore = usePostsStore();
const blogAPI = vue3.useBlog();

// State
const rawSettings = computed(() => settingsStore.getSettings);
const settings = computed<Record<string, any>>(() => {
    const settingsObj = rawSettings.value || {};
    // Extract all blog.* settings
    const blogSettings: Record<string, any> = {};
    Object.keys(settingsObj).forEach(key => {
        if (key.startsWith('blog.')) {
            const shortKey = key.replace('blog.', '');
            blogSettings[shortKey] = settingsObj[key];
        }
    });
    return blogSettings;
});
const categories = ref<any[]>(categoriesStore.getCategories || []);
const posts = ref<any[]>(postsStore.getPosts || []);
const loading = ref(false);
const loadingMore = ref(false);
const error = ref(null);
const currentPage = ref(0);
const hasMorePosts = ref(true);
const observerTarget = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const currentCarouselIndex = ref(0);
const carouselInterval = ref<number | null>(null);

// Elements references
const sidebarLeftAdContainer = ref<HTMLElement | null>(null);
const moreContentSection = ref<HTMLElement | null>(null);

// Create formatted settings object for useAds
const adPluginSettings = computed(() => {
    return settings.value || {};
});

// Set up ads functionality using the composable
const { adSettings, getAdHtml, loadAdScripts, loadSidebarLeftAd } = useAds(adPluginSettings.value, 'home');

// Novas configurações de anúncios adicionais
const adPositions = [
  'betweenSections',
  'belowContent', 
  'sidebarLeft', 
  'native', 
  'nativeMoreContent'
];

const coverSettings = computed(() => {
    try {
        const config = settings.value.cover;
        return config ? JSON.parse(config) : { layoutType: 'full' };
    } catch (err) {
        console.error('Error parsing cover settings:', err);
        return { layoutType: 'full' };
    }
});

const hasCoverConfig = computed(() => {
    return !!settings.value.cover && Object.keys(coverSettings.value).length > 0;
});

// Pré-carregamento otimizado de imagens críticas
const criticalImages = computed(() => {
    const images = [];
    
    // Sempre pré-carregar a imagem do banner principal
    if (posts.value.length > 0 && posts.value[0].featureImage) {
        images.push(posts.value[0].featureImage);
    }
    
    return images;
});

// Melhor gerenciamento de preload de imagens
const preloadLinks = computed(() => {
    return criticalImages.value.map(url => ({
        rel: 'preload',
        as: 'image',
        href: url,
        fetchpriority: 'high',
        type: 'image/jpeg' // assumindo que a maioria será JPEG
    }));
});

// Configurar metadados e preloads no head
useHead({
    title: computed(() => settings.value.title),
    meta: computed(() => [
        { name: 'description', content: settings.value.description },
        { name: 'keywords', content: settings.value.keywords },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: settings.value.title },
        { property: 'og:description', content: settings.value.description },
        { property: 'og:image', content: settings.value.logo }
    ]),
    link: computed(() => preloadLinks.value)
});

// Função otimizada para adicionar preload manualmente
const addPreload = (url) => {
    if (!url) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
};

const coverPosts = computed(() => {
    if (!posts.value.length) return {};

    const result: any = {
        full: posts.value[0],
        carousel: posts.value.slice(0, 3),
        splitMain: posts.value[0],
        splitSide: posts.value.slice(1, 3),
        dual: posts.value.slice(0, 2)
    };

    if (hasCoverConfig.value) {
        const config = coverSettings.value;
        const shouldRespectSelectedPosts = config.respectSelectedPosts !== false;

        if (shouldRespectSelectedPosts) {
            // Handle "full" layout
            if (config.layoutType === 'full' && config.fullCover?.postId) {
                const configPost = posts.value.find(p => p.id === config.fullCover.postId);
                if (configPost) result.full = configPost;
            }

            // Handle "carousel" layout
            if (config.layoutType === 'carousel' && Array.isArray(config.carousel)) {
                const carouselPostIds = config.carousel
                    .filter(item => item && item.postId)
                    .map(item => item.postId);

                if (carouselPostIds.length) {
                    const configPosts = carouselPostIds
                        .map((id: string) => posts.value.find(p => p.id === id))
                        .filter(Boolean);

                    if (configPosts.length) result.carousel = configPosts;
                }
            }

            // Handle "split" layout
            if (config.layoutType === 'split') {
                // Main post
                if (config.split?.main?.postId) {
                    const mainPost = posts.value.find(p => p.id === config.split.main.postId);
                    if (mainPost) result.splitMain = mainPost;
                }

                // Secondary posts
                if (Array.isArray(config.split?.secondary)) {
                    const secondaryPostIds = config.split.secondary
                        .filter(item => item && item.postId)
                        .map(item => item.postId);

                    if (secondaryPostIds.length) {
                        const secondaryPosts = secondaryPostIds
                            .map((id: string) => posts.value.find(p => p.id === id))
                            .filter(Boolean);

                        if (secondaryPosts.length) result.splitSide = secondaryPosts;
                    }
                }
            }

            // Handle "dual" layout
            if (config.layoutType === 'dual' && Array.isArray(config.dual)) {
                const dualPostIds = config.dual
                    .filter(item => item && item.postId)
                    .map(item => item.postId);

                if (dualPostIds.length) {
                    const configPosts = dualPostIds
                        .map((id: string) => posts.value.find(p => p.id === id))
                        .filter(Boolean);

                    if (configPosts.length) result.dual = configPosts;
                }
            }
        }
    }

    return result;
});

// Funções otimizadas para o carrossel
const startCarouselInterval = () => {
    stopCarouselInterval(); // Limpar qualquer intervalo existente primeiro
    
    if (coverSettings.value.layoutType === 'carousel' && coverPosts.value.carousel?.length > 1) {
        carouselInterval.value = window.setInterval(nextCarouselSlide, 5000);
    }
};

const stopCarouselInterval = () => {
    if (carouselInterval.value) {
        clearInterval(carouselInterval.value);
        carouselInterval.value = null;
    }
};

const nextCarouselSlide = () => {
    if (coverPosts.value.carousel?.length) {
        currentCarouselIndex.value = (currentCarouselIndex.value + 1) % coverPosts.value.carousel.length;
    }
};

const prevCarouselSlide = () => {
    if (coverPosts.value.carousel?.length) {
        currentCarouselIndex.value = (currentCarouselIndex.value - 1 + coverPosts.value.carousel.length) % coverPosts.value.carousel.length;
    }
};

const pagination = ref({
    total: 0,
    limit: 12,
    offset: 0
});

const featuredPost = computed(() => {
    return posts.value.length > 0 ? posts.value[0] : null;
});

const reviewPosts = computed(() => {
    const reviewCategory = categories.value.find(cat =>
        cat.name.toLowerCase() === 'review' ||
        cat.name.toLowerCase() === 'reviews' ||
        cat.name.toLowerCase() === 'análise' ||
        cat.name.toLowerCase() === 'análises');

    if (reviewCategory) {
        return posts.value.filter(post =>
            post.categories &&
            post.categories.some(cat => cat.id === reviewCategory.id)
        ).slice(0, 2);
    } else {
        const middleIndex = Math.min(Math.floor(posts.value.length / 2), 5);
        return posts.value.slice(middleIndex, middleIndex + 2);
    }
});

// Função de carregamento de posts otimizada
const loadPosts = async () => {
    if (loading.value) return;
    
    try {
        loading.value = true;
        error.value = null;

        const response: any = await blogAPI.posts.getAll(currentPage.value * pagination.value.limit);

        if (response) {
            posts.value = response.posts;

            pagination.value = {
                total: response.meta?.pagination?.total || 0,
                limit: response.meta?.pagination?.limit || 12,
                offset: response.meta?.pagination?.offset || 0
            };

            hasMorePosts.value = posts.value.length < response.count;

            if (!categories.value.length) {
                try {
                    const categoriesResponse = await blogAPI.categories.getAll();
                    if (categoriesResponse) {
                        categories.value = categoriesResponse;
                    }
                } catch (err) {
                    console.error('Failed to load categories:', err);
                }
            }
        }
    } catch (err: any) {
        console.error('Failed to load posts:', err);
        error.value = err;
    } finally {
        loading.value = false;
    }
};

// Função de carregamento de mais posts otimizada
const loadMorePosts = async () => {
    if (loadingMore.value || !hasMorePosts.value) return;

    try {
        loadingMore.value = true;
        currentPage.value++;

        const response: any = await blogAPI.posts.getAll(posts.value.length);

        if (response && response.posts && response.posts.length > 0) {
            posts.value = [...posts.value, ...response.posts];

            pagination.value = {
                total: response.meta?.pagination?.total || 0,
                limit: response.meta?.pagination?.limit || 12,
                offset: response.meta?.pagination?.offset || 0
            };

            hasMorePosts.value = posts.value.length < response.count;
        } else {
            hasMorePosts.value = false;
        }
    } catch (err: any) {
        console.error('Failed to load more posts:', err);
    } finally {
        loadingMore.value = false;
    }
};

const setupIntersectionObserver = () => {
    if (observer.value) {
        observer.value.disconnect();
    }
    
    observer.value = new IntersectionObserver(
        (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMorePosts.value && !loadingMore.value)
                loadMorePosts();
        },
        { threshold: 0.1 }
    );

    if (observerTarget.value) {
        observer.value.observe(observerTarget.value);
    }
};

const getAuthor = (post: any) => {
    if (!post.authors || !post.authors.length) return null;
    return post.authors.find((author: any) => author.id === post.author);
};

// Função para ajustar posição do banner lateral
const adjustSidebarAdPosition = () => {
  if (!sidebarLeftAdContainer.value) return;
  
  const viewportWidth = window.innerWidth;
  const mainContainerWidth = 1320; // Largura ajustada considerando margens
  
  if (viewportWidth >= 1280) { // xl breakpoint
    // Calcular a margem, mas com um limite mínimo para evitar sobreposição
    const margin = Math.min(Math.max(10, (viewportWidth - mainContainerWidth) / 2), 20);
    sidebarLeftAdContainer.value.style.marginLeft = `${margin}px`;
    sidebarLeftAdContainer.value.style.display = 'block';
  } else {
    sidebarLeftAdContainer.value.style.display = 'none';
  }
};

onMounted(async () => {
    // Evitar carregamento duplicado se já tivermos posts
    if (posts.value.length === 0) {
        await loadPosts();
    }
    
    setupIntersectionObserver();
    startCarouselInterval();

    // Carregar todos os scripts de anúncios
    loadAdScripts();
    
    // Inicializar e ajustar anúncio lateral
    nextTick(() => {
        adjustSidebarAdPosition();
        window.addEventListener('resize', adjustSidebarAdPosition);
        
        // Carregar anúncio lateral se estiver visível
        if (sidebarLeftAdContainer.value && window.innerWidth >= 1280) {
            loadSidebarLeftAd(sidebarLeftAdContainer.value);
        }
    });
    
    // Pré-carregar a imagem de capa principal quando disponível
    if (posts.value && posts.value.length > 0 && posts.value[0].featureImage) {
        addPreload(posts.value[0].featureImage);
    }
    

    

});



onUnmounted(() => {
    if (observer.value && observerTarget.value) {
        observer.value.unobserve(observerTarget.value);
        observer.value.disconnect();
    }
    stopCarouselInterval();
    
    // Remover event listener ao desmontar
    window.removeEventListener('resize', adjustSidebarAdPosition);
});

watch(() => settings.value['blog.cover'], () => {
    stopCarouselInterval();
    startCarouselInterval();
}, { deep: true });



// Computed para posts da seção "Mais Notícias" com scroll infinito
const visibleMainPosts = computed(() => {
    // Retorna todos os posts exceto os 3 primeiros (que estão na seção de destaque)
    return posts.value.slice(3);
});





// Função para agrupar posts em grupos
const groupPosts = (posts: any[], postsPerGroup: number) => {
    if (!posts || !Array.isArray(posts)) return [];
    
    const groups = [];
    for (let i = 0; i < posts.length; i += postsPerGroup) {
        groups.push(posts.slice(i, i + postsPerGroup));
    }
    return groups;
};

// Observar mudanças nos posts - removido para simplificar
// watch(posts, (newPosts) => { ... }, { deep: true });

</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.ad-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #ccc;
    border-radius: 4px;
}

/* Estilos específicos para anúncios laterais */
.ad-sidebar-left {
    transition: opacity 0.3s ease;
}

/* Only hide the left sidebar on screens smaller than 1280px */
@media (max-width: 1279px) {
    .ad-sidebar-left {
        display: none;
    }
}
</style>


