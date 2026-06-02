// Links fornecidos
const LINKS = {
    aluno: "https://pay.voompcreators.com.br/2680/offer/jxwz3Z/?cupom=VITALICIOALUNO",
    nao_aluno: "https://pay.voompcreators.com.br/2680/offer/jxwz3Z",
    suporte: "https://tinyurl.com/suporte-AP"
};

// URL do Web App do Google Apps Script (a ser preenchida pelo usuário)
// IMPORTANTE: Insira a URL entre as aspas abaixo após fazer o deploy do Apps Script
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxFAxV1IzXxWnFZq0aaugSgxZyGM3JUIFAmwN1rlpkdkQh8lcWV7HP1vn8Rg0dkw9up/exec";

// Navegação entre steps
function goToStep(stepNumber) {
    // Esconde todos os steps
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });

    // Mostra o step desejado
    const target = document.getElementById(`step-${stepNumber}`);
    if (target) {
        target.classList.add('active');
    }
}

// Redirecionamento
function redirectTo(destination) {
    const url = LINKS[destination.replace('-', '_')];
    if (url) {
        window.location.href = url;
    }
}

// Verificação de Cache ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    checkCache();
});

function checkCache() {
    const cache = localStorage.getItem('ambiental_pro_validation');
    if (cache) {
        try {
            const data = JSON.parse(cache);
            const now = new Date().getTime();

            // Cache expira em 30 dias (30 * 24 * 60 * 60 * 1000)
            const thirtyDays = 2592000000;

            if (now - data.validatedAt < thirtyDays && data.found) {
                // Se já tem cache válido, vai direto para a tela de sucesso
                document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
                document.getElementById('step-success').classList.add('active');
            }
        } catch (e) {
            console.error('Erro ao ler cache', e);
        }
    }
}

// Lidar com o formulário
async function handleValidation(event) {
    event.preventDefault();

    if (APPS_SCRIPT_URL === "SUA_URL_DO_APPS_SCRIPT_AQUI") {
        alert("Atenção: A URL do Apps Script ainda não foi configurada no arquivo script.js. A validação falhará.");
    }

    const email = document.getElementById('email').value.trim();
    const btn = document.getElementById('btn-validate');

    // UI - Loading state
    btn.classList.add('loading');

    try {
        // Faz a requisição ao Google Apps Script
        const response = await fetch(`${APPS_SCRIPT_URL}?email=${encodeURIComponent(email)}`);

        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        const data = await response.json();

        // Remove loading state
        btn.classList.remove('loading');

        // Esconde todos os steps
        document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));

        if (data.found) {
            // Salva no cache
            localStorage.setItem('ambiental_pro_validation', JSON.stringify({
                email: email,
                found: true,
                validatedAt: new Date().getTime()
            }));

            // Vai para tela de sucesso
            document.getElementById('step-success').classList.add('active');
        } else {
            // Vai para tela de erro
            document.getElementById('step-error').classList.add('active');
        }

    } catch (error) {
        console.error('Erro durante a validação:', error);
        btn.classList.remove('loading');
        alert("Ocorreu um erro ao conectar com o servidor. Por favor, tente novamente ou contate o suporte.");
    }
}
