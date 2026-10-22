// Preencha com a URL /exec da implantação de integrations/black-friday.gs.
// Não reutilize o endpoint da oferta anterior.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyweY8XdalNi4KDIE1o-6G3cFh-u8ovpYcub93ylRA7Rne3c1Nn--yCcH2P4VUdWXJ3/exec';
const COMMERCIAL_PHONE = '5521982639824';
const SUPPORT_URL = 'https://tinyurl.com/suporte-AP';
let studentType = 'pos';

function selectStudentType(type) {
    studentType = type;
    document.getElementById('validation-title').textContent = type === 'pos' ? 'Valide seu cadastro de pós' : 'Valide seu cadastro de extensão';
    document.getElementById('validation-message').textContent = '';
    document.getElementById('cashback-whatsapp').removeAttribute('href');
    goToStep(2);
}

function goToStep(stepNumber) {
    document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step-${stepNumber}`)?.classList.add('active');
}

function redirectTo(destination) {
    if (destination === 'suporte') window.location.href = SUPPORT_URL;

}

async function handleValidation(event) {
    event.preventDefault();
    const btn = document.getElementById('btn-validate');
    if (btn.disabled) return;
    const message = document.getElementById('validation-message');
    message.textContent = '';

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
        if (Date.now() - startedAt > 20000) {
            status.textContent = 'Ainda estamos consultando seu cadastro. A resposta pode levar até um minuto.';
        } else if (Date.now() - startedAt > 10000) {
            status.textContent = 'A consulta está demorando um pouco. Aguarde mais alguns instantes.';
        }
    }, 250);
    try {
        const url = new URL(APPS_SCRIPT_URL);
        url.searchParams.set('email', email);
        url.searchParams.set('tipo', studentType);
        const response = await fetch(url, { signal: AbortSignal.timeout(60000), cache: 'no-store' });
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
        if (data.tipo !== studentType) throw new Error('outdated_script');
        if (data.tipo === 'extensao') {
            const text = `Olá! Sou aluno de um curso de extensão da Ambiental Pro. Meu e-mail de cadastro é ${email}. Quero resgatar meu cashback e fazer minha matrícula em uma pós-graduação.`;
            const whatsapp = new URL(`https://wa.me/${COMMERCIAL_PHONE}`);
            whatsapp.searchParams.set('text', text);
            document.getElementById('cashback-whatsapp').href = whatsapp.href;
            goToStep('cashback');
            return;
        }
        window.location.assign(new URL('/black/matricula/pos/', window.location.origin).href);
    } catch (error) {
        message.textContent = error.name === 'TimeoutError'
            ? 'A consulta demorou mais que o esperado. Tente novamente em instantes.'
            : error instanceof TypeError
            ? 'Não conseguimos conectar ao serviço de validação. Verifique sua conexão e tente novamente.'
            : error.message === 'outdated_script'
            ? 'A validação está sendo atualizada. Tente novamente em instantes ou fale com o suporte.'
            : error.message === 'configuration'
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

window.selectStudentType = selectStudentType;
