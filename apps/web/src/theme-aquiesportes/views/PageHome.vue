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

        <div v-if="error" class="text-center py-16 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-2xl font-bold mb-2 text-gray-800">Erro ao carregar posts</h2>
            <p class="text-gray-600 mb-4">Não foi possível carregar os posts. Por favor, tente novamente.</p>
            <button @click="loadPosts" class="px-4 py-2 bg-[#001E62] text-white rounded-md hover:bg-[#00378F] transition-colors">
                Tentar novamente
            </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="posts.length === 0" class="text-center py-16 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 class="text-2xl font-bold mb-2 text-gray-800">Nenhum post encontrado</h2>
            <p class="text-gray-600">Volte mais tarde para novos conteúdos!</p>
        </div>

        <div v-else>
            <!-- Cover Section -->
            <section v-if="posts.length > 0" class="mb-6 md:block hidden">
                <!-- Full Layout (default) -->
                <div v-if="coverSettings.layoutType === 'full' || !coverSettings.layoutType" class="bg-white rounded-lg overflow-hidden shadow-md">
                    <a v-if="coverPosts.full" :href="`/post/${coverPosts.full.slug}`" class="block">
                        <div class="relative h-[400px]">
                            <OptimizedImage
                                v-if="coverPosts.full && coverPosts.full.featureImage"
                                :src="coverPosts.full.featureImage"
                                :alt="coverPosts.full.title"
                                class="w-full h-full object-cover"
                                width="890"
                                height="606"
                                :title="coverPosts.full.title"
                                aria-label="Cover Image"
                                :critical="true"
                            />
                            <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white">
                                <div v-if="coverPosts.full && coverPosts.full.categories && coverPosts.full.categories.length > 0" class="mb-2">
                                    <span class="bg-[#ffcc00] text-[#333] px-3 py-1 rounded-md text-sm font-medium">
                                        {{ coverPosts.full.categories[0].name }}
                                    </span>
                                </div>
                                <h2 v-if="coverPosts.full" class="text-2xl md:text-3xl font-bold mb-3 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] bg-black/30 inline-block py-1 px-2 rounded">{{ coverPosts.full.title }}</h2>
                                <p v-if="coverPosts.full" class="text-gray-100 mb-4 line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] bg-black/25 p-2 rounded max-w-2xl">
                                    {{ coverPosts.full.excerpt || stripHtml(coverPosts.full.content).substring(0, 150) + '...' }}
                                </p>
                                <span class="inline-block bg-[#001E62] hover:bg-[#00378F] text-white px-4 py-2 rounded-md transition-colors">
                                    Continuar lendo
                                </span>
                            </div>
                        </div>
                    </a>
                </div>

                <!-- Carousel Layout -->
                <div v-else-if="coverSettings.layoutType === 'carousel'" class="bg-white rounded-lg overflow-hidden shadow-md">
                    <div class="relative h-[400px]">
                        <div v-for="(post, index) in coverPosts.carousel" :key="post.id"
                             class="absolute w-full h-full transition-opacity duration-500 ease-in-out"
                             :class="{ 'opacity-100': currentCarouselIndex === index, 'opacity-0': currentCarouselIndex !== index }">
                            <a :href="`/post/${post.slug}`" class="block h-full">
                                <OptimizedImage
                                    v-if="post.featureImage"
                                    :src="post.featureImage"
                                    :alt="post.title"
                                    class="w-full h-full object-cover"
                                    width="890"
                                    height="606"
                                    :title="post.title"
                                    aria-label="Cover Image"
                                    :critical="index === 0"
                                />
                                <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white">
                                    <div v-if="post.categories && post.categories.length > 0" class="mb-2">
                                        <span class="bg-[#ffcc00] text-[#333] px-3 py-1 rounded-md text-sm font-medium">
                                            {{ post.categories[0].name }}
                                        </span>
                                    </div>
                                    <h2 class="text-2xl md:text-3xl font-bold mb-3 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] bg-black/30 inline-block py-1 px-2 rounded">{{ post.title }}</h2>
                                    <p class="text-gray-100 mb-4 line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] bg-black/25 p-2 rounded max-w-2xl">
                                        {{ post.excerpt || stripHtml(post.content).substring(0, 150) + '...' }}
                                    </p>
                                    <span class="inline-block bg-[#001E62] hover:bg-[#00378F] text-white px-4 py-2 rounded-md transition-colors">
                                        Continuar lendo
                                    </span>
                                </div>
                            </a>
                        </div>

                        <!-- Carousel Controls -->
                        <div class="absolute top-0 bottom-0 left-0 flex items-center">
                            <button @click="prevCarouselSlide" class="bg-black/30 hover:bg-black/50 text-white p-2 rounded-r-md focus:outline-none z-10" aria-label="Slide anterior">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </div>
                        <div class="absolute top-0 bottom-0 right-0 flex items-center">
                            <button @click="nextCarouselSlide" class="bg-black/30 hover:bg-black/50 text-white p-2 rounded-l-md focus:outline-none z-10" aria-label="Próximo slide">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <!-- Carousel Indicators -->
                        <div class="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 z-10">
                            <button
                                v-for="(_, index) in coverPosts.carousel"
                                :key="index"
                                @click="currentCarouselIndex = index"
                                class="w-3 h-3 rounded-full bg-white/50 focus:outline-none"
                                :class="{ 'bg-white': currentCarouselIndex === index }"
                                :aria-label="`Ir para slide ${index + 1}`"
                            ></button>
                        </div>
                    </div>
                </div>

                <!-- Split Layout (1 large, 2 small) -->
                <div v-else-if="coverSettings.layoutType === 'split'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="md:col-span-2 bg-white rounded-lg overflow-hidden shadow-md">
                        <a v-if="coverPosts.splitMain" :href="`/post/${coverPosts.splitMain.slug}`" class="block h-full">
                            <div class="relative h-full">
                                <OptimizedImage
                                    v-if="coverPosts.splitMain && coverPosts.splitMain.featureImage"
                                    :src="coverPosts.splitMain.featureImage"
                                    :alt="coverPosts.splitMain.title"
                                    class="w-full h-full object-cover"
                                    width="890"
                                    height="606"
                                    :title="coverPosts.splitMain.title"
                                    aria-label="Cover Image"
                                    :critical="true"
                                />
                                <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white">
                                    <div v-if="coverPosts.splitMain && coverPosts.splitMain.categories && coverPosts.splitMain.categories.length > 0" class="mb-2">
                                        <span class="bg-[#ffcc00] text-[#333] px-3 py-1 rounded-md text-sm font-medium">
                                            {{ coverPosts.splitMain.categories[0].name }}
                                        </span>
                                    </div>
                                    <h2 v-if="coverPosts.splitMain" class="text-xl md:text-2xl font-bold mb-3 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] bg-black/30 inline-block py-1 px-2 rounded">{{ coverPosts.splitMain.title }}</h2>
                                    <p v-if="coverPosts.splitMain" class="text-gray-100 mb-4 line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] bg-black/25 p-2 rounded max-w-2xl">
                                        {{ coverPosts.splitMain.excerpt || stripHtml(coverPosts.splitMain.content).substring(0, 150) + '...' }}
                                    </p>
                                    <span class="inline-block bg-[#001E62] hover:bg-[#00378F] text-white px-4 py-2 rounded-md transition-colors">
                                        Continuar lendo
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="md:col-span-1 flex flex-col gap-4">
                        <div v-for="(post, index) in coverPosts.splitSide" :key="post.id" class="flex-1 bg-white rounded-lg overflow-hidden shadow-md">
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
                                            <span class="bg-[#ffcc00] text-[#333] px-2 py-1 rounded-md text-xs font-medium">
                                                {{ post.categories[0].name }}
                                            </span>
                                        </div>
                                        <h3 class="text-base font-bold mb-2 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] bg-black/30 inline-block py-1 px-2 rounded">{{ post.title }}</h3>
                                        <span class="text-sm text-white hover:text-[#ffcc00] transition-colors drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] bg-black/25 px-2 py-1 rounded inline-block">
                                            Continuar lendo &rarr;
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Dual Layout (2 equal columns) -->
                <div v-else-if="coverSettings.layoutType === 'dual'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="post in coverPosts.dual" :key="post.id" class="bg-white rounded-lg overflow-hidden shadow-md">
                        <a :href="`/post/${post.slug}`" class="block">
                            <div class="relative h-[350px]">
                                <img
                                    v-if="post.featureImage"
                                    :src="post.featureImage"
                                    :alt="post.title"
                                    class="w-full h-full object-cover"
                                    loading="lazy"
                                    width="890"
                                    height="606"
                                    :title="post.title"
                                    aria-label="Cover Image"
                                    fetchpriority="high"
                                />
                                <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent text-white">
                                    <div v-if="post.categories && post.categories.length > 0" class="mb-2">
                                        <span class="bg-[#ffcc00] text-[#333] px-3 py-1 rounded-md text-sm font-medium">
                                            {{ post.categories[0].name }}
                                        </span>
                                    </div>
                                    <h2 class="text-xl md:text-2xl font-bold mb-3 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] bg-black/30 inline-block py-1 px-2 rounded">{{ post.title }}</h2>
                                    <p class="text-gray-100 mb-4 line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] bg-black/25 p-2 rounded max-w-2xl">
                                        {{ post.excerpt || stripHtml(post.content).substring(0, 120) + '...' }}
                                    </p>
                                    <span class="inline-block bg-[#001E62] hover:bg-[#00378F] text-white px-4 py-2 rounded-md transition-colors">
                                        Continuar lendo
                                    </span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            <!-- Anúncio entre o carrossel e as Últimas Notícias -->
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
                    <h2 class="text-xl font-bold mb-4 pb-2 text-[#001E62] border-b-2 border-[#ffcc00]">
                        Últimas Notícias
                    </h2>
                    
                    <!-- Main Content em um único grid de 3 colunas -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <!-- Primeiros 4 posts -->
                        <article
                            v-for="post in posts.slice(3, 7)"
                            :key="post.id"
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
                                        loading="eager"
                                    />
                                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div v-if="post.categories && post.categories.length > 0" class="absolute top-2 left-2">
                                        <span class="bg-[#ffcc00] text-[#333] px-2 py-1 rounded-md text-xs font-medium">
                                            {{ post.categories[0].name }}
                                        </span>
                                    </div>
                                </div>
                            </a>
                            <div class="p-4">
                                <a :href="`/post/${post.slug}`" class="block">
                                    <h3 class="text-lg font-bold text-gray-800 mb-2 hover:text-[#001E62] transition-colors">
                                        {{ post.title }}
                                    </h3>
                                </a>
                                <div class="flex justify-between items-center text-xs text-gray-700">
                                    <span v-if="getAuthor(post)">Por {{ getAuthor(post).name }}</span>
                                    <span>{{ formatDate(post.publishedAt) }}</span>
                                </div>
                            </div>
                        </article>
                        
                        <!-- Anúncio nativo (parece um card de conteúdo) -->
                        <div v-if="adSettings.enableAds" class="rounded-lg overflow-hidden shadow-sm bg-white">
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
                        
                        <!-- Restantes 4 posts -->
                        <article
                            v-for="post in posts.slice(7, 11)"
                            :key="post.id"
                            class="rounded-lg overflow-hidden transition-transform hover:-translate-y-1 duration-300 shadow-sm"
                        >
                            <a :href="`/post/${post.slug}`" class="block">
                                <div class="h-48 overflow-hidden relative">
                                    <img
                                        v-if="post.featureImage"
                                        :src="post.featureImage"
                                        :alt="post.title"
                                        class="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                        width="400"
                                        height="225"
                                        loading="eager"
                                    />
                                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div v-if="post.categories && post.categories.length > 0" class="absolute top-2 left-2">
                                        <span class="bg-[#ffcc00] text-[#333] px-2 py-1 rounded-md text-xs font-medium">
                                            {{ post.categories[0].name }}
                                        </span>
                                    </div>
                                </div>
                            </a>
                            <div class="p-4">
                                <a :href="`/post/${post.slug}`" class="block">
                                    <h3 class="text-lg font-bold text-gray-800 mb-2 hover:text-[#001E62] transition-colors">
                                        {{ post.title }}
                                    </h3>
                                </a>
                                <div class="flex justify-between items-center text-xs text-gray-700">
                                    <span v-if="getAuthor(post)">Por {{ getAuthor(post).name }}</span>
                                    <span>{{ formatDate(post.publishedAt) }}</span>
                                </div>
                            </div>
                        </article>
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
                        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#001E62]"></div>
                        <span class="ml-3 text-gray-600">Carregando mais posts...</span>
                    </div>

                    <!-- Infinite Scroll Observer Target -->
                    <div ref="observerTarget" class="h-4 w-full"></div>
                </div>
            </div>
            
            <!-- Anúncio antes da seção Mais Populares -->
            <div v-if="adSettings.enableAds" class="w-full bg-gray-100 rounded-lg mb-6 overflow-hidden flex justify-center">
                <div class="ad-container ad-banner-before-popular py-2 px-4" v-if="getAdHtml('beforePopular')">
                    <div v-html="getAdHtml('beforePopular')"></div>
                </div>
                <div class="ad-container ad-banner-before-popular py-2 px-4" v-else>
                    <div class="ad-placeholder h-[90px] w-full max-w-[728px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                        <span>Anúncio Antes dos Populares</span>
                    </div>
                </div>
            </div>
            
            <!-- Mais Populares Section -->
            <section class="mb-6">
                <h2 class="text-xl font-bold mb-4 pb-2 text-[#001E62] border-b-2 border-[#ffcc00]">
                    Mais Populares
                </h2>

                <!-- Mensagem de diagnóstico (temporária) -->
                <div v-if="!popularPosts || popularPosts.length === 0" 
                     class="p-4 bg-gray-100 rounded-lg text-center mb-4">
                    <p>Nenhum post popular encontrado</p>
                </div>

                <!-- Grid de posts populares -->
                <div v-if="popularPosts && popularPosts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <!-- Primeiros 4 posts populares -->
                    <article v-for="post in popularPosts.slice(0, 4)" :key="post.id" 
                         class="rounded-lg overflow-hidden transition-transform hover:-translate-y-1 duration-300 shadow-sm">
                        <a :href="`/post/${post.slug}`" class="block">
                            <div class="h-48 overflow-hidden relative">
                                <img
                                    v-if="post.featureImage"
                                    :src="post.featureImage"
                                    :alt="post.title"
                                    class="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                    width="400"
                                    height="225"
                                    loading="lazy"
                                />
                                <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div v-if="post.categories && post.categories.length > 0" class="absolute top-2 left-2">
                                    <span class="bg-[#ffcc00] text-[#333] px-2 py-1 rounded-md text-xs font-medium">
                                        {{ post.categories[0].name }}
                                    </span>
                                </div>
                            </div>
                        </a>
                        <div class="p-4">
                            <a :href="`/post/${post.slug}`" class="block">
                                <h3 class="text-lg font-bold text-gray-800 mb-2 hover:text-[#001E62] transition-colors">
                                    {{ post.title }}
                                </h3>
                            </a>
                            <div class="flex justify-between items-center text-xs text-gray-700">
                                <span v-if="getAuthor(post)">Por {{ getAuthor(post).name }}</span>
                                <span>{{ formatDate(post.publishedAt) }}</span>
                            </div>
                        </div>
                    </article>
                    
                    <!-- Anúncio nativo entre posts populares -->
                    <div v-if="adSettings.enableAds" class="rounded-lg overflow-hidden shadow-sm bg-white">
                        <div class="ad-container ad-native-popular py-2 px-4 h-full flex flex-col" v-if="getAdHtml('nativePopular')">
                            <div v-html="getAdHtml('nativePopular')" class="h-full"></div>
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
                    
                    <!-- Restantes 4 posts populares -->
                    <article v-for="post in popularPosts.slice(4, 8)" :key="post.id" 
                         class="rounded-lg overflow-hidden transition-transform hover:-translate-y-1 duration-300 shadow-sm">
                        <a :href="`/post/${post.slug}`" class="block">
                            <div class="h-48 overflow-hidden relative">
                                <img
                                    v-if="post.featureImage"
                                    :src="post.featureImage"
                                    :alt="post.title"
                                    class="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                    width="400"
                                    height="225"
                                    loading="lazy"
                                />
                                <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div v-if="post.categories && post.categories.length > 0" class="absolute top-2 left-2">
                                    <span class="bg-[#ffcc00] text-[#333] px-2 py-1 rounded-md text-xs font-medium">
                                        {{ post.categories[0].name }}
                                    </span>
                                </div>
                            </div>
                        </a>
                        <div class="p-4">
                            <a :href="`/post/${post.slug}`" class="block">
                                <h3 class="text-lg font-bold text-gray-800 mb-2 hover:text-[#001E62] transition-colors">
                                    {{ post.title }}
                                </h3>
                            </a>
                            <div class="flex justify-between items-center text-xs text-gray-700">
                                <span v-if="getAuthor(post)">Por {{ getAuthor(post).name }}</span>
                                <span>{{ formatDate(post.publishedAt) }}</span>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
            
            <!-- Anúncio entre Mais Populares e Mais Conteúdo -->
            <div v-if="adSettings.enableAds && posts.length > 11" class="w-full bg-gray-100 rounded-lg mb-6 overflow-hidden flex justify-center">
                <div class="ad-container ad-banner-between-popular-more py-2 px-4" v-if="getAdHtml('betweenPopularMore')">
                    <div v-html="getAdHtml('betweenPopularMore')"></div>
                </div>
                <div class="ad-container ad-banner-between-popular-more py-2 px-4" v-else>
                    <div class="ad-placeholder h-[90px] w-full max-w-[728px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                        <span>Anúncio Entre Populares e Mais Conteúdo</span>
                    </div>
                </div>
            </div>
            
            <!-- Seção Mais Conteúdo -->
            <div v-if="posts.length > 11" class="flex-grow mt-6" ref="moreContentSection">
                <h2 class="text-xl font-bold mb-4 pb-2 text-[#001E62] border-b-2 border-[#ffcc00]">
                    Mais Conteúdo
                </h2>

                <!-- Grid principal de conteúdo com paginação -->
                <div class="relative">
                    <!-- Conteúdo paginado -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- Primeiros posts na página atual -->
                        <template v-for="(post, index) in currentMoreContentPosts" :key="post.id">
                            <article
                                class="rounded-lg overflow-hidden transition-transform hover:-translate-y-1 duration-300 shadow-sm"
                            >
                                <a :href="`/post/${post.slug}`" class="block">
                                    <div class="h-48 overflow-hidden relative">
                                        <OptimizedImage
                                            v-if="post.featureImage"
                                            :src="post.featureImage"
                                            :alt="post.title"
                                            class="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                                            width="400"
                                            height="225"
                                        />
                                        <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div v-if="post.categories && post.categories.length > 0" class="absolute top-2 left-2">
                                            <span class="bg-[#ffcc00] text-[#333] px-2 py-1 rounded-md text-xs font-medium">
                                                {{ post.categories[0].name }}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                                <div class="p-4">
                                    <a :href="`/post/${post.slug}`" class="block">
                                        <h3 class="text-lg font-bold text-gray-800 mb-2 hover:text-[#001E62] transition-colors">
                                            {{ post.title }}
                                        </h3>
                                    </a>
                                    <div class="flex justify-between items-center text-xs text-gray-700">
                                        <span v-if="getAuthor(post)">Por {{ getAuthor(post).name }}</span>
                                        <span>{{ formatDate(post.publishedAt) }}</span>
                                    </div>
                                </div>
                            </article>
                            
                            <!-- Anúncio nativo após o 3º post -->
                            <div 
                                v-if="adSettings.enableAds && index === 2" 
                                class="rounded-lg overflow-hidden shadow-sm bg-white"
                            >
                                <div class="ad-container ad-native-more-content py-2 px-4 h-full flex flex-col" v-if="getAdHtml('nativeMoreContent')">
                                    <div v-html="getAdHtml('nativeMoreContent')" class="h-full"></div>
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

                    <!-- Controles de paginação -->
                    <div class="flex justify-center mt-8 w-full overflow-x-auto pb-4">
                        <div class="flex items-center space-x-2 px-4 min-w-fit">
                            <button 
                                @click="prevMoreContentPage" 
                                class="bg-[#001E62] text-white px-3 py-2 rounded-md hover:bg-[#00378F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm sm:text-base sm:px-4"
                                :disabled="currentMoreContentPage === 0"
                                aria-label="Página anterior de conteúdo"
                            >
                                Anterior
                            </button>
                            <div class="flex items-center space-x-1 sm:space-x-2 overflow-visible">
                                <button
                                    v-for="pageIndex in visiblePageNumbers"
                                    :key="pageIndex"
                                    @click="pageIndex >= 0 ? goToMoreContentPage(pageIndex) : null"
                                    class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors text-sm sm:text-base"
                                    :class="{ 
                                        'bg-[#001E62] text-white': currentMoreContentPage === pageIndex, 
                                        'bg-gray-200 text-gray-600 hover:bg-gray-300': currentMoreContentPage !== pageIndex && pageIndex >= 0,
                                        'bg-transparent cursor-default': pageIndex < 0
                                    }"
                                    :aria-label="pageIndex >= 0 ? `Ir para página ${pageIndex + 1}` : 'Páginas omitidas'"
                                >
                                    <span v-if="pageIndex >= 0">{{ pageIndex + 1 }}</span>
                                    <span v-else>...</span>
                                </button>
                            </div>
                            <button 
                                @click="nextMoreContentPage" 
                                class="bg-[#001E62] text-white px-3 py-2 rounded-md hover:bg-[#00378F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm sm:text-base sm:px-4"
                                :disabled="currentMoreContentPage >= moreContentPages.length - 1"
                                aria-label="Próxima página de conteúdo"
                            >
                                Próximo
                            </button>
                        </div>
                    </div>
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
import { useMostAccessedPostsStore } from '../../store/mostaccessed';
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
const mostAccessedStore = useMostAccessedPostsStore();
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
const popularPosts = ref<any[]>(mostAccessedStore.getMostAccessedPosts || []);
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
  'nativePopular',
  'nativeMoreContent',
  'beforePopular',
  'betweenPopularMore'
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
    
    // Adicionar as primeiras imagens da seção "Mais Populares" se existirem
    if (popularPosts.value && popularPosts.value.length > 0) {
        const firstPopularPost = popularPosts.value[0];
        if (firstPopularPost && firstPopularPost.featureImage) {
            images.push(firstPopularPost.featureImage);
        }
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
    
    // Carregar posts populares
    try {
        const response = await blogAPI.posts.getMostAccessed();
        console.log("API de posts populares respondeu:", response ? "Sim" : "Não");
        if (response && Array.isArray(response) && response.length > 0) {
            console.log(`API retornou ${response.length} posts populares`);
            
            // Ordena os posts mais populares pela data de publicação (mais recentes primeiro)
            const sortedPosts = [...response].sort((a, b) => {
                const dateA = new Date(a.publishedAt || a.updatedAt).getTime();
                const dateB = new Date(b.publishedAt || b.updatedAt).getTime();
                return dateB - dateA; // Ordem decrescente (mais recentes primeiro)
            });
            
            // Remove posts duplicados usando o ID como chave
            const uniquePosts = [];
            const seenIds = new Set();
            
            for (const post of sortedPosts) {
                if (!seenIds.has(post.id)) {
                    seenIds.add(post.id);
                    uniquePosts.push(post);
                }
            }
            
            console.log(`Após remover duplicatas: ${uniquePosts.length} posts únicos`);
            
            // Usar apenas posts únicos, até o máximo de 12
            let finalPosts = uniquePosts;
            if (finalPosts.length > 12) {
                finalPosts = finalPosts.slice(0, 12);
            }
            
            console.log(`Posts finais para exibição: ${finalPosts.length}`);
            
            // Garantir que todos os posts tenham a propriedade featureImage definida
            finalPosts = finalPosts.map(post => {
                if (!post.featureImage) {
                    post.featureImage = post.feature_image || post.image || post.coverImage || post.cover_image;
                }
                return post;
            });
            
            // Agrupar os posts em conjuntos de 3
            groupedPopularPosts.value = groupPosts(finalPosts, 3);
            console.log(`Grupos criados: ${groupedPopularPosts.value.length}`);
            
            popularPosts.value = finalPosts;
            console.log(`popularPosts.value tem ${popularPosts.value.length} itens`);
        } else {
            console.warn("API de posts populares não retornou dados válidos, usando fallback");
            useFallbackPopularPosts();
        }
    } catch (err) {
        console.error('Erro ao carregar posts populares:', err);
        useFallbackPopularPosts();
    }
    
    // Inicializar páginas para a seção Mais Conteúdo
    if (posts.value.length > 11) {
        const moreContentPostsData = posts.value.slice(11);
        moreContentPages.value = groupPosts(moreContentPostsData, postsPerMoreContentPage);
    }
});

