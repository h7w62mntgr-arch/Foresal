// ============================================================
// COTIZADOR DE SERVICIOS FORESTALES - FORESAL
// Simulador interactivo del proceso comercial de cotización
// ============================================================

// ────────────────────────────────────────────────────────────
// ESTADO GLOBAL DE LA APLICACIÓN
// ────────────────────────────────────────────────────────────
const estado = {
  servicios: [],   // Array completo cargado desde JSON
  seleccion: [],   // Servicios seleccionados con cantidades
  pasoActual: 1
};

// ────────────────────────────────────────────────────────────
// DATOS DE RESPALDO (usados sólo si el fetch falla,
// por ejemplo al abrir el archivo con file://)
// ────────────────────────────────────────────────────────────
const SERVICIOS_FALLBACK = [
  { id: 1, nombre: 'Manejo Forestal',        descripcion: 'Planificación integral y ejecución de proyectos de manejo forestal sostenible.',                                                   categoria: 'campo',        unidad: 'hectárea', precio: 120,  icono: 'bi-tree-fill',      duracion: '1 mes por cada 50 ha'   },
  { id: 2, nombre: 'Preparación de Sitios',  descripcion: 'Preparación del terreno para plantaciones: limpieza, laboreo del suelo y fertilización.',                                        categoria: 'campo',        unidad: 'hectárea', precio: 90,   icono: 'bi-hammer',         duracion: '2 semanas por cada 30 ha' },
  { id: 3, nombre: 'Operación de Maquinaria',descripcion: 'Alquiler y operación de maquinaria forestal especializada con operarios certificados.',                                          categoria: 'campo',        unidad: 'día',      precio: 850,  icono: 'bi-truck',          duracion: 'Según requerimiento'    },
  { id: 4, nombre: 'Cosecha Forestal',        descripcion: 'Tala, extracción y apilamiento de madera con equipos de última generación.',                                                    categoria: 'campo',        unidad: 'hectárea', precio: 200,  icono: 'bi-scissors',       duracion: '3 semanas por cada 20 ha' },
  { id: 5, nombre: 'Replantación',            descripcion: 'Plantación de nuevas especies forestales con material vegetal certificado.',                                                     categoria: 'campo',        unidad: 'hectárea', precio: 75,   icono: 'bi-flower1',        duracion: '1 semana por cada 20 ha'  },
  { id: 6, nombre: 'Consultoría Ambiental',   descripcion: 'Asesoría en impacto ambiental, planes de manejo y gestión de certificaciones FSC/PEFC.',                                       categoria: 'consultoria',  unidad: 'proyecto', precio: 3500, icono: 'bi-leaf',           duracion: '2 a 4 semanas'          },
  { id: 7, nombre: 'Auditoría Forestal',      descripcion: 'Evaluación y certificación de estándares de manejo forestal sostenible.',                                                       categoria: 'consultoria',  unidad: 'proyecto', precio: 2800, icono: 'bi-clipboard-check',duracion: '1 a 2 semanas'          },
  { id: 8, nombre: 'Capacitación en Seguridad',descripcion:'Formación del personal en normas de seguridad para operaciones forestales. Incluye certificación.',                            categoria: 'capacitacion', unidad: 'persona',  precio: 180,  icono: 'bi-shield-check',   duracion: '3 días por grupo'       }
];

// ────────────────────────────────────────────────────────────
// CARGA DE DATOS DESDE JSON (FETCH + ASYNC/AWAIT)
// ────────────────────────────────────────────────────────────
async function cargarServicios() {
  try {
    const respuesta = await fetch('../assets/data/servicios.json');
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    estado.servicios = await respuesta.json();
  } catch {
    // Si el fetch falla (ej: protocolo file://) se usan los datos embebidos
    estado.servicios = SERVICIOS_FALLBACK;
  }
  renderCatalogo(estado.servicios);
}

