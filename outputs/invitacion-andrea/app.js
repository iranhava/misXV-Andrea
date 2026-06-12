const { EVENT_CONFIG, EMAIL_CONFIG } = window;

const inviteType = document.body.dataset.invite === "amigos" ? "Amigos" : "Familiares";
const eventDate = new Date(EVENT_CONFIG.fechaEvento);
const deadline = new Date(EVENT_CONFIG.fechaLimiteConfirmacion);
const galleryImages = [...document.querySelectorAll(".gallery-button img")];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setEventContent() {
  document.querySelectorAll("[data-celebrante]").forEach((el) => { el.textContent = EVENT_CONFIG.celebrante; });
  document.querySelector("[data-ceremony-name]").textContent = EVENT_CONFIG.ceremonia.lugar;
  document.querySelector("[data-ceremony-city]").textContent = EVENT_CONFIG.ceremonia.ciudad;
  document.querySelector("[data-ceremony-time]").textContent = `${EVENT_CONFIG.ceremonia.hora} horas`;
  document.querySelector("[data-ceremony-map]").href = EVENT_CONFIG.ceremonia.maps;
  document.querySelector("[data-reception-name]").textContent = EVENT_CONFIG.recepcion.lugar;
  document.querySelector("[data-reception-city]").textContent = EVENT_CONFIG.recepcion.ciudad;
  document.querySelector("[data-reception-time]").textContent = `${EVENT_CONFIG.recepcion.hora} horas`;
  document.querySelector("[data-reception-map]").href = EVENT_CONFIG.recepcion.maps;
}

function updateCountdown() {
  const distance = Math.max(0, eventDate.getTime() - Date.now());
  const values = {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
  Object.entries(values).forEach(([key, value]) => {
    document.querySelector(`[data-${key}]`).textContent = String(value).padStart(2, "0");
  });
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function setupRomanticEffects() {
  if (prefersReducedMotion) return;

  const layer = document.createElement("div");
  layer.className = "romantic-effects";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const createParticle = (className) => {
    if (document.hidden) return;
    const particle = document.createElement("span");
    particle.className = className;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty("--drift", `${Math.random() * 130 - 65}px`);
    particle.style.setProperty("--duration", `${7 + Math.random() * 8}s`);
    particle.style.setProperty("--delay", `${Math.random() * -3}s`);
    particle.style.opacity = String(.25 + Math.random() * .5);
    layer.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove());
  };

  const createGlow = () => {
    if (document.hidden) return;
    const glow = document.createElement("span");
    glow.className = "floating-glow";
    glow.style.left = `${6 + Math.random() * 88}%`;
    glow.style.top = `${10 + Math.random() * 80}%`;
    glow.style.setProperty("--duration", `${2.5 + Math.random() * 3}s`);
    layer.appendChild(glow);
    glow.addEventListener("animationend", () => glow.remove());
  };

  for (let index = 0; index < 8; index += 1) {
    setTimeout(() => createParticle(index % 2 ? "gold-fall" : "rose-petal"), index * 250);
  }
  setInterval(() => createParticle(Math.random() > .45 ? "gold-fall" : "rose-petal"), 1100);
  setInterval(createGlow, 1500);
}

function setupLightbox() {
  const lightbox = document.querySelector(".lightbox");
  const fullImage = lightbox.querySelector("img");
  let current = 0;

  const show = (index) => {
    current = (index + galleryImages.length) % galleryImages.length;
    fullImage.src = galleryImages[current].src;
    fullImage.alt = galleryImages[current].alt;
  };
  const close = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  document.querySelectorAll(".gallery-button").forEach((button, index) => {
    button.addEventListener("click", () => {
      show(index);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      lightbox.querySelector(".lightbox-close").focus();
    });
  });
  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => show(current - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => show(current + 1));
  lightbox.addEventListener("click", (event) => { if (event.target === lightbox) close(); });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });
}

