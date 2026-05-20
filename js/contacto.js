// ============================================================
// FORMULARIO DE CONTACTO - FORESAL
// Maneja el envío del formulario con validación y SweetAlert2
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  // Elimina el borde de error en tiempo real al corregir un campo
  form.addEventListener('input', e => {
    if (e.target.value.trim()) {
      e.target.classList.remove('contact-input-error');
    }
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const nombre  = form.nombre.value.trim();
    const email   = form.email.value.trim();
    const mensaje = form.mensaje.value.trim();
    let valido = true;

    // Validación visual de campos requeridos
    [form.nombre, form.email, form.mensaje].forEach(campo => {
      const vacio = !campo.value.trim();
      campo.classList.toggle('contact-input-error', vacio);
      if (vacio) valido = false;
    });

    if (!valido) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completá todos los campos antes de enviar.',
        confirmButtonColor: '#1f4f1f'
      });
      return;
    }

    // Confirmación antes de enviar
    const confirmacion = await Swal.fire({
      icon: 'question',
      title: '¿Enviamos tu mensaje?',
      html: `Recibiremos tu consulta de <strong>${nombre}</strong> al correo ${email}.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1f4f1f',
      cancelButtonColor: '#6c757d'
    });

    if (!confirmacion.isConfirmed) return;

    // Simula el envío exitoso
    await Swal.fire({
      icon: 'success',
      title: '¡Mensaje enviado!',
      html: `
        <p>Gracias por contactarnos, <strong>${nombre}</strong>.</p>
        <p>Te responderemos a <strong>${email}</strong> a la brevedad.</p>`,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1f4f1f'
    });

    form.reset();
  });
});