// ────────────────────────────────────────────────────────────
// RENDERIZADO DEL CATÁLOGO (MAP)
// ────────────────────────────────────────────────────────────
function renderCatalogo(servicios) {
  const contenedor = document.getElementById('catalogo-servicios');

  if (servicios.length === 0) {
    contenedor.innerHTML = '<p class="cot-sin-resultados">No hay servicios que coincidan con la búsqueda.</p>';
    return;
  }

  // map: transforma cada objeto de servicio en su tarjeta HTML
  contenedor.innerHTML = servicios.map(servicio => {
    const estaAgregado = estado.seleccion.some(s => s.id === servicio.id);
    return `
      <article class="cot-card" data-id="${servicio.id}">
        <div class="cot-card__header">
          <i class="bi ${servicio.icono}" aria-hidden="true"></i>
          <span class="cot-card__categoria">${servicio.categoria}</span>
        </div>
        <div class="cot-card__body">
          <h3>${servicio.nombre}</h3>
          <p>${servicio.descripcion}</p>
          <p class="cot-card__precio">
            USD ${servicio.precio.toLocaleString('es-UY')} / ${servicio.unidad}
          </p>
          <p class="cot-card__duracion">
            <i class="bi bi-clock" aria-hidden="true"></i> ${servicio.duracion}
          </p>
        </div>
        <button
          class="cot-btn-agregar${estaAgregado ? ' agregado' : ''}"
          data-id="${servicio.id}"
          aria-label="${estaAgregado ? 'Ya agregado: ' : 'Agregar '}${servicio.nombre}"
        >
          ${estaAgregado
            ? '<i class="bi bi-check-circle-fill"></i> Agregado'
            : '<i class="bi bi-plus-circle"></i> Agregar al presupuesto'}
        </button>
      </article>
    `;
  }).join('');
}

// ────────────────────────────────────────────────────────────
// FILTRADO Y BÚSQUEDA (FILTER + SORT)
// ────────────────────────────────────────────────────────────
function aplicarFiltros() {
  const busqueda = document.getElementById('cot-busqueda').value.toLowerCase().trim();
  const categoria = document.getElementById('cot-filtro-categoria').value;
  const orden = document.getElementById('cot-orden').value;

  // filter: conserva sólo los servicios que coincidan con búsqueda y categoría
  let resultado = estado.servicios.filter(servicio => {
    const coincideBusqueda =
      servicio.nombre.toLowerCase().includes(busqueda) ||
      servicio.descripcion.toLowerCase().includes(busqueda);
    const coincideCategoria = categoria === 'todos' || servicio.categoria === categoria;
    return coincideBusqueda && coincideCategoria;
  });

  // sort: ordena el resultado según el criterio elegido
  resultado.sort((a, b) => {
    if (orden === 'precio-asc') return a.precio - b.precio;
    if (orden === 'precio-desc') return b.precio - a.precio;
    return a.nombre.localeCompare(b.nombre, 'es');
  });

  renderCatalogo(resultado);
}

// ────────────────────────────────────────────────────────────
// GESTIÓN DE SELECCIÓN
// ────────────────────────────────────────────────────────────
function agregarServicio(id) {
  // find: busca el servicio en el catálogo completo
  const servicio = estado.servicios.find(s => s.id === id);
  const existente = estado.seleccion.find(s => s.id === id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    estado.seleccion.push({ ...servicio, cantidad: 1 });
  }

  renderResumen();
  actualizarBotonCatalogo(id, true);
}

function eliminarServicio(id) {
  // filter: crea un nuevo array sin el item eliminado
  estado.seleccion = estado.seleccion.filter(s => s.id !== id);
  renderResumen();
  actualizarBotonCatalogo(id, false);
}

function actualizarCantidad(id, nuevaCantidad) {
  const item = estado.seleccion.find(s => s.id === id);
  if (!item) return;

  const cantidad = parseInt(nuevaCantidad, 10);
  if (!cantidad || cantidad < 1) {
    eliminarServicio(id);
  } else {
    item.cantidad = cantidad;
    renderResumen();
  }
}