// Função para usar posts regulares como fallback para posts populares
const useFallbackPopularPosts = () => {
    if (posts.value && posts.value.length > 0) {
        console.log("Usando posts regulares como fallback para posts populares");
        // Usar um número suficiente de posts para preencher a grade (8 posts)
        popularPosts.value = posts.value.slice(0, Math.min(12, posts.value.length));
        
        // Garantir que temos pelo menos 8 posts
        if (popularPosts.value.length < 8) {
            // Duplicar alguns posts para atingir 8 se necessário
            const additionalNeeded = 8 - popularPosts.value.length;
            if (additionalNeeded > 0 && popularPosts.value.length > 0) {
                // Duplicar os primeiros posts para preencher
                const duplicates = [];
                for (let i = 0; i < additionalNeeded; i++) {
                    const duplicatePost = {...popularPosts.value[i % popularPosts.value.length]};
                    // Adicionar um sufixo ao ID para evitar problemas de chave duplicada
                    duplicatePost.id = duplicatePost.id + '_duplicate_' + i;
                    duplicates.push(duplicatePost);
                }
                popularPosts.value = [...popularPosts.value, ...duplicates];
            }
        }
        
        groupedPopularPosts.value = groupPosts(popularPosts.value, 3);
    }
};

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

// Variáveis para o carrossel de posts populares
const groupedPopularPosts = ref<any[][]>([]);
const currentPopularPage = ref(0);

