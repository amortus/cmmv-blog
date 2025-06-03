import { computed } from 'vue';
import { useScriptLoader } from '../theme-aquiesportes/composables/useScriptLoader';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

const isTruthy = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        return value === '1' || value.toLowerCase() === 'true';
    }
    return false;
};

export const useAds = (settings: any, page = 'generic') => {
    // Utilitário para carregamento otimizado de scripts
    const { loadScript, loadScriptOnInteraction, isScriptLoaded } = useScriptLoader();

    const adSettings = computed(() => {
        const rawSettings = settings || {};
        const processedSettings: Record<string, any> = {};

        Object.keys(rawSettings).forEach(key => {
            if (key.startsWith('blog.')) {
                const shortKey = key.replace('blog.', '');
                processedSettings[shortKey] = rawSettings[key];
            } else {
                processedSettings[key] = rawSettings[key];
            }
        });

        const result: Record<string, any> = {
            enableAds: isTruthy(processedSettings['enableAds']),
            showAdsLoggedIn: isTruthy(processedSettings['showAdsLoggedIn']),

            [`${page}PageHeader`]: processedSettings[`${page}PageHeader`] === undefined ? true : isTruthy(processedSettings[`${page}PageHeader`]),
            [`${page}PageSidebarTop`]: processedSettings[`${page}PageSidebarTop`] === undefined ? true : isTruthy(processedSettings[`${page}PageSidebarTop`]),
            [`${page}PageSidebarMid`]: processedSettings[`${page}PageSidebarMid`] === undefined ? true : isTruthy(processedSettings[`${page}PageSidebarMid`]),
            [`${page}PageSidebarBottom`]: processedSettings[`${page}PageSidebarBottom`] === undefined ? true : isTruthy(processedSettings[`${page}PageSidebarBottom`]),
            [`${page}PageInContent`]: processedSettings[`${page}PageInContent`] === undefined ? true : isTruthy(processedSettings[`${page}PageInContent`]),
            [`${page}PageAfterContent`]: processedSettings[`${page}PageAfterContent`] === undefined ? true : isTruthy(processedSettings[`${page}PageAfterContent`]),
            [`${page}PageAfterTitle`]: processedSettings[`${page}PageAfterTitle`] === undefined ? false : isTruthy(processedSettings[`${page}PageAfterTitle`]),
            [`${page}PageAfterCover`]: processedSettings[`${page}PageAfterCover`] === undefined ? false : isTruthy(processedSettings[`${page}PageAfterCover`]),

            enableAdSense: isTruthy(processedSettings['enableAdSense']),
            adSensePublisherId: processedSettings['adSensePublisherId'] || '',
            adSenseAutoAdsCode: processedSettings['adSenseAutoAdsCode'] || '',
            enableAdSenseAutoAds: isTruthy(processedSettings['enableAdSenseAutoAds']),
            adSenseHeaderBanner: processedSettings['adSenseHeaderBanner'] || '',
            adSenseSidebarTop: processedSettings['adSenseSidebarTop'] || '',
            adSenseSidebarMid: processedSettings['adSenseSidebarMid'] || '',
            adSenseSidebarBottom: processedSettings['adSenseSidebarBottom'] || '',
            adSenseSidebarLeft: processedSettings['adSenseSidebarLeft'] || '',
            adSenseAfterCover: processedSettings['adSenseAfterCover'] || '',
            adSenseAfterTitle: processedSettings['adSenseAfterTitle'] || '',
            adSenseInArticle: processedSettings['adSenseInArticle'] || '',
            adSenseBelowContent: processedSettings['adSenseBelowContent'] || '',

            enableCustomAds: isTruthy(processedSettings['enableCustomAds']),
            customHeaderBanner: processedSettings['customHeaderBanner'] || '',
            customSidebarTop: processedSettings['customSidebarTop'] || '',
            customSidebarBottom: processedSettings['customSidebarBottom'] || '',
            customInArticle: processedSettings['customInArticle'] || '',
            customBelowContent: processedSettings['customBelowContent'] || '',
            customAfterTitle: processedSettings['customAfterTitle'] || '',
            customAfterCover: processedSettings['customAfterCover'] || '',

            enableAmazonAds: isTruthy(processedSettings['enableAmazonAds']),
            amazonAssociateId: processedSettings['amazonAssociateId'] || '',
            amazonSidebarAd: processedSettings['amazonSidebarAd'] || '',
            amazonInContentAd: processedSettings['amazonInContentAd'] || '',
            amazonBelowContentAd: processedSettings['amazonBelowContentAd'] || '',

            enableTaboolaAds: isTruthy(processedSettings['enableTaboolaAds']),
            taboolaPublisherId: processedSettings['taboolaPublisherId'] || '',
            taboolaBelowArticle: processedSettings['taboolaBelowArticle'] || '',
            taboolaRightRail: processedSettings['taboolaRightRail'] || '',
            taboolaFooter: processedSettings['taboolaFooter'] || '',
            taboolaJsCode: processedSettings['taboolaJsCode'] || '',
        };

        return result;
    });

    const getAdHtml = (position: string): string => {
        if (!adSettings.value.enableAds) return '';

        const positionSetting = `${page}Page${position.charAt(0).toUpperCase() + position.slice(1)}`;

        if (positionSetting in adSettings.value && !adSettings.value[positionSetting])
            return '';

        if (adSettings.value.enableAdSense) {
            let adSenseSetting = '';
            switch (position) {
                case 'header':
                    adSenseSetting = 'adSenseHeaderBanner';
                    break;
                case 'sidebarTop':
                    adSenseSetting = 'adSenseSidebarTop';
                    break;
                case 'sidebarMid':
                    adSenseSetting = 'adSenseSidebarMid';
                    break;
                case 'sidebarBottom':
                    adSenseSetting = 'adSenseSidebarBottom';
                    break;
                case 'sidebarLeft':
                    adSenseSetting = 'adSenseSidebarLeft';
                    break;
                case 'inContent':
                    adSenseSetting = 'adSenseInArticle';
                    break;
                case 'belowContent':
                    adSenseSetting = 'adSenseBelowContent';
                    break;
                case 'afterTitle':
                    adSenseSetting = 'adSenseAfterTitle';
                    break;
                case 'afterCover':
                    adSenseSetting = 'adSenseAfterCover';
                    break;
                default:
                    return '';
            }

            if (adSenseSetting in adSettings.value && adSettings.value[adSenseSetting]) {
                return adSettings.value[adSenseSetting];
            }
        }

        if (adSettings.value.enableCustomAds) {
            let customSetting = '';
            switch (position) {
                case 'header':
                    customSetting = 'customHeaderBanner';
                    break;
                case 'sidebarTop':
                    customSetting = 'customSidebarTop';
                    break;
                case 'sidebarBottom':
                    customSetting = 'customSidebarBottom';
                    break;
                case 'inContent':
                    customSetting = 'customInArticle';
                    break;
                case 'belowContent':
                    customSetting = 'customBelowContent';
                    break;
                case 'afterTitle':
                    customSetting = 'customAfterTitle';
                    break;
                case 'afterCover':
                    customSetting = 'customAfterCover';
                    break;
                default:
                    return '';
            }

            if (customSetting in adSettings.value && adSettings.value[customSetting]) {
                return adSettings.value[customSetting];
            }
        }

        if (adSettings.value.enableAmazonAds) {
            switch (position) {
                case 'sidebarTop':
                    if (adSettings.value.amazonSidebarAd) return adSettings.value.amazonSidebarAd;
                    break;
                case 'inContent':
                    if (adSettings.value.amazonInContentAd) return adSettings.value.amazonInContentAd;
                    break;
                case 'belowContent':
                    if (adSettings.value.amazonBelowContentAd) return adSettings.value.amazonBelowContentAd;
                    break;
            }
        }

        if (adSettings.value.enableTaboolaAds) {
            switch (position) {
                case 'belowContent':
                    if (adSettings.value.taboolaBelowArticle) return adSettings.value.taboolaBelowArticle;
                    break;
                case 'sidebarTop':
                    if (adSettings.value.taboolaRightRail) return adSettings.value.taboolaRightRail;
                    break;
                case 'footer':
                    if (adSettings.value.taboolaFooter) return adSettings.value.taboolaFooter;
                    break;
            }
        }

        return '';
    };

    // Função otimizada para carregamento de scripts de anúncios
    const loadAdScripts = () => {
        if (!adSettings.value.enableAds) return;

        // Carregar scripts AdSense usando nossa utilidade otimizada
        if (adSettings.value.enableAdSense && adSettings.value.enableAdSenseAutoAds && adSettings.value.adSenseAutoAdsCode) {
            try {
                const srcRegex = /src="([^"]+)"/;
                const match = adSettings.value.adSenseAutoAdsCode.match(srcRegex);

                if (match && match[1]) {
                    const scriptSrc = match[1];
                    
                    // Usar carregamento tardio - apenas quando o usuário interage com a página
                    loadScriptOnInteraction(scriptSrc, {
                        id: 'adsense-script',
                        async: true,
                        attrs: {
                            'crossorigin': 'anonymous',
                            'data-ad-client': adSettings.value.adSensePublisherId || ''
                        }
                    });
                }
            } catch (e) {
                console.error('Erro ao carregar script do AdSense:', e);
            }
        }

        // Inicializar anúncios do AdSense quando disponíveis
        if (adSettings.value.enableAdSense) {
            const initAdSense = () => {
                try {
                    if (window.adsbygoogle) {
                        document.querySelectorAll('.adsbygoogle').forEach((ad) => {
                            if (!ad.hasAttribute('data-adsbygoogle-status')) {
                                (window.adsbygoogle = window.adsbygoogle || []).push({});
                            }
                        });
                    }
                } catch (e) {
                    console.error('Erro ao inicializar anúncios AdSense:', e);
                }
            };
            
            // Inicializar após um pequeno atraso para garantir que elementos DOM estão prontos
            setTimeout(initAdSense, 300);
            
            // Também inicializar quando a página estiver totalmente carregada
            if (document.readyState === 'complete') {
                initAdSense();
            } else {
                window.addEventListener('load', initAdSense, { once: true });
            }
        }
        
        // Carregamento otimizado para scripts Taboola
        if (adSettings.value.enableTaboolaAds && adSettings.value.taboolaJsCode) {
            try {
                const srcRegex = /src="([^"]+)"/;
                const match = adSettings.value.taboolaJsCode.match(srcRegex);

                if (match && match[1]) {
                    const scriptSrc = match[1];
                    
                    // Carregar Taboola apenas quando o usuário rolar para a parte inferior da página
                    const observer = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting && !isScriptLoaded(scriptSrc)) {
                            loadScript(scriptSrc, { 
                                async: true,
                                id: 'taboola-script'
                            });
                            observer.disconnect();
                        }
                    });
                    
                    // Observar um elemento próximo do final da página
                    const footer = document.querySelector('footer') || document.querySelector('.footer');
                    if (footer) {
                        observer.observe(footer);
                    } else {
                        // Se não encontrar footer, usar carregamento baseado em interação
                        loadScriptOnInteraction(scriptSrc, { 
                            async: true,
                            id: 'taboola-script'
                        });
                    }
                }
            } catch (e) {
                console.error('Erro ao carregar script do Taboola:', e);
            }
        }
    };

    // Função otimizada para carregar anúncios na barra lateral esquerda
    const loadSidebarLeftAd = (containerRef: HTMLElement | null) => {
        if (!adSettings.value.enableAds || !containerRef) return;

        if (adSettings.value.adSenseSidebarLeft && containerRef) {
            try {
                // Usar IntersectionObserver para carregar apenas quando visível
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = adSettings.value.adSenseSidebarLeft;

                        const insElement = tempDiv.querySelector('ins');

                        if (insElement) {
                            containerRef.appendChild(insElement);

                            if (window.adsbygoogle) {
                                try {
                                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                                } catch (e) {
                                    console.error('Erro ao inicializar AdSense na barra lateral:', e);
                                }
                            }
                        }
                        
                        observer.disconnect();
                    }
                }, { threshold: 0.1 });
                
                observer.observe(containerRef);
                
            } catch (e) {
                console.error('Erro ao configurar anúncio na barra lateral:', e);
            }
        }
    };

    return {
        adSettings,
        getAdHtml,
        loadAdScripts,
        loadSidebarLeftAd
    };
};