function actualizarBotonCatalogo(id, agregado) {
  const btn = document.querySelector(`.cot-btn-agregar[data-id="${id}"]`);
  if (!btn) return;
  if (agregado) {
    btn.classList.add('agregado');
    btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Agregado';
    btn.setAttribute('aria-label', `Ya agregado: ${btn.closest('.cot-card')?.querySelector('h3')?.textContent}`);
  } else {
    btn.classList.remove('agregado');
    btn.innerHTML = '<i class="bi bi-plus-circle"></i> Agregar al presupuesto';
  }
}

// ────────────────────────────────────────────────────────────
// CÁLCULO DE TOTALES (REDUCE)
// ────────────────────────────────────────────────────────────
function calcularTotales() {
  // reduce: acumula subtotal e ítems a partir del array de selección
  return estado.seleccion.reduce(
    (acc, item) => ({
      subtotal: acc.subtotal + item.precio * item.cantidad,
      items: acc.items + item.cantidad
    }),
    { subtotal: 0, items: 0 }
  );
}

// ────────────────────────────────────────────────────────────
// RENDERIZADO DEL PANEL DE RESUMEN
// ────────────────────────────────────────────────────────────
function renderResumen() {
  const panel = document.getElementById('panel-resumen');
  const btnSiguiente = document.getElementById('btn-siguiente');
  const { subtotal } = calcularTotales();
  const iva = subtotal * 0.22;
  const total = subtotal + iva;

  if (estado.seleccion.length === 0) {
    panel.innerHTML = `
      <div class="cot-resumen-vacio">
        <i class="bi bi-clipboard" aria-hidden="true"></i>
        <p>Aún no hay servicios en tu presupuesto.</p>
      </div>`;
    btnSiguiente.disabled = true;
    return;
  }

  // map: genera las filas de cada servicio seleccionado
  const listaHTML = estado.seleccion.map(item => `
    <div class="cot-resumen-item">
      <div class="cot-resumen-item__info">
        <span class="cot-resumen-item__nombre">${item.nombre}</span>
        <span class="cot-resumen-item__uni">${item.unidad}</span>
      </div>
      <div class="cot-resumen-item__controls">
        <input
          type="number"
          class="cot-cantidad"
          value="${item.cantidad}"
          min="1"
          data-id="${item.id}"
          aria-label="Cantidad de ${item.nombre}"
        >
        <span class="cot-resumen-item__precio">
          USD ${(item.precio * item.cantidad).toLocaleString('es-UY')}
        </span>
        <button class="cot-btn-eliminar" data-id="${item.id}" aria-label="Eliminar ${item.nombre}">
          <i class="bi bi-trash" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  `).join('');

  panel.innerHTML = `
    <div class="cot-resumen-lista">${listaHTML}</div>
    <div class="cot-resumen-totales">
      <div class="cot-resumen-linea">
        <span>Subtotal</span>
        <span>USD ${subtotal.toLocaleString('es-UY')}</span>
      </div>
      <div class="cot-resumen-linea">
        <span>IVA (22%)</span>
        <span>USD ${iva.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="cot-resumen-linea cot-resumen-total">
        <span>Total estimado</span>
        <span>USD ${total.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>`;

  btnSiguiente.disabled = false;
}

// ────────────────────────────────────────────────────────────
// NAVEGACIÓN ENTRE PASOS
// ────────────────────────────────────────────────────────────
function irAPaso(paso) {
  document.querySelectorAll('.cot-paso').forEach(el => { el.hidden = true; });
  document.getElementById(`cot-paso-${paso}`).hidden = false;

  document.querySelectorAll('.cot-step__item').forEach((el, idx) => {
    el.classList.toggle('activo', idx + 1 <= paso);
    el.classList.toggle('completado', idx + 1 < paso);
  });

  estado.pasoActual = paso;
  window.scrollTo({ top: document.getElementById('cotizador').offsetTop - 80, behavior: 'smooth' });
}