function renderForm() {
  const host = document.querySelector("[data-rsvp-form]");
  const invitationMessage = document.querySelector(".invitation-message");
  const isClosed = Date.now() > deadline.getTime();

  invitationMessage.textContent = inviteType === "Amigos"
    ? "Tu presencia hará aún más especial este día. Espero contar contigo para celebrar juntos mis XV años."
    : "Con gran alegría compartimos este momento tan especial con nuestra familia y amigos. Será un honor contar con su presencia.";

  if (isClosed) {
    host.innerHTML = '<div class="closed-message">El periodo de confirmación ha concluido. Si requiere realizar algún cambio, favor de comunicarse directamente con la familia.</div>';
    return;
  }

  const extraFields = inviteType === "Amigos"
    ? `<div class="field"><label for="attendance">Asistencia</label><select id="attendance" name="asistencia" required><option value="">Selecciona una opción</option><option value="Sí">Sí asistiré</option><option value="No">No podré asistir</option></select></div>`
    : `<div class="field"><label for="guests">Número de asistentes</label><select id="guests" name="numero_asistentes" required><option value="">Selecciona una opción</option><option value="1">1 persona</option><option value="2">2 personas</option><option value="3">3 personas</option><option value="4">4 personas</option></select></div><div class="field"><label for="message">Mensaje opcional</label><textarea id="message" name="mensaje" placeholder="Escribe un mensaje para Andrea"></textarea></div>`;

  host.innerHTML = `
    <form class="form" id="rsvp-form">
      <div class="field"><label for="name">Nombre completo</label><input id="name" name="nombre" type="text" autocomplete="name" required maxlength="100"></div>
      <div class="field"><label for="phone">Teléfono</label><input id="phone" name="telefono" type="tel" autocomplete="tel" required maxlength="20"></div>
      ${extraFields}
      <input type="hidden" name="tipo_invitacion" value="${inviteType}">
      <input type="hidden" name="destination_email" value="${EMAIL_CONFIG.destinationEmail}">
      <button class="button" type="submit">Enviar confirmación</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>`;

  const form = document.querySelector("#rsvp-form");
  const status = form.querySelector(".form-status");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("button[type='submit']");
    submit.disabled = true;
    submit.textContent = "Enviando...";
    status.className = "form-status";
    status.textContent = "";

    const data = Object.fromEntries(new FormData(form));
    const registrationDate = new Date();
    data.fecha_confirmacion = new Intl.DateTimeFormat("es-MX", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "America/Mexico_City",
    }).format(registrationDate);
    data.fecha_registro = data.fecha_confirmacion;
    data.registration_date = data.fecha_confirmacion;
    data.fecha_registro_iso = registrationDate.toISOString();
    if (inviteType === "Amigos") data.numero_asistentes = data.asistencia === "Sí" ? "1" : "0";
    data.asistentes = data.numero_asistentes;
    data.guests = data.numero_asistentes;
    data.numero_de_asistentes = data.numero_asistentes;
    data.to_email = EMAIL_CONFIG.destinationEmail;
    data.from_name = data.nombre;
    data.phone = data.telefono;
    data.attendance = data.asistencia || `${data.numero_asistentes} asistente(s)`;
    data.invitation_type = data.tipo_invitacion;
    data.confirmation_date = data.fecha_confirmacion;
    data.message = [
      `Nombre: ${data.nombre}`,
      `Teléfono: ${data.telefono}`,
      `Tipo de invitación: ${data.tipo_invitacion}`,
      `Asistencia: ${data.asistencia || "Confirmada"}`,
      `Número de asistentes: ${data.numero_asistentes}`,
      `Mensaje: ${data.mensaje || "Sin mensaje"}`,
      `Fecha de registro: ${data.fecha_registro}`,
    ].join("\n");

    try {
      if (!window.emailjs) throw new Error("EmailJS no está disponible");
      await window.emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, data, { publicKey: EMAIL_CONFIG.publicKey });
      form.reset();
      status.classList.add("success");
      status.textContent = "Gracias por confirmar tu asistencia. Nos alegra compartir este día tan especial contigo.";
    } catch (error) {
      console.error(error);
      status.classList.add("error");
      status.textContent = "No fue posible enviar la confirmación. Por favor, intenta nuevamente en unos minutos.";
    } finally {
      submit.disabled = false;
      submit.textContent = "Enviar confirmación";
    }
  });
}

setEventContent();
updateCountdown();
setInterval(updateCountdown, 1000);
setupReveal();
setupRomanticEffects();
setupLightbox();
renderForm();
