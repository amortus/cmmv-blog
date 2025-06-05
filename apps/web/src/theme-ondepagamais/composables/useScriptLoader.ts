import { ref } from 'vue';

interface ScriptOptions {
  async?: boolean;
  defer?: boolean;
  onload?: () => void;
  onerror?: (error: Error) => void;
  id?: string;
  attrs?: Record<string, string>;
}

/**
 * Utilidade para carregamento otimizado de scripts externos
 * Suporta carregamento lazy (tardio) para melhorar desempenho
 */
export function useScriptLoader() {
  const loadedScripts = ref<Set<string>>(new Set());
  
  /**
   * Verifica se um script já foi carregado
   * @param src URL do script
   */
  const isScriptLoaded = (src: string): boolean => {
    return loadedScripts.value.has(src) || 
      !!document.querySelector(`script[src="${src}"]`);
  };
  
  /**
   * Carrega um script externo, evitando duplicatas
   * @param src URL do script
   * @param options Opções de carregamento do script
   */
  const loadScript = (src: string, options: ScriptOptions = {}): Promise<void> => {
    // Se o script já estiver carregado, retorne uma promessa resolvida
    if (isScriptLoaded(src)) {
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      
      // Configurar atributos async/defer para melhor desempenho
      if (options.async) script.async = true;
      if (options.defer) script.defer = true;
      if (options.id) script.id = options.id;
      
      // Adicionar atributos adicionais
      if (options.attrs) {
        Object.entries(options.attrs).forEach(([key, value]) => {
          script.setAttribute(key, value);
        });
      }
      
      // Tratar eventos de carregamento
      script.onload = () => {
        loadedScripts.value.add(src);
        if (options.onload) options.onload();
        resolve();
      };
      
      script.onerror = (error) => {
        if (options.onerror) options.onerror(error as Error);
        reject(new Error(`Falha ao carregar o script: ${src}`));
      };
      
      document.head.appendChild(script);
    });
  };
  
  /**
   * Carrega um script apenas quando o elemento entra no viewport
   * @param src URL do script
   * @param options Opções de carregamento do script
   */
  const lazyLoadScript = (src: string, options: ScriptOptions = {}): IntersectionObserver => {
    const observer = new IntersectionObserver((entries) => {
      // Se o elemento entrar no viewport
      if (entries[0].isIntersecting) {
        loadScript(src, options)
          .catch(error => console.error('Erro no lazy load do script:', error));
        
        // Parar de observar depois de carregar
        observer.disconnect();
      }
    });
    
    return observer;
  };
  
  /**
   * Carrega um script com base em um evento de usuário
   * @param src URL do script
   * @param options Opções de carregamento do script
   */
  const loadScriptOnInteraction = (src: string, options: ScriptOptions = {}): void => {
    const events = ['mouseover', 'touchstart', 'scroll'];
    
    const loadHandler = () => {
      loadScript(src, options)
        .catch(error => console.error('Erro ao carregar script por interação:', error));
      
      // Remover todos os event listeners após o primeiro evento
      events.forEach(event => {
        document.removeEventListener(event, loadHandler);
      });
    };
    
    // Adicionar event listeners para cada evento
    events.forEach(event => {
      document.addEventListener(event, loadHandler, { once: true, passive: true });
    });
  };
  
  return {
    loadScript,
    lazyLoadScript,
    loadScriptOnInteraction,
    isScriptLoaded,
    loadedScripts
  };
} 