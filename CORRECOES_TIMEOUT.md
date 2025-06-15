# Correções de Timeout - Sistema de Predições de Futebol

## Problemas Identificados

O sistema estava apresentando erros de timeout e fetch errors, principalmente relacionados ao:

1. **SSR (Server-Side Rendering)** fazendo requisições durante a renderização
2. **Ausência de timeouts** nas requisições HTTP
3. **Componentes carregando dados** durante o SSR

## Correções Aplicadas

### 1. Composable `useFootballPredictions.ts`

**Problema:** Requisições sendo feitas durante o SSR causando timeouts
**Solução:** Adicionado verificação para pular requisições durante SSR

```typescript
// Skip API calls during SSR to prevent timeouts
if (typeof window === 'undefined') {
  console.log('📊 SSR detected - using mock predictions data')
  predictions.value = generateMockPredictions()
  return
}
```

**Adicionado timeouts nas requisições:**
- SmartBets API: 5 segundos
- API interna: 3 segundos

### 2. Componentes Vue

**FootballPredictions.vue e FootballPredictionsSidebar.vue:**

**Problema:** `onMounted` executando requisições imediatamente
**Solução:** Verificação de ambiente cliente + delay

```typescript
onMounted(() => {
  // Only load predictions on client-side to avoid SSR issues
  if (enablePredictions.value && typeof window !== 'undefined') {
    // Add a small delay to ensure the component is fully mounted
    setTimeout(() => {
      loadPredictions()
    }, 100)
  }
})
```

### 3. Serviço Backend `predictions.service.ts`

**Problema:** Requisições sem timeout
**Solução:** AbortController com timeout de 10 segundos

```typescript
// Create AbortController for timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

const response = await fetch(apiUrl, {
  // ... outras opções
  signal: controller.signal
});

clearTimeout(timeoutId);
```

### 4. Entry Server `entry-server.ts`

**Problema:** Requisições iniciais sem timeout
**Solução:** AbortController com timeout de 8 segundos

```typescript
// Create AbortController for timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 8000);

try {
  const settings = await fetch(`${env.VITE_API_URL}/settings`, { signal: controller.signal });
  // ... outras requisições
  clearTimeout(timeoutId);
} catch (error) {
  clearTimeout(timeoutId);
  throw error;
}
```

### 5. Servidor Web `server.ts`

**Problema:** Configurações de timeout padrão muito altas
**Solução:** Timeouts otimizados

```typescript
// Configure server timeouts
server.timeout = 30000; // 30 seconds
server.keepAliveTimeout = 5000; // 5 seconds
server.headersTimeout = 10000; // 10 seconds
```

## Estratégia de Fallback

O sistema agora usa uma estratégia de fallback em cascata:

1. **Primeira tentativa:** SmartBets API (5s timeout)
2. **Segunda tentativa:** API interna com cache (3s timeout)
3. **Fallback final:** Dados mock realistas

## Benefícios das Correções

- ✅ **Eliminação de timeouts** durante SSR
- ✅ **Carregamento mais rápido** da página inicial
- ✅ **Experiência do usuário melhorada** com fallbacks
- ✅ **Logs detalhados** para debugging
- ✅ **Componentes resilientes** a falhas de API

## Monitoramento

Os logs agora incluem:
- `📊 SSR detected - using mock predictions data`
- `🔄 Fetching from SmartBets API`
- `✅ Loaded predictions from API`
- `⚠️ API failed, using fallback`

## Próximos Passos

1. Monitorar logs em produção
2. Ajustar timeouts se necessário
3. Implementar métricas de performance
4. Considerar cache Redis para alta disponibilidade 