function siguientePaso() {
  if (estado.pasoActual === 1 && estado.seleccion.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Sin servicios',
      text: 'Agregá al menos un servicio al presupuesto antes de continuar.',
      confirmButtonColor: '#1f4f1f'
    });
    return;
  }
  if (estado.pasoActual === 2 && !validarFormulario()) return;

  irAPaso(estado.pasoActual + 1);

  if (estado.pasoActual === 3) renderConfirmacion();
}

function pasoAnterior() {
  irAPaso(estado.pasoActual - 1);
}

// ────────────────────────────────────────────────────────────
// VALIDACIÓN DEL FORMULARIO
// ────────────────────────────────────────────────────────────
function validarFormulario() {
  const form = document.getElementById('form-proyecto');
  let valido = true;

  form.querySelectorAll('[required]').forEach(campo => {
    const estaVacio = !campo.value.trim();
    campo.classList.toggle('cot-input-error', estaVacio);
    if (estaVacio) valido = false;
  });

  if (!valido) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor completá todos los campos marcados con *.',
      confirmButtonColor: '#1f4f1f'
    });
  }
  return valido;
}

// ────────────────────────────────────────────────────────────
// RENDERIZADO DE LA CONFIRMACIÓN FINAL
// ────────────────────────────────────────────────────────────
function renderConfirmacion() {
  const datos = obtenerDatosFormulario();
  const { subtotal } = calcularTotales();
  const iva = subtotal * 0.22;
  const total = subtotal + iva;

  // map: genera las filas de la tabla de servicios para la confirmación
  const filasServicios = estado.seleccion.map(item => `
    <tr>
      <td>${item.nombre}</td>
      <td class="text-center">${item.cantidad} ${item.unidad}${item.cantidad > 1 ? 's' : ''}</td>
      <td class="text-end">USD ${(item.precio * item.cantidad).toLocaleString('es-UY')}</td>
    </tr>
  `).join('');

  document.getElementById('cot-confirmacion').innerHTML = `
    <div class="cot-confirmacion-bloque">
      <h4><i class="bi bi-person-lines-fill"></i> Datos del proyecto</h4>
      <dl class="cot-confirmacion-dl">
        <dt>Responsable</dt><dd>${datos.nombre} ${datos.apellido}</dd>
        <dt>Empresa / Establecimiento</dt><dd>${datos.empresa || '—'}</dd>
        <dt>Email</dt><dd>${datos.email}</dd>
        <dt>Teléfono</dt><dd>${datos.telefono}</dd>
        <dt>Ubicación</dt><dd>${datos.ubicacion}</dd>
        <dt>Inicio estimado</dt><dd>${datos.fecha}</dd>
        ${datos.notas ? `<dt>Notas</dt><dd>${datos.notas}</dd>` : ''}
      </dl>
    </div>

    <div class="cot-confirmacion-bloque">
      <h4><i class="bi bi-list-check"></i> Servicios seleccionados</h4>
      <table class="cot-tabla">
        <thead>
          <tr>
            <th>Servicio</th>
            <th class="text-center">Cantidad</th>
            <th class="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>${filasServicios}</tbody>
        <tfoot>
          <tr>
            <td colspan="2">Subtotal</td>
            <td class="text-end">USD ${subtotal.toLocaleString('es-UY')}</td>
          </tr>
          <tr>
            <td colspan="2">IVA (22%)</td>
            <td class="text-end">USD ${iva.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr class="cot-tabla__total">
            <td colspan="2"><strong>Total estimado</strong></td>
            <td class="text-end"><strong>USD ${total.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>`;
}

function obtenerDatosFormulario() {
  const form = document.getElementById('form-proyecto');
  return {
    nombre:    form.nombre.value.trim(),
    apellido:  form.apellido.value.trim(),
    empresa:   form.empresa.value.trim(),
    email:     form.email.value.trim(),
    telefono:  form.telefono.value.trim(),
    ubicacion: form.ubicacion.value.trim(),
    fecha:     form.fecha.value,
    notas:     form.notas.value.trim()
  };
}

