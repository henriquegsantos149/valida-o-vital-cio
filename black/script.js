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
    btn.setAttribute('aria-busy', 'true');
    const back = document.getElementById('validation-back');
    back.disabled = true;
    const progress = document.getElementById('validation-progress');
    const status = document.getElementById('validation-progress-status');
    progress.hidden = false;
    status.textContent = 'Consultando seu cadastro. Progresso estimado.';
    let percentage = 0;
    const renderProgress = value => {
        document.getElementById('validation-percent').textContent = `${value}%`;
        document.getElementById('validation-progress-fill').style.width = `${value}%`;
        document.getElementById('validation-progressbar').setAttribute('aria-valuenow', String(value));
    };
    renderProgress(0);
    const startedAt = Date.now();
    const progressTimer = setInterval(() => {
        percentage = Math.min(95, Math.floor(95 * (1 - Math.exp(-(Date.now() - startedAt) / 4500))));
        renderProgress(percentage);
        if (Date.now() - startedAt > 10000) status.textContent = 'A consulta está demorando um pouco. Aguarde mais alguns instantes.';
    }, 250);
    try {
        const url = new URL(APPS_SCRIPT_URL);
        url.searchParams.set('email', email);
        const response = await fetch(url, { signal: AbortSignal.timeout(20000), cache: 'no-store' });
        if (!response.ok) throw new Error('service');
        const data = await response.json();
        if (data.error === 'configuration') throw new Error('configuration');
        if (data.error || typeof data.found !== 'boolean') throw new Error('service');
        clearInterval(progressTimer);
        renderProgress(100);
        status.textContent = 'Consulta concluída.';
        await new Promise(resolve => setTimeout(resolve, 250));
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
        clearInterval(progressTimer);
        progress.hidden = true;
        back.disabled = false;
        btn.removeAttribute('aria-busy');
        btn.disabled = false;
        btn.classList.remove('loading');
    }
}

window.goToStep = goToStep;
window.redirectTo = redirectTo;
window.handleValidation = handleValidation;
