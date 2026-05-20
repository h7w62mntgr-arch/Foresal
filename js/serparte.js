// ============================================================
// POSTULACIÓN LABORAL - FORESAL (Página "Ser Parte")
// Abre un formulario modal con SweetAlert2 para postulaciones
// ============================================================

// Array de posiciones disponibles (JSON accedido via Fetch en carga)
// Posiciones cargadas desde el archivo JSON
let posicionesDisponibles = [];

async function cargarPosiciones() {
  try {
    const respuesta = await fetch('../assets/data/posiciones.json');
    if (!respuesta.ok) throw new Error('No se pudieron cargar las posiciones.');
    posicionesDisponibles = await respuesta.json();
  } catch {
    // Si el fetch falla, usa posiciones por defecto
    posicionesDisponibles = [
      { id: 1, titulo: 'Operador de Maquinaria Forestal' },
      { id: 2, titulo: 'Técnico Forestal' },
      { id: 3, titulo: 'Consultor Ambiental' },
      { id: 4, titulo: 'Asistente Administrativo' },
      { id: 5, titulo: 'Otro / Espontánea' }
    ];
  }
}

// Genera el HTML del formulario de postulación (usado dentro de Swal)
function generarFormularioPostulacion() {
  // map: convierte cada posición en un <option> del select
  const opciones = posicionesDisponibles
    .map(p => `<option value="${p.id}">${p.titulo}</option>`)
    .join('');

  return `
    <form id="form-postulacion" class="swal-form" novalidate>
      <div class="swal-form-group">
        <label for="swal-nombre">Nombre completo *</label>
        <input id="swal-nombre" type="text" placeholder="Juan Pérez" required>
      </div>
      <div class="swal-form-group">
        <label for="swal-email">Email *</label>
        <input id="swal-email" type="email" placeholder="tu@email.com" required>
      </div>
      <div class="swal-form-group">
        <label for="swal-telefono">Teléfono *</label>
        <input id="swal-telefono" type="tel" placeholder="+598 99 000 000" required>
      </div>
      <div class="swal-form-group">
        <label for="swal-posicion">Posición de interés *</label>
        <select id="swal-posicion" required>
          <option value="">Seleccioná una posición...</option>
          ${opciones}
        </select>
      </div>
      <div class="swal-form-group">
        <label for="swal-mensaje">¿Por qué querés sumarte a Foresal?</label>
        <textarea id="swal-mensaje" rows="3" placeholder="Contanos un poco sobre vos..."></textarea>
      </div>
    </form>`;
}

async function abrirFormularioPostulacion() {
  const { value: confirmado } = await Swal.fire({
    title: 'Postulate a Foresal',
    html: generarFormularioPostulacion(),
    showCancelButton: true,
    confirmButtonText: 'Enviar postulación',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#1f4f1f',
    cancelButtonColor: '#6c757d',
    width: '520px',
    didOpen: () => {
      // Agrega estilo inline al contenedor del formulario Swal
      document.getElementById('form-postulacion').style.textAlign = 'left';
    },
    preConfirm: () => {
      const nombre   = document.getElementById('swal-nombre').value.trim();
      const email    = document.getElementById('swal-email').value.trim();
      const telefono = document.getElementById('swal-telefono').value.trim();
      const posicion = document.getElementById('swal-posicion').value;
      const mensaje  = document.getElementById('swal-mensaje').value.trim();

      if (!nombre || !email || !telefono || !posicion) {
        Swal.showValidationMessage('Por favor completá todos los campos requeridos (*).');
        return false;
      }

      return { nombre, email, telefono, posicion, mensaje };
    }
  });

  if (!confirmado) return;

  // find: obtiene el nombre de la posición seleccionada
  const posicionElegida = posicionesDisponibles.find(
    p => p.id === parseInt(confirmado.posicion, 10)
  );

  const referencia = `CV-${Date.now().toString().slice(-6)}`;

  await Swal.fire({
    icon: 'success',
    title: '¡Postulación recibida!',
    html: `
      <p>Gracias, <strong>${confirmado.nombre}</strong>.</p>
      <p>Recibimos tu postulación para <strong>${posicionElegida?.titulo || 'la posición seleccionada'}</strong>.</p>
      <p>Número de referencia: <strong>${referencia}</strong></p>
      <p>Te contactaremos a <strong>${confirmado.email}</strong> a la brevedad.</p>`,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#1f4f1f'
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await cargarPosiciones();

  // Delegación de eventos: todos los botones de postulación
  document.querySelectorAll('.btn-postulacion').forEach(btn => {
    btn.addEventListener('click', abrirFormularioPostulacion);
  });
});