// Variáveis para a paginação de Mais Conteúdo
const moreContentPages = ref<any[][]>([]);
const currentMoreContentPage = ref(0);
const postsPerMoreContentPage = 8; // Alterado de 9 para 8 posts por página

// Computed para obter os posts da página atual na seção Mais Conteúdo
const currentMoreContentPosts = computed(() => {
    if (moreContentPages.value.length === 0) return [];
    return moreContentPages.value[currentMoreContentPage.value];
});

// Funções para o carrossel de posts populares
const nextPopularPage = () => {
    // Função mantida para compatibilidade, mas não faz nada
};

const prevPopularPage = () => {
    // Função mantida para compatibilidade, mas não faz nada
};

const goToPopularPage = (index: number) => {
    // Função mantida para compatibilidade, mas não faz nada
};

// Funções para navegação da seção Mais Conteúdo
const nextMoreContentPage = () => {
    if (currentMoreContentPage.value < moreContentPages.value.length - 1) {
        currentMoreContentPage.value++;
        scrollToMoreContentSection();
    }
};

const prevMoreContentPage = () => {
    if (currentMoreContentPage.value > 0) {
        currentMoreContentPage.value--;
        scrollToMoreContentSection();
    }
};

const goToMoreContentPage = (index: number) => {
    currentMoreContentPage.value = index;
    scrollToMoreContentSection();
};

