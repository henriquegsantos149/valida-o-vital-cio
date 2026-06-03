// Links fornecidos
const LINKS = {
    nao_aluno: "https://pay.voompcreators.com.br/2680/offer/jxwz3Z",
    suporte: "https://tinyurl.com/suporte-AP"
};

let alunoCheckoutLink = ""; // Link seguro que virá do backend

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
    if (destination === 'aluno' && alunoCheckoutLink) {
        window.location.href = alunoCheckoutLink;
        return;
    }

    const url = LINKS[destination.replace('-', '_')];
    if (url) {
        window.location.href = url;
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
            // Salva o link de checkout retornado pelo backend
            if (data.checkoutUrl) {
                alunoCheckoutLink = data.checkoutUrl;
            }
            
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
