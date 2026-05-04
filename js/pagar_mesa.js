// ======================
// VARIABLES GLOBALES
// ======================
let selectedPayment = 'efectivo';
let payments = [];
let assignedTip = 0; // Propina oficialmente asignada al garzón

// ======================
// UTILIDADES
// ======================
function formatCLP(value) {
    return Number(value).toLocaleString('es-CL');
}

// ======================
// INICIALIZACIÓN Y EVENTOS DOM
// ======================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializar menú hamburguesa
    const hamburger = document.getElementById('hamburger');
    const sideMenu = document.getElementById('sideMenu');
    
    if (hamburger && sideMenu) {
        hamburger.addEventListener('click', () => {
            sideMenu.classList.toggle('active');
            // ¡ESTA ES LA LÍNEA MÁGICA QUE ACTIVA LA "X"!
            hamburger.classList.toggle('open'); 
        });
    }

    // 2. Inicializar submenú de reportes (Acordeón)
    const btnReportes = document.getElementById('btn-reportes');
    const submenuReportes = document.getElementById('submenu-reportes');
    
    if (btnReportes && submenuReportes) {
        btnReportes.addEventListener('click', () => {
            submenuReportes.classList.toggle('show');
            // Rotar la flecha
            const arrow = btnReportes.querySelector('.arrow');
            if (arrow) {
                arrow.style.transform = submenuReportes.classList.contains('show') ? 'rotate(90deg)' : 'rotate(0deg)';
                arrow.style.transition = 'transform 0.3s ease';
            }
        });
    }

    // 3. Inicializar los totales de la mesa
    updateTotals();
});

// ======================
// MÉTODOS DE PAGO
// ======================
function selectPayment(element, method) {
    // Quitar la clase 'active' de todos los botones
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('active'));
    // Agregarla solo al que se hizo clic
    element.classList.add('active');
    selectedPayment = method;
}

function addPayment() {
    const amountInput = document.getElementById('paymentAmount');
    const amount = parseInt(amountInput.value);

    if (!amount || amount <= 0) {
        alert('Por favor, ingrese un monto válido a pagar.');
        return;
    }

    payments.push({
        amount: amount,
        method: selectedPayment,
        date: new Date().toLocaleTimeString()
    });

    updatePaymentList();
    checkBalance();
    
    // Limpiar input
    amountInput.value = '';
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
            <div class="payment-item shadow-sm">
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
// PROPINA Y TOTALES
// ======================
function setTip(percentage) {
    const subtotal = parseInt(document.getElementById('subtotal').textContent.replace(/\./g, '')) || 0;
    const tip = Math.round(subtotal * (percentage / 100));
    document.getElementById('tipAmount').value = tip;
}

function addTip() {
    const inputTip = parseInt(document.getElementById('tipAmount').value) || 0;
    const waiterName = document.getElementById('waiterName').textContent;
    
    assignedTip = inputTip;
    
    const feedback = document.getElementById('tipFeedback');
    if (assignedTip > 0) {
        document.getElementById('tipConfirmAmount').textContent = formatCLP(assignedTip);
        document.getElementById('tipConfirmWaiter').textContent = waiterName;
        feedback.classList.remove('d-none');
    } else {
        feedback.classList.add('d-none');
    }

    updateTotals();
}

function updateTotals() {
    const subtotal = parseInt(document.getElementById('subtotal').textContent.replace(/\./g, '')) || 0;
    const total = subtotal + assignedTip;

    document.getElementById('tipDisplay').textContent = formatCLP(assignedTip);
    document.getElementById('totalAmount').textContent = formatCLP(total);

    checkBalance();
}

// ======================
// BALANCE Y VUELTO
// ======================
function checkBalance() {
    const total = parseInt(document.getElementById('totalAmount').textContent.replace(/\./g, '')) || 0;
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = total - totalPaid;

    const balanceBox = document.getElementById('balanceBox');
    const balanceLabel = document.getElementById('balanceLabel');
    const balanceValue = document.getElementById('balance');

    balanceBox.classList.remove('success', 'error');

    if (balance > 0) {
        balanceLabel.textContent = 'Falta:';
        balanceValue.textContent = formatCLP(balance);
        balanceBox.classList.add('error');
        document.getElementById('liberarBtn').disabled = true;
    } else {
        balanceBox.classList.add('success');
        document.getElementById('liberarBtn').disabled = false;

        if (balance < 0) {
            balanceLabel.textContent = 'Vuelto:';
            balanceValue.textContent = formatCLP(Math.abs(balance));
        } else {
            balanceLabel.textContent = 'Falta:';
            balanceValue.textContent = '0';
        }
    }
}

// ======================
// FINALIZAR Y LIMPIAR
// ======================
function liberarMesa() {
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const total = parseInt(document.getElementById('totalAmount').textContent.replace(/\./g, '')) || 0;
    const waiterName = document.getElementById('waiterName').textContent;
    
    let mensajeVuelto = "";
    if (totalPaid > total) {
        mensajeVuelto = `\nVuelto a entregar: $${formatCLP(totalPaid - total)}`;
    }

    alert(`✓ Mesa liberada exitosamente!\n\nResumen de Base de Datos:\n- Total Cuenta: $${formatCLP(total)}\n- Total Recibido: $${formatCLP(totalPaid)}${mensajeVuelto}\n- Propina para ${waiterName}: $${formatCLP(assignedTip)}`);

    limpiar();
}

function limpiar() {
    payments = [];
    assignedTip = 0; 
    document.getElementById('paymentAmount').value = '';
    document.getElementById('tipAmount').value = '0';
    document.getElementById('tipFeedback').classList.add('d-none');
    
    updatePaymentList();
    updateTotals();
}