// ────────────────────────────────────────────────────────────
// ENVÍO DEL PRESUPUESTO (SWEETALERT2 en lugar de confirm)
// ────────────────────────────────────────────────────────────
async function enviarPresupuesto() {
  const { subtotal } = calcularTotales();
  const total = subtotal * 1.22;

  const confirmacion = await Swal.fire({
    icon: 'question',
    title: '¿Confirmás el envío?',
    html: `Se enviará tu solicitud de presupuesto por <strong>USD ${total.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> a nuestro equipo comercial.`,
    showCancelButton: true,
    confirmButtonText: 'Sí, enviar',
    cancelButtonText: 'Revisar',
    confirmButtonColor: '#1f4f1f',
    cancelButtonColor: '#6c757d'
  });

  if (!confirmacion.isConfirmed) return;

  // Genera un número de referencia único
  const referencia = `FOR-${Date.now().toString().slice(-6)}`;

  await Swal.fire({
    icon: 'success',
    title: '¡Solicitud enviada!',
    html: `
      <p>Tu presupuesto fue enviado correctamente.</p>
      <p>Número de referencia: <strong>${referencia}</strong></p>
      <p>Nos comunicaremos contigo a la brevedad.</p>`,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#1f4f1f'
  });

  reiniciarCotizador();
}

function reiniciarCotizador() {
  estado.seleccion = [];
  document.getElementById('form-proyecto').reset();
  document.getElementById('cot-busqueda').value = '';
  document.getElementById('cot-filtro-categoria').value = 'todos';
  document.getElementById('cot-orden').value = 'nombre';
  renderCatalogo(estado.servicios);
  renderResumen();
  irAPaso(1);
}

// ────────────────────────────────────────────────────────────
// CONFIGURACIÓN DE EVENTOS (DELEGACIÓN)
// ────────────────────────────────────────────────────────────
function configurarEventos() {
  // Delegación en el catálogo: botón Agregar
  document.getElementById('catalogo-servicios').addEventListener('click', e => {
    const btn = e.target.closest('.cot-btn-agregar');
    if (btn) agregarServicio(parseInt(btn.dataset.id, 10));
  });

  // Delegación en el panel de resumen: botón Eliminar
  document.getElementById('panel-resumen').addEventListener('click', e => {
    const btn = e.target.closest('.cot-btn-eliminar');
    if (btn) eliminarServicio(parseInt(btn.dataset.id, 10));
  });

  // Delegación en el panel de resumen: cambio de cantidad
  document.getElementById('panel-resumen').addEventListener('change', e => {
    const input = e.target.closest('.cot-cantidad');
    if (input) actualizarCantidad(parseInt(input.dataset.id, 10), input.value);
  });

  // Filtros del catálogo
  document.getElementById('cot-busqueda').addEventListener('input', aplicarFiltros);
  document.getElementById('cot-filtro-categoria').addEventListener('change', aplicarFiltros);
  document.getElementById('cot-orden').addEventListener('change', aplicarFiltros);

  // Botones de navegación
  document.getElementById('btn-siguiente').addEventListener('click', siguientePaso);
  document.getElementById('btn-sig-paso2').addEventListener('click', siguientePaso);
  document.getElementById('btn-ant-paso2').addEventListener('click', pasoAnterior);
  document.getElementById('btn-ant-paso3').addEventListener('click', pasoAnterior);
  document.getElementById('btn-enviar').addEventListener('click', enviarPresupuesto);

  // Elimina el borde rojo en tiempo real al corregir un campo
  document.getElementById('form-proyecto').addEventListener('input', e => {
    if (e.target.required && e.target.value.trim()) {
      e.target.classList.remove('cot-input-error');
    }
  });
}

// ────────────────────────────────────────────────────────────
// INICIALIZACIÓN
// ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await cargarServicios();
  configurarEventos();
  renderResumen();
  irAPaso(1);
});
