<template>
    <div class="w-full relative bg-[#d1d5db]">
        <div class="lg:max-w-4xl md:max-w-3xl px-4 sm:px-6 mx-auto py-8">
            <div class="bg-white rounded-lg px-4 sm:px-6 py-8">
                <h1 class="text-3xl font-bold mb-6 text-neutral-900">Termos de Serviço</h1>
                <a id="terms-of-service" title="Termos de serviço"></a>
                <p class="mb-4 text-neutral-700 text-justify">Os termos que você concorda ao utilizar o site e os serviços do <strong>Onde Paga Mais</strong> (CMMV).</p>
                <p class="mb-6 text-neutral-700 text-justify"><strong>Última atualização em 25 de março de 2025</strong></p>

                <h2 class="text-2xl font-semibold mt-8 mb-4 text-neutral-800">Geral</h2>
                <a id="general" title="Geral"></a>

                <h3 class="text-xl font-medium mt-6 mb-3 text-neutral-800">Aceitação dos Termos</h3>
                <p class="mb-4 text-neutral-700 text-justify">Ao acessar e utilizar o site <strong>Onde Paga Mais</strong> (CMMV) ("Serviços"), você concorda em cumprir estes Termos de Serviço e a nossa Política de Privacidade. Caso não concorde, solicitamos que não utilize nossos serviços.</p>

                <h3 class="text-xl font-medium mt-6 mb-3 text-neutral-800">Descrição dos Serviços</h3>
                <p class="mb-4 text-neutral-700 text-justify"><strong>Onde Paga Mais</strong> (CMMV) é um portal de notícias gratuito, destinado a fornecer informações, conteúdos, artigos e atualizações sobre plataformas de apostas, casas de bet e conteúdo relacionado. O acesso ao conteúdo é livre, não sendo exigido cadastro prévio dos usuários.</p>

                <h2 class="text-2xl font-semibold mt-8 mb-4 text-neutral-800">Uso dos Serviços</h2>
                <a id="use-of-services" title="Uso dos Serviços"></a>
                <p class="mb-4 text-neutral-700 text-justify">O usuário compromete-se a utilizar os serviços do <strong>Onde Paga Mais</strong> de maneira ética, responsável e em conformidade com a legislação vigente. É vedado:</p>
                <ul class="mb-4 pl-5 list-disc text-neutral-700 text-justify">
                    <li class="mb-2">Publicar, enviar ou transmitir qualquer conteúdo ilegal, difamatório, ofensivo, ameaçador ou que viole direitos de terceiros;</li>
                    <li class="mb-2">Utilizar o site para práticas que possam comprometer sua segurança ou funcionamento, incluindo a disseminação de vírus ou softwares maliciosos;</li>
                    <li class="mb-2">Realizar qualquer tentativa de acesso não autorizado a sistemas, servidores ou bases de dados relacionados ao site.</li>
                </ul>

                <h2 class="text-2xl font-semibold mt-8 mb-4 text-neutral-800">Propriedade Intelectual</h2>
                <a id="content-and-ownership" title="Conteúdo e Propriedade"></a>

                <p class="mb-4 text-neutral-700 text-justify">Todo o conteúdo disponibilizado no <strong>Onde Paga Mais</strong>, incluindo textos, imagens, vídeos, logotipos e gráficos, é protegido por direitos autorais e demais direitos de propriedade intelectual, sendo de titularidade do site ou de terceiros que licenciaram seu uso.</p>
                <p class="mb-4 text-neutral-700 text-justify">É proibida a reprodução, distribuição ou qualquer uso do conteúdo para fins comerciais sem autorização prévia e expressa.</p>

                <h2 class="text-2xl font-semibold mt-8 mb-4 text-neutral-800">Limitações de Responsabilidade</h2>
                <a id="limitations-of-liability" title="Limitações de Responsabilidade"></a>
                <p class="mb-4 text-neutral-700 text-justify">Embora o <strong>Onde Paga Mais</strong> se esforce para fornecer informações precisas e atualizadas, não garante que os conteúdos estejam livres de erros ou omissões. O uso das informações publicadas é de responsabilidade exclusiva do usuário.</p>
                <p class="mb-4 text-neutral-700 text-justify">O site não se responsabiliza por eventuais danos, diretos ou indiretos, decorrentes da utilização ou da incapacidade de utilização dos seus serviços.</p>

                <h2 class="text-2xl font-semibold mt-8 mb-4 text-neutral-800">Privacidade</h2>
                <a id="privacy" title="Privacidade"></a>
                <p class="mb-4 text-neutral-700 text-justify">O <strong>Onde Paga Mais</strong> respeita a privacidade dos seus usuários. As informações coletadas, se houver, são tratadas conforme a nossa Política de Privacidade, disponível no próprio site.</p>

                <h2 class="text-2xl font-semibold mt-8 mb-4 text-neutral-800">Alterações nos Termos</h2>
                <a id="changes" title="Alterações nos Termos"></a>
                <p class="mb-4 text-neutral-700 text-justify">Estes Termos de Serviço podem ser atualizados periodicamente, a critério do <strong>Onde Paga Mais</strong>. Recomendamos que os usuários consultem este documento regularmente.</p>

                <h2 class="text-2xl font-semibold mt-8 mb-4 text-neutral-800">Disposições Gerais</h2>
                <a id="general-provisions" title="Disposições Gerais"></a>

                <h3 class="text-xl font-medium mt-6 mb-3 text-neutral-800">Legislação Aplicável</h3>
                <p class="mb-4 text-neutral-700 text-justify">Este Termo será regido pelas leis da República Federativa do Brasil. Quaisquer conflitos serão dirimidos no foro da comarca de Vila Velha - ES, Brasil.</p>

                <h3 class="text-xl font-medium mt-6 mb-3 text-neutral-800">Contato</h3>
                <p class="mb-4 text-neutral-700 text-justify">Para esclarecimentos, dúvidas ou solicitações, entre em contato através do e-mail: <code class="px-1.5 py-0.5 bg-gray-100 rounded">contato@ondepagamais.com.br</code>.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';

useHead({
    title: 'Termos de Serviço - Onde Paga Mais',
    meta: [
        {
            name: 'description',
            content: 'Termos de Serviço do site Onde Paga Mais (CMMV)'
        },
        {
            name: 'keywords',
            content: 'Onde Paga Mais, CMMV, Termos de Serviço, casas de apostas'
        }
    ]
})
</script>
