// Preencha com a URL /exec da implantação de integrations/black-friday.gs.
// Não reutilize o endpoint da oferta anterior.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFw1Qolr9t-MKoEa4kwcGpTKmzvTktBHqj0Ifgi7dkVKQLZk4Iu4UZpmQPbO0zVYA/exec';
const GROUP_URL = 'https://sndflw.com/i/QqsIe4Lyew4On6qkVv5o';
const SUPPORT_URL = 'https://tinyurl.com/suporte-AP';
let groupUrl = '';

function goToStep(stepNumber) {
    document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step-${stepNumber}`)?.classList.add('active');
}

function redirectTo(destination) {
    if (destination === 'suporte') window.location.href = SUPPORT_URL;
    if (destination === 'aluno' && groupUrl) window.location.href = groupUrl;
}

async function handleValidation(event) {
    event.preventDefault();
    const btn = document.getElementById('btn-validate');
    if (btn.disabled) return;
    const message = document.getElementById('validation-message');
    message.textContent = '';
    groupUrl = '';
    if (!APPS_SCRIPT_URL) {
        message.textContent = 'A consulta de alunos estará disponível em breve. Se precisar, fale com o suporte.';
        return;
    }
    const email = document.getElementById('email').value.trim().toLowerCase();
    btn.disabled = true;
    btn.classList.add('loading');
    try {
        const url = new URL(APPS_SCRIPT_URL);
        url.searchParams.set('email', email);
        const response = await fetch(url, { signal: AbortSignal.timeout(20000), cache: 'no-store' });
        if (!response.ok) throw new Error('service');
        const data = await response.json();
        if (data.error === 'configuration') throw new Error('configuration');
        if (data.error || typeof data.found !== 'boolean') throw new Error('service');
        if (!data.found) {
            goToStep('error');
            return;
        }
        if (GROUP_URL || data.groupUrl) {
            const target = new URL(GROUP_URL || data.groupUrl);
            if (target.protocol !== 'https:') throw new Error('invalid_destination');
            groupUrl = target.href;
        }
        window.location.assign(new URL('/black/pos/', window.location.origin).href);
    } catch (error) {
        message.textContent = error.message === 'configuration'
            ? 'A consulta de alunos precisa ser configurada. Fale com o suporte.'
            : 'Não foi possível consultar seu cadastro agora. Tente novamente ou fale com o suporte.';
    } finally {
        btn.disabled = false;
        btn.classList.remove('loading');
    }
}

window.goToStep = goToStep;
window.redirectTo = redirectTo;
window.handleValidation = handleValidation;