// Função separada para scrollar até a seção de conteúdo para reduzir duplicação
const scrollToMoreContentSection = () => {
    setTimeout(() => {
        if (moreContentSection.value) {
            // Usar um offset para garantir que a seção fique totalmente visível
            window.scrollTo({
                top: moreContentSection.value.offsetTop - 30,
                behavior: 'smooth'
            });
        }
    }, 200);
};

// Função para agrupar posts em grupos
const groupPosts = (posts: any[], postsPerGroup: number) => {
    if (!posts || !Array.isArray(posts)) return [];
    
    const groups = [];
    for (let i = 0; i < posts.length; i += postsPerGroup) {
        groups.push(posts.slice(i, i + postsPerGroup));
    }
    return groups;
};

// Observar mudanças nos posts para atualizar a paginação
watch(posts, (newPosts) => {
    if (newPosts.length > 11) {
        const moreContentPostsData = newPosts.slice(11);
        moreContentPages.value = groupPosts(moreContentPostsData, postsPerMoreContentPage);
        currentMoreContentPage.value = 0; // Resetar para a primeira página quando os posts mudarem
    }
}, { deep: true });

// Computed para obter os números de página a serem exibidos na paginação (com ellipsis)
const visiblePageNumbers = computed(() => {
    const totalPages = moreContentPages.value.length;
    if (totalPages <= 7) {
        // Se tivermos 7 ou menos páginas, mostrar todas
        return Array.from({ length: totalPages }, (_, i) => i);
    }
    
    const current = currentMoreContentPage.value;
    
    // Mostrar sempre a primeira e a última página, e algumas ao redor da atual
    let pages = [0]; // Primeira página (índice 0)
    
    // Adaptar o número de botões com base no tamanho da tela
    const screenWidth = window.innerWidth;
    // Menos botões em telas menores
    const offset = screenWidth < 640 ? 1 : 
                  screenWidth < 768 ? 1 : 2;
    
    let startPage = Math.max(1, current - offset);
    let endPage = Math.min(totalPages - 2, current + offset);
    
    // Ajustar para mostrar sempre 2*offset+1 páginas quando possível
    if (current - offset <= 1) { 
        // Estamos perto do início, mostrar mais páginas no final
        endPage = Math.min(totalPages - 2, 2 * offset + 1);
    }
    if (current + offset >= totalPages - 2) {
        // Estamos perto do fim, mostrar mais páginas no início
        startPage = Math.max(1, totalPages - 2 - 2 * offset);
    }
    
    // Adicionar ellipsis no início se necessário
    if (startPage > 1) {
        pages.push(-1); // -1 representa ellipsis
    }
    
    // Adicionar páginas do intervalo
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    
    // Adicionar ellipsis no final se necessário
    if (endPage < totalPages - 2) {
        pages.push(-2); // -2 representa ellipsis (usamos valor diferente para evitar problemas de key)
    }
    
    // Adicionar a última página
    if (totalPages > 1) {
        pages.push(totalPages - 1);
    }
    
    return pages;
});

// Detectar mudanças no tamanho da janela para ajustar a paginação
onMounted(() => {
    // ... código existente ...
    
    // Adicionar listener para mudanças no tamanho da janela
    window.addEventListener('resize', handleWindowResize);
});

onUnmounted(() => {
    // ... código existente ...
    
    // Remover listener ao desmontar o componente
    window.removeEventListener('resize', handleWindowResize);
});

// Função para lidar com redimensionamento da janela
const handleWindowResize = () => {
    // Forçar recálculo do visiblePageNumbers
    setTimeout(() => {
        currentMoreContentPage.value = currentMoreContentPage.value;
    }, 100);
};
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


