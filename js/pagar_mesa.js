// ======================
// VARIABLES GLOBALES
// ======================
let selectedPayment = 'efectivo';
let payments = [];


// ======================
// FORMATO CLP
// ======================
function formatCLP(value) {
    return Number(value).toLocaleString('es-CL');
}


// ======================
// INICIALIZACIÓN
// ======================
document.addEventListener("DOMContentLoaded", () => {
    const subtotal = parseInt(document.getElementById('subtotal').textContent) || 0;
    const suggestedTip = Math.round(subtotal * 0.10);

    document.getElementById('tipAmount').value = suggestedTip;

    // Detectar cambios en propina
    document.getElementById('tipAmount').addEventListener('input', updateTotals);

    updateTotals();
});


// ======================
// MÉTODO DE PAGO
// ======================
function selectPayment(element, method) {
    document.querySelectorAll('.payment-method')
        .forEach(el => el.classList.remove('active'));

    element.classList.add('active');
    selectedPayment = method;
}


// ======================
// PAGOS
// ======================
function addPayment() {
    const amount = parseInt(document.getElementById('paymentAmount').value);

    if (!amount || amount <= 0) {
        alert('Ingrese un monto válido');
        return;
    }

    payments.push({
        amount: amount,
        method: selectedPayment,
        date: new Date().toLocaleTimeString()
    });

    updatePaymentList();
    checkBalance();

    document.getElementById('paymentAmount').value = '';
}

function updatePaymentList() {
    const listContainer = document.getElementById('paymentList');

    if (payments.length === 0) {
        listContainer.innerHTML = '<p class="text-muted text-center my-2 small">No hay pagos registrados</p>';
        document.getElementById('totalPaid').textContent = '0';
        return;
    }

    let html = '';
    let totalPaid = 0;

    payments.forEach((payment, index) => {
        totalPaid += payment.amount;

        let methodIcon = 'fa-money-bill';
        if (payment.method === 'debito' || payment.method === 'credito') {
            methodIcon = 'fa-credit-card';
        } else if (payment.method === 'transferencia') {
            methodIcon = 'fa-exchange-alt';
        }

        html += `
            <div class="payment-item">
                <div>
                    <i class="fas ${methodIcon} text-primary"></i> 
                    <strong>$${formatCLP(payment.amount)}</strong> 
                    <span class="text-muted small">(${payment.method})</span>
                </div>
                <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removePayment(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });

    listContainer.innerHTML = html;
    document.getElementById('totalPaid').textContent = formatCLP(totalPaid);
}

function removePayment(index) {
    payments.splice(index, 1);
    updatePaymentList();
    checkBalance();
}


// ======================
// CÁLCULOS
// ======================
function updateTotals() {
    const subtotal = parseInt(document.getElementById('subtotal').textContent.replace(/\./g, '')) || 0;
    const tax = Math.round(subtotal * 0.19);

    // 🔥 IMPORTANTE: la propina NO se suma al total
    const total = subtotal + tax;

    document.getElementById('tax').textContent = formatCLP(tax);
    document.getElementById('totalAmount').textContent = formatCLP(total);

    // Propina sugerida (solo visual)
    const suggestedTip = Math.round(subtotal * 0.10);
    document.getElementById('tipAmount').placeholder = formatCLP(suggestedTip);

    const tip = parseInt(document.getElementById('tipAmount').value) || 0;
    document.getElementById('tipDisplay').textContent = formatCLP(tip);

    checkBalance();
}

function setTip(percentage) {
    const subtotal = parseInt(document.getElementById('subtotal').textContent.replace(/\./g, '')) || 0;
    const tip = Math.round(subtotal * (percentage / 100));

    document.getElementById('tipAmount').value = tip;
    updateTotals();
}


// ======================
// BALANCE
// ======================
function checkBalance() {
    const total = parseInt(document.getElementById('totalAmount').textContent.replace(/\./g, '')) || 0;
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = total - totalPaid;

    document.getElementById('balance').textContent = formatCLP(Math.max(0, balance));

    const balanceBox = document.getElementById('balanceBox');
    balanceBox.classList.remove('success', 'error');

    if (balance <= 0) {
        balanceBox.classList.add('success');
        document.getElementById('liberarBtn').disabled = false;
    } else {
        balanceBox.classList.add('error');
        document.getElementById('liberarBtn').disabled = true;
    }
}


// ======================
// FINALIZAR
// ======================
function liberarMesa() {
    const tip = parseInt(document.getElementById('tipAmount').value) || 0;
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    alert(`✓ Mesa liberada exitosamente!

Resumen:
Total pagado: $${formatCLP(totalPaid)}
Propina: $${formatCLP(tip)}
`);

    limpiar();
}


// ======================
// LIMPIAR
// ======================
function limpiar() {
    payments = [];

    document.getElementById('paymentAmount').value = '';
    document.getElementById('tipAmount').value = '0';

    updatePaymentList();
    updateTotals();
}