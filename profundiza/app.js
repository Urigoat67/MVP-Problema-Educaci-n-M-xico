/* ============================================================
   Profundiza — "TikTok de lectura"
   Feed de micro-textos con comprensión lectora, pistas en vez
   de respuestas, y dificultad adaptativa.
   ============================================================ */

const INTERESES = [
  { id: "ciencia", label: "Ciencia", emoji: "🔬" },
  { id: "cuentos", label: "Cuentos", emoji: "📖" },
  { id: "historia", label: "Historia", emoji: "🏛️" },
  { id: "pensar", label: "Pensar", emoji: "🧠" },
];

const TEXTS = [
  {
    id: 1, cat: "ciencia", dif: 1, emoji: "☁️",
    titulo: "El cielo que ves es luz vieja",
    hook: "El Sol es blanco. ¿Entonces por qué el cielo no es blanco?",
    cuerpo: "La luz del Sol parece blanca, pero en realidad es una mezcla de todos los colores. Cuando entra a la atmósfera, choca con las moléculas del aire y se dispersa. El azul se dispersa mucho más que el rojo, por eso vemos el cielo azul. Al atardecer, la luz viaja más de lado y los azules ya se dispersaron, dejando ver los rojos y naranjas.",
    pregunta: "¿Por qué al atardecer vemos tonos rojos y no azules?",
    opciones: [
      "Porque el Sol se enfría y cambia de color",
      "Porque la luz recorre más atmósfera y el azul ya se dispersó",
      "Porque el cielo refleja el color del mar",
    ],
    correcta: 1,
    pista: "Fíjate en lo que le pasa a la luz azul cuando viaja una distancia más larga.",
  },
  {
    id: 2, cat: "historia", dif: 1, emoji: "🧱",
    titulo: "El muro que no se ve",
    hook: "¿Qué construcción humana sí se ve desde el espacio? No es la que crees.",
    cuerpo: "Se dice que la Gran Muralla China es la única construcción humana visible desde el espacio. Es un mito. Los astronautas han confirmado que, a simple vista desde la órbita, es casi imposible distinguirla: es larguísima, pero demasiado angosta. Lo que sí se ve son las grandes ciudades por la noche, con todas sus luces encendidas.",
    pregunta: "¿Por qué la Gran Muralla NO se ve fácilmente desde el espacio?",
    opciones: [
      "Porque está cubierta de vegetación",
      "Porque es muy larga pero muy angosta",
      "Porque está demasiado lejos de la órbita",
    ],
    correcta: 1,
    pista: "Busca la frase que describe el tamaño del muro: 'larguísima, pero demasiado…'.",
  },
  {
    id: 3, cat: "cuentos", dif: 1, emoji: "🐈‍⬛",
    titulo: "La sombra en la ventana",
    hook: "Ana estaba segura de que era un árbol. Hasta que salió a mirar.",
    cuerpo: "Cada noche, Ana apagaba la luz y miraba la sombra que se dibujaba en su ventana. Siempre era la misma: un árbol, pensaba. Una madrugada salió a verla de cerca y no había ningún árbol. Solo una farola. Y un gato que, desde el poste, la miraba sin moverse.",
    pregunta: "¿Qué descubrió Ana al salir a mirar?",
    opciones: [
      "Que la sombra era de un gato, no de un árbol",
      "Que el árbol se había caído",
      "Que la ventana estaba rota",
    ],
    correcta: 0,
    pista: "¿Qué había en lugar del árbol?",
  },
  {
    id: 4, cat: "ciencia", dif: 2, emoji: "💧",
    titulo: "Un universo en un vaso",
    hook: "El agua que bebiste hoy quizá ya estuvo dentro de un dinosaurio.",
    cuerpo: "Si bebes agua, casi toda esa agua lleva en la Tierra desde hace miles de millones de años. Las moléculas no se destruyen: circulan. Es posible que una gota del agua que tomaste hoy haya estado alguna vez dentro de un dinosaurio. El agua que usamos es, en su mayoría, la misma que usa el planeta desde su origen.",
    pregunta: "¿Qué idea principal sostiene el texto?",
    opciones: [
      "El agua es un recurso que se está agotando",
      "El agua de la Tierra se recicla desde hace miles de millones de años",
      "Los dinosaurios bebían más agua que nosotros",
    ],
    correcta: 1,
    pista: "¿Qué dice el texto sobre el destino de las moléculas de agua?",
  },
  {
    id: 5, cat: "pensar", dif: 2, emoji: "📱",
    titulo: "El precio de lo gratis",
    hook: "Si no pagas por el producto… entonces tú eres el producto.",
    cuerpo: "Cuando un servicio es gratuito, tú no eres el cliente: eres el producto. La empresa gana dinero vendiendo tu atención y tus datos a anunciantes. Por eso las apps 'gratis' están diseñadas para que pases el mayor tiempo posible dentro: no te venden una herramienta, te venden a ti.",
    pregunta: "Según el texto, ¿cómo ganan dinero las apps gratuitas?",
    opciones: [
      "Cobrando pequeñas comisiones a los bancos",
      "Vendiendo tu atención y tus datos a anunciantes",
      "Pidiendo donaciones voluntarias",
    ],
    correcta: 1,
    pista: "Revisa la segunda frase del texto.",
  },
  {
    id: 6, cat: "cuentos", dif: 2, emoji: "⏳",
    titulo: "La máquina de los recuerdos",
    hook: "Iba a borrar su peor recuerdo. Al llegar al frente, dudó.",
    cuerpo: "Inventaron una máquina para borrar malos recuerdos. Hacía cola para usarla, pero al llegar al frente, dudó. ¿Quién sería sin aquel día que tanto le dolió? Se fue a casa, abrió un cajón y, por primera vez en años, lloró sin querer borrar nada.",
    pregunta: "¿Qué hace cambiar de opinión al protagonista?",
    opciones: [
      "La máquina se descompone",
      "Comprende que el dolor es parte de quien es",
      "Otra persona le quita el turno",
    ],
    correcta: 1,
    pista: "¿Qué se pregunta a sí mismo justo antes de irse?",
  },
  {
    id: 7, cat: "pensar", dif: 3, emoji: "🎯",
    titulo: "La tentación del ejemplo único",
    hook: "Mi abuelo fumó y vivió 95 años. ¿Eso prueba que fumar no hace daño?",
    cuerpo: "'Mi abuelo fumó toda su vida y vivió 95 años. Por lo tanto, fumar no es tan malo.' Este razonamiento es una falacia: usa un solo caso para contradecir miles de estudios. Un caso aislado no demuestra una regla; solo muestra que existen excepciones. La ciencia trabaja con tendencias, no con anécdotas.",
    pregunta: "¿Cuál es el error del razonamiento del abuelo?",
    opciones: [
      "Confundir una anécdota con evidencia general",
      "No considerar que el abuelo pudo mentir",
      "Pensar que fumar afecta solo a los pulmones",
    ],
    correcta: 0,
    pista: "¿Qué significa la palabra 'falacia' según el texto?",
  },
  {
    id: 8, cat: "ciencia", dif: 3, emoji: "⚛️",
    titulo: "El observador que cambia todo",
    hook: "En el mundo cuántico, mirar una partícula no es observarla: es cambiarla.",
    cuerpo: "En el mundo cuántico, medir una partícula no es solo observarla: es alterarla. Antes de medir, el electrón no tiene una posición exacta; existe como un abanico de posibilidades. El acto de medir lo obliga a 'elegir' una. No es que no sepamos dónde está; es que, en cierto sentido, no está en ningún lugar definido hasta que lo medimos.",
    pregunta: "¿Qué implica medir una partícula según el texto?",
    opciones: [
      "Descubrir una posición que ya existía",
      "Obligarla a definirse entre varias posibilidades",
      "Deteriorar la partícula con el instrumento",
    ],
    correcta: 1,
    pista: "El texto dice: 'El acto de medir lo obliga a…'.",
  },
  {
    id: 9, cat: "historia", dif: 3, emoji: "💡",
    titulo: "La invención que no era de quien crees",
    hook: "Edison es famoso por la bombilla. Spoiler: no la inventó.",
    cuerpo: "Thomas Edison es famoso por la bombilla, pero no la inventó: perfeccionó una idea que ya existía desde décadas atrás. Su verdadero genio no fue inventar la luz, sino crear el sistema completo que la hacía útil: generadores, cables, medidores. La historia premia a quien hace que una idea funcione para todos, no a quien la piensa primero.",
    pregunta: "Según el texto, ¿cuál fue el verdadero mérito de Edison?",
    opciones: [
      "Ser el primero en imaginar la bombilla",
      "Crear el sistema completo que la hizo útil",
      "Descubrir la electricidad",
    ],
    correcta: 1,
    pista: "¿Qué dice el texto que fue su 'verdadero genio'?",
  },
  {
    id: 10, cat: "cuentos", dif: 3, emoji: "🗺️",
    titulo: "El mapa",
    hook: "Dibujó un mapa tan perfecto que al final ocupó toda la ciudad.",
    cuerpo: "Un hombre pasó su vida dibujando el mapa perfecto de su ciudad. Lo dibujaba tan detallado que al final ocupó toda la ciudad. Los habitantes, para no pisarlo, caminaban por los bordes. Un día el hombre terminó su mapa y miró a su alrededor: ya no había ciudad, solo un mapa.",
    pregunta: "¿Qué crítica encierra el microcuento?",
    opciones: [
      "Que la obsesión por representar algo puede destruir lo real",
      "Que los mapas deben ser más pequeños",
      "Que la ciudad era demasiado grande",
    ],
    correcta: 0,
    pista: "¿Qué pasó con la ciudad al final del relato?",
  },
  {
    id: 11, cat: "ciencia", dif: 1, emoji: "🚢",
    titulo: "El barco que no debía flotar",
    hook: "Un clavo de acero se hunde. ¿Por qué un barco de acero, no?",
    cuerpo: "Un barco puede pesar miles de toneladas de acero y aun así flotar. El secreto no está en el material, sino en el espacio: un barco está hueco por dentro y desplaza una enorme cantidad de agua. Si el agua que empuja pesa más que el propio barco, el agua lo sostiene. Por eso un clavo de acero se hunde y un barco del mismo material flota.",
    pregunta: "¿Por qué un barco de acero flota y un clavo de acero no?",
    opciones: [
      "Porque el barco tiene motor",
      "Porque el barco desplaza más agua de la que pesa",
      "Porque el agua salada es más ligera",
    ],
    correcta: 1,
    pista: "El secreto está en la cantidad de agua que el objeto empuja al entrar.",
  },
  {
    id: 12, cat: "historia", dif: 2, emoji: "🗓️",
    titulo: "El año de la confusión",
    hook: "Hubo un año en la historia que duró 445 días. ¿Cómo es posible?",
    cuerpo: "Cuando Roma adoptó el calendario juliano, en el año 46 a.C., el calendario antiguo estaba tan desfasado que las estaciones ya no coincidían con los meses. Para corregirlo, ese año tuvo 445 días: se le agregaron meses enteros. La gente lo llamó 'el año de la confusión'. Fue el precio de volver a sincronizar el calendario con el Sol.",
    pregunta: "¿Por qué el año 46 a.C. tuvo 445 días?",
    opciones: [
      "Por un error de los astrónomos",
      "Para volver a sincronizar el calendario con las estaciones",
      "Porque el emperador quería un año largo",
    ],
    correcta: 1,
    pista: "¿Cuál era el problema que querían corregir con ese ajuste?",
  },
  {
    id: 13, cat: "cuentos", dif: 2, emoji: "✉️",
    titulo: "La última carta",
    hook: "Escribió cartas toda su vida y nunca envió ninguna.",
    cuerpo: "Toda su vida escribió cartas que nunca envió. Las guardaba en una caja de zapatos, ordenadas por fecha. Al morir, su hija las encontró y las leyó una por una. La última decía: 'Mañana empiezo a decirlo todo en persona'. La hija cerró la caja y lloró: no por lo que decía, sino por todo lo que ya no tendría respuesta.",
    pregunta: "¿Por qué llora la hija al terminar de leer?",
    opciones: [
      "Porque las cartas estaban mal escritas",
      "Porque entiende que las palabras nunca se dijeron a tiempo",
      "Porque la caja estaba rota",
    ],
    correcta: 1,
    pista: "Fíjate en la frase 'lo que ya no tendría respuesta'.",
  },
  {
    id: 14, cat: "pensar", dif: 3, emoji: "🍦",
    titulo: "Correlación no es causalidad",
    hook: "En verano suben los helados. Y los ahogamientos. ¿Causa y efecto?",
    cuerpo: "En verano sube la venta de helados. En verano también aumentan los ahogamientos. ¿Significa que los helados causan ahogamientos? No. Ambos aumentan por una tercera causa: el calor, que lleva a más gente al agua. Confundir 'ocurren juntos' con 'uno causa al otro' es un error clásico. La correlación no implica causalidad.",
    pregunta: "¿Cuál es la idea central del texto?",
    opciones: [
      "Los helados son peligrosos en verano",
      "Que dos cosas ocurran juntas no prueba que una cause la otra",
      "El calor causa todos los accidentes",
    ],
    correcta: 1,
    pista: "¿Qué frase del texto resume el error que describe?",
  },
  {
    id: 15, cat: "ciencia", dif: 3, emoji: "🔄",
    titulo: "Tu cuerpo se renueva, tú no",
    hook: "En siete años, casi todos tus átomos serán otros. ¿Y tú, quién eres?",
    cuerpo: "Tu cuerpo se está reemplazando todo el tiempo: las células de la piel viven semanas, los glóbulos rojos meses. En unos siete años, casi todos tus átomos habrán sido sustituidos por otros nuevos. Y sin embargo, sigues siendo tú. No eres la materia que te compone, sino el patrón, la información que se conserva mientras las piezas cambian.",
    pregunta: "¿Qué conclusión se desprende del texto?",
    opciones: [
      "Que el cuerpo nunca cambia",
      "Que la identidad está en el patrón, no en la materia",
      "Que los átomos son eternos",
    ],
    correcta: 1,
    pista: "¿Qué dice el texto que se conserva mientras las piezas cambian?",
  },
  {
    id: 16, cat: "historia", dif: 1, emoji: "🍫",
    titulo: "El chocolate que era dinero",
    hook: "Antes de ser tu postre favorito, el cacao era moneda.",
    cuerpo: "Los aztecas valoraban tanto el cacao que lo usaban como dinero. Con diez granos podías comprar un conejo; con cien, un esclavo. El chocolate no era un dulce: era una bebida amarga y espumosa, reservada para nobles y guerreros. Cuando los españoles lo llevaron a Europa y le añadieron azúcar, se convirtió en lo que hoy conocemos.",
    pregunta: "¿Para qué usaban los aztecas el cacao?",
    opciones: [
      "Solo como postre",
      "Como dinero y como bebida reservada a nobles",
      "Para hacer medicina",
    ],
    correcta: 1,
    pista: "¿Qué podías comprar con granos de cacao?",
  },
];

const EXPLICAS = {
  1: "El azul se dispersa con más fuerza, pero al atardecer la luz recorre más atmósfera y el azul ya se dispersó en el camino, dejando ver rojos y naranjas.",
  2: "El texto lo dice claro: es larguísima pero demasiado angosta, por eso no se distingue desde la órbita.",
  3: "Al salir, Ana ve una farola y un gato en el poste: la sombra que creía de un árbol era el gato.",
  4: "La idea central es que el agua no se destruye: circula y se recicla desde el origen del planeta.",
  5: "La tesis está en la segunda frase: la empresa gana vendiendo tu atención y tus datos a anunciantes.",
  6: "Se pregunta '¿quién sería sin aquel día?', y entiende que el dolor es parte de quien es.",
  7: "Una anécdota (un solo caso) no demuestra una regla general; eso es justamente la falacia.",
  8: "Medir no descubre una posición: obliga a la partícula a 'elegir' una entre varias posibilidades.",
  9: "Su genio fue el sistema completo (generadores, cables, medidores), no la bombilla en sí.",
  10: "El mapa perfecto acabó sustituyendo a la ciudad real: la representación destruyó lo representado.",
  11: "Flotar depende del agua desplazada: el barco hueco empuja más agua de la que pesa, y el agua lo sostiene.",
  12: "El calendario estaba desfasado respecto al Sol; agregar días fue el ajuste para realinear meses y estaciones.",
  13: "El dolor viene de que esas palabras quedaron sin ser dichas ni respondidas: llegaron demasiado tarde.",
  14: "La idea central es que correlación (ocurrir juntos) no es lo mismo que causalidad (uno causa al otro).",
  15: "Aunque los átomos se reemplazan, lo que permanece (y nos define) es el patrón o la información.",
  16: "El cacao era moneda y también una bebida amarga reservada a nobles y guerreros.",
};

/* ---------- estado ---------- */
const state = {
  intereses: [],
  deck: [],
  index: 0,
  answered: {},       // idx -> true si ya leyó (tocó "Leer")
  results: {},        // idx -> "correct" | "wrong"
  readStart: {},      // idx -> timestamp de cuándo empezó a leer
  picked: {},         // idx -> opción elegida
  streak: 0,
  bestStreak: 0,
  points: 0,
  level: 1,
  maxFocus: 0,        // segundos máximos de lectura sostenida (record de atención)
  totalFocus: 0,      // segundos totales leyendo
  wordsRead: 0,       // palabras leídas
  attention: 20,      // nivel de atención adaptativo (segundos, EMA) — crece/baja contigo
  studentName: "",    // nombre del alumno (para el panel docente)
};

/* ---------- helpers ---------- */
const $ = (id) => document.getElementById(id);
const DIFF_LABEL = { 1: "Fácil", 2: "Medio", 3: "Difícil" };

function load() {
  const s = localStorage.getItem("profundiza");
  if (s) Object.assign(state, JSON.parse(s));
}
function save() {
  localStorage.setItem("profundiza", JSON.stringify({
    streak: state.streak, bestStreak: state.bestStreak,
    points: state.points, level: state.level,
    maxFocus: state.maxFocus, totalFocus: state.totalFocus, wordsRead: state.wordsRead,
    attention: state.attention, studentName: state.studentName,
  }));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- motor adaptativo de atención ---------- */
function words(t) { return t.cuerpo.trim().split(/\s+/).length; }
function readSec(t) { return Math.max(8, Math.round((words(t) / 200) * 60)); } // segundos estimados de lectura

/* actualiza el nivel de atención con la media móvil del tiempo real de lectura */
function updateAttention(elapsedSec) {
  const a = state.attention * 0.6 + elapsedSec * 0.4;
  state.attention = Math.round(Math.max(8, Math.min(120, a)));
  save();
}

/* construye un orden personalizado: textos cerca de tu atención, subiendo poco a poco */
function buildDeck() {
  const cats = state.intereses.length ? state.intereses : INTERESES.map(i => i.id);
  const pool = TEXTS.filter(t => cats.includes(t.cat));
  let att = state.attention;
  const order = [];
  const rest = [...pool];
  while (rest.length) {
    const target = att * 1.12; // un poco más de lo que hoy aguantas
    rest.sort((a, b) => Math.abs(readSec(a) - target) - Math.abs(readSec(b) - target));
    const next = rest.shift();
    order.push(next);
    att = att * 0.6 + readSec(next) * 0.4; // simula que tu atención crece con cada texto
  }
  state.deck = order;
}

/* ---------- onboarding ---------- */
function renderInterests() {
  const wrap = $("interests");
  wrap.innerHTML = "";
  INTERESES.forEach(i => {
    const b = document.createElement("button");
    b.className = "chip" + (state.intereses.includes(i.id) ? " active" : "");
    b.innerHTML = `<span class="emoji">${i.emoji}</span>${i.label}`;
    b.onclick = () => {
      const p = state.intereses.indexOf(i.id);
      if (p >= 0) state.intereses.splice(p, 1); else state.intereses.push(i.id);
      renderInterests();
      $("startBtn").disabled = state.intereses.length === 0;
    };
    wrap.appendChild(b);
  });
}

/* ---------- feed ---------- */
function renderTrack() {
  const track = $("track");
  track.innerHTML = "";
  state.deck.forEach((t, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.idx = i;
    card.innerHTML = cardHTML(t, i);
    track.appendChild(card);
  });
  updateStats();
  positionCards();
}

function cardHTML(t, i) {
  const answered = state.answered[i];
  const res = state.results[i];
  const dots = [1, 2, 3].map(d => `<span class="dot ${d <= t.dif ? "on" : ""}"></span>`).join("");

  let inner;
  if (!answered) {
    inner = `
      <div class="hook">
        <div class="hook-emoji">${t.emoji}</div>
        <div class="hook-title">${t.titulo}</div>
        <div class="hook-sub">${t.hook}</div>
        <button class="read-btn" data-act="read">Leer →</button>
      </div>`;
  } else {
    const opts = t.opciones.map((o, oi) => {
      let cls = "option";
      if (res === "correct" && oi === t.correcta) cls += " correct";
      if (res === "wrong") {
        if (oi === t.correcta) cls += " correct";
        if (oi === state.picked[i]) cls += " wrong";
      }
      return `<button class="${cls}" data-act="answer" data-opt="${oi}" ${res ? "disabled" : ""}>${o}</button>`;
    }).join("");

    const feedback = res === "correct"
      ? `<div class="feedback good">
           <div class="msg">¡Correcto! 🔥</div>
           <div class="hint-box" style="border-color:rgba(47,214,143,.4);background:rgba(47,214,143,.08);color:#b8f3d8">✅ ${EXPLICAS[t.id]}</div>
         </div>`
      : res === "wrong"
        ? `<div class="feedback bad">
             <div class="msg">Todavía no. Vuelve a leer.</div>
             <div class="hint-box">💡 <b>Pista:</b> ${t.pista}</div>
           </div>`
        : "";

    const next = res
      ? (i < state.deck.length - 1
          ? `<div class="next-hint">↓ Siguiente texto</div>`
          : `<div class="next-hint">Terminaste la ronda →</div>`)
      : "";

    inner = `
      <div class="card-meta">
        <span class="badge">${t.cat}</span>
        <span class="dots">${dots}</span>
        <span class="badge" style="color:#9a9ab0">${DIFF_LABEL[t.dif]}</span>
      </div>
      <h2>${t.titulo}</h2>
      <p class="body">${t.cuerpo}</p>
      <div class="question">
        <div class="q-label">Comprueba que entendiste</div>
        <div class="q-text">${t.pregunta}</div>
        ${opts}
      </div>
      ${feedback}
      <div class="tutor">
        <button class="tutor-btn" data-act="tutor">🧠 No entiendo, dame una pista</button>
        <div class="tutor-out hidden"></div>
      </div>
      ${next}`;
  }

  return `<div class="card-inner">${inner}</div>`;
}

function positionCards() {
  document.querySelectorAll(".card").forEach((card) => {
    const i = +card.dataset.idx;
    const offset = i - state.index;
    card.style.transform = `translateY(${offset * 100}%)`;
    card.style.opacity = Math.abs(offset) > 1 ? 0 : 1;
    card.style.pointerEvents = offset === 0 ? "auto" : "none";
  });
  $("prevBtn").disabled = state.index === 0;
  const pct = state.deck.length ? ((state.index + 1) / state.deck.length) * 100 : 0;
  $("progressFill").style.width = pct + "%";
}

function updateStats() {
  $("streak").textContent = state.streak;
  $("points").textContent = state.points;
  $("level").textContent = state.level;
  $("focus").textContent = state.attention + "s";
}

function goTo(i) {
  if (i < 0 || i >= state.deck.length) return;
  state.index = i;
  positionCards();
}

function refreshCurrent() {
  const card = document.querySelector(`.card[data-idx="${state.index}"]`);
  if (card) card.innerHTML = cardHTML(state.deck[state.index], state.index);
  positionCards();
}

/* ---------- acciones ---------- */
function handleRead(i) {
  state.answered[i] = true;
  state.readStart[i] = Date.now();
  refreshCurrent();
}

function handleAnswer(i, opt) {
  const t = state.deck[i];
  const ok = opt === t.correcta;
  state.results[i] = ok ? "correct" : "wrong";
  state.picked[i] = opt;

  // métricas de atención
  const elapsed = state.readStart[i] ? Math.round((Date.now() - state.readStart[i]) / 1000) : 0;
  state.maxFocus = Math.max(state.maxFocus, elapsed);
  state.totalFocus += elapsed;
  state.wordsRead += words(t);
  updateAttention(elapsed);

  // leer "por encima": no se castiga, se adapta
  if (elapsed < readSec(t) * 0.5) {
    showToast(`Leíste en ${elapsed}s. Me adapto: te mando textos más cortos 📉`);
  }

  if (ok) {
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.points += 10 * t.dif;
    if (state.streak >= 3) {
      state.level = Math.min(10, state.level + 1);
      state.streak = 0;
      showToast(`¡Subiste a Nivel ${state.level}! 🚀`);
    }
  } else {
    state.streak = 0;
    state.points = Math.max(0, state.points - 5);
  }
  save();
  updateStats();
  refreshCurrent();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function handleTutor(i) {
  const t = state.deck[i];
  const card = document.querySelector(`.card[data-idx="${i}"]`);
  if (!card) return;
  const out = card.querySelector(".tutor-out");
  const btn = card.querySelector(".tutor-btn");

  btn.disabled = true;
  btn.textContent = "🧠 El tutor está pensando…";
  out.classList.remove("hidden");
  out.innerHTML = `<div class="tutor-loading"><span></span><span></span><span></span> Pensando…</div>`;

  try {
    const r = await fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texto: t.cuerpo,
        pregunta: t.pregunta,
        opciones: t.opciones,
        mensaje: "No entiendo, ayúdame a razonar sin darme la respuesta",
      }),
    });

    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.error || "Error del servidor (" + r.status + ")");
    }

    out.innerHTML = `<div class="tutor-box">🧠 <span class="tutor-text"></span><span class="tutor-cursor"></span></div>`;
    const box = out.querySelector(".tutor-text");
    const reader = r.body.getReader();
    const decoder = new TextDecoder();
    let full = "";
    let buf = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const parts = buf.split("\n\n");
      buf = parts.pop();
      for (const p of parts) {
        const line = p.trim();
        if (!line.startsWith("data:")) continue;
        const d = line.slice(5).trim();
        if (d === "[DONE]") continue;
        try { full += JSON.parse(d); } catch { full += d; }
      }
      box.textContent = full;
      const cardInner = card.querySelector(".card-inner");
      cardInner.scrollTop = cardInner.scrollHeight;
    }
    box.textContent = full;
    const cursor = out.querySelector(".tutor-cursor");
    if (cursor) cursor.remove();
  } catch (e) {
    out.innerHTML = `<div class="hint-box" style="border-color:var(--bad)">⚠️ ${escapeHtml(e.message)}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = "🧠 Seguir preguntando al tutor";
  }
}

function showToast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.add("hidden"), 2200);
}

function next() {
  if (state.index >= state.deck.length - 1) {
    showResults();
    return;
  }
  goTo(state.index + 1);
}
function prev() { goTo(state.index - 1); }

/* ---------- resultados ---------- */
function showResults() {
  const total = state.deck.length;
  const correct = Object.values(state.results).filter(r => r === "correct").length;
  const pct = total ? Math.round((correct / total) * 100) : 0;

  $("scorePct").textContent = pct + "%";
  $("scoreRing").style.background = `conic-gradient(var(--accent2) ${pct * 3.6}deg, #1f1f33 0deg)`;
  $("rCorrect").textContent = correct + "/" + total;
  $("rStreak").textContent = state.bestStreak;
  $("rLevel").textContent = state.level;
  $("rFocus").textContent = state.maxFocus + "s";
  $("rWords").textContent = state.wordsRead;
  $("rTime").textContent = state.totalFocus + "s";

  if (pct >= 80) {
    $("resultTitle").textContent = "¡Lectura profunda activada!";
    $("resultMsg").textContent = `No solo leíste: entendiste. Sostuviste hasta ${state.maxFocus}s de lectura sin distraerte.`;
  } else if (pct >= 50) {
    $("resultTitle").textContent = "Vas bien";
    $("resultMsg").textContent = `Estás leyendo con atención (máx ${state.maxFocus}s). La clave: relee cuando dudes.`;
  } else {
    $("resultTitle").textContent = "A releer se ha dicho";
    $("resultMsg").textContent = "No es memoria, es comprensión. Vuelve a intentarlo sin prisa.";
  }

  $("feed").classList.add("hidden");
  $("results").classList.remove("hidden");

  // registrar resultado real en el panel del docente
  if (state.studentName) {
    addToRoster({
      nombre: state.studentName,
      fecha: new Date().toLocaleDateString("es-MX"),
      pct, correct, total,
      level: state.level,
      attention: state.attention,
    });
  }
}

function startRound() {
  const nameEl = $("studentName");
  if (nameEl && nameEl.value.trim()) {
    state.studentName = nameEl.value.trim();
    save();
  }
  buildDeck();
  state.index = 0;
  state.answered = {};
  state.results = {};
  state.picked = {};
  state.readStart = {};
  state.streak = 0;
  renderTrack();
  $("onboarding").classList.add("hidden");
  $("results").classList.add("hidden");
  $("feed").classList.remove("hidden");
}

/* ---------- eventos delegados ---------- */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const card = e.target.closest(".card");
  if (!card) return;
  const i = +card.dataset.idx;
  const act = btn.dataset.act;
  if (act === "read") handleRead(i);
  if (act === "answer") handleAnswer(i, +btn.dataset.opt);
  if (act === "tutor") handleTutor(i);
});

document.addEventListener("keydown", (e) => {
  if ($("feed").classList.contains("hidden")) return;
  const cur = state.deck[state.index];
  if (!state.answered[state.index]) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleRead(state.index); }
  } else if (!state.results[state.index]) {
    if (["1", "2", "3"].includes(e.key)) handleAnswer(state.index, +e.key - 1);
  } else {
    if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
      e.preventDefault(); next();
    }
  }
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); prev(); }
});

/* ---------- swipe táctil ---------- */
let touchY = null;
document.addEventListener("touchstart", (e) => { touchY = e.touches[0].clientY; }, { passive: true });
document.addEventListener("touchend", (e) => {
  if (touchY === null) return;
  const dy = e.changedTouches[0].clientY - touchY;
  touchY = null;
  if (Math.abs(dy) < 50) return;
  if (dy < 0) next(); else prev();
}, { passive: true });

/* ---------- wheel ---------- */
let wheelLock = false;
document.addEventListener("wheel", (e) => {
  if ($("feed").classList.contains("hidden")) return;
  if (wheelLock) return;
  if (Math.abs(e.deltaY) < 20) return;
  wheelLock = true;
  if (e.deltaY > 0) next(); else prev();
  setTimeout(() => (wheelLock = false), 500);
}, { passive: true });

/* ---------- botones ---------- */
$("nextBtn").onclick = next;
$("prevBtn").onclick = prev;
$("startBtn").onclick = startRound;
$("teacherBtn").onclick = () => {
  teacherShowDemo = false;
  renderTeacher();
  $("onboarding").classList.add("hidden");
  $("teacher").classList.remove("hidden");
};
$("teacherBackBtn").onclick = () => {
  $("teacher").classList.add("hidden");
  $("onboarding").classList.remove("hidden");
};
$("exportBtn").onclick = exportCSV;
$("demoBtn").onclick = () => {
  teacherShowDemo = !teacherShowDemo;
  renderTeacher();
};
$("pitchBtn").onclick = openPitch;
$("pitchCloseBtn").onclick = closePitch;
document.addEventListener("keydown", (e) => {
  if (e.key === "p" || e.key === "P") openPitch();
  if (e.key === "Escape" && !$("pitch").classList.contains("hidden")) closePitch();
});
$("againBtn").onclick = startRound;
$("resetBtn").onclick = () => {
  localStorage.removeItem("profundiza");
  state.streak = 0; state.bestStreak = 0; state.points = 0; state.level = 1;
  updateStats();
  startRound();
};

/* ---------- modo docente ---------- */
const NOMBRES = ["Sofía","Diego","Valentina","Emiliano","Regina","Santiago","Ximena","Mateo","Camila","Sebastián","Renata","Iker","Fernanda","Ángel","Mariana","Leo","Daniela","Bruno","Paola","Rodrigo","Lucía","Gael","Isabella","Emilio","Julieta","Iván","Victoria","Óscar","Renata","Alan","Andrea","Héctor","Montserrat","Damián","Carolina","Julián","Aitana","Pablo","Natalia","Édgar","Gabriela","Marco","Alexa","Jorge","Elena"];
const APELLIDOS = ["Hernández","García","López","Martínez","González","Pérez","Sánchez","Ramírez","Flores","Torres","Díaz","Vázquez","Cruz","Reyes","Morales","Ortiz","Jiménez","Ruiz","Mendoza","Aguilar"];

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function genStudents() {
  const rng = mulberry32(20261120);
  const students = [];
  for (let i = 0; i < 45; i++) {
    const nombre = NOMBRES[i % NOMBRES.length] + " " + APELLIDOS[Math.floor(rng() * APELLIDOS.length)];
    const r = rng();
    let pct;
    if (r < 0.22) pct = Math.floor(rng() * 25) + 15;          // en riesgo 15-39
    else if (r < 0.7) pct = Math.floor(rng() * 30) + 40;       // en camino 40-69
    else pct = Math.floor(rng() * 25) + 70;                    // profundo 70-94
    const level = pct < 50 ? 1 : pct < 75 ? 2 : 3;
    students.push({ nombre, pct, level, racha: Math.floor(rng() * 12) });
  }
  return students.sort((a, b) => b.pct - a.pct);
}

function getRoster() {
  try { return JSON.parse(localStorage.getItem("profundiza_roster") || "[]"); }
  catch { return []; }
}
function addToRoster(entry) {
  const r = getRoster();
  const i = r.findIndex(x => x.nombre.toLowerCase() === entry.nombre.toLowerCase());
  if (i >= 0) r[i] = entry;   // misma persona: se actualiza su último resultado
  else r.push(entry);
  localStorage.setItem("profundiza_roster", JSON.stringify(r));
}

let teacherShowDemo = false;

function renderTeacher() {
  const roster = getRoster();
  const useReal = roster.length > 0 && !teacherShowDemo;
  const students = useReal
    ? roster.map(r => ({ nombre: r.nombre, pct: r.pct, level: r.level })).sort((a, b) => b.pct - a.pct)
    : genStudents();

  const n = students.length;
  const avg = Math.round(students.reduce((s, x) => s + x.pct, 0) / n);
  const low = students.filter(s => s.pct < 50).length;
  const high = students.filter(s => s.pct >= 75).length;
  const mid = n - low - high;

  $("teacherClassTitle").textContent = useReal ? "Mi grupo — resultados reales" : "3.° B — Secundaria (demo)";
  $("teacherStatus").textContent = useReal
    ? `${n} ${n === 1 ? "alumno ha" : "alumnos han"} completado la prueba en este dispositivo`
    : `Datos de ejemplo para el pitch · ${n} alumnos`;

  $("kpiAvg").textContent = avg + "%";
  $("kpiLow").textContent = low;
  $("kpiHigh").textContent = high;

  $("distLow").style.width = (low / n * 100) + "%";
  $("distMid").style.width = (mid / n * 100) + "%";
  $("distHigh").style.width = (high / n * 100) + "%";

  const insightEl = $("insight");
  if (low >= 1) {
    insightEl.innerHTML = `⚠️ <b>${low} ${low === 1 ? "alumno está" : "alumnos están"} por debajo del mínimo de comprensión.</b> Recomendación: asignarles la ronda de nivel <b>Fácil</b> y reforzar con relectura guiada. ${high} ya leen en nivel profundo; úsalos como tutores entre pares.`;
  } else {
    insightEl.innerHTML = `✅ Todo el grupo supera el mínimo. <b>${high} ${high === 1 ? "alumno lee" : "alumnos leen"} en nivel profundo.</b> Sugerencia: subir la dificultad de la siguiente ronda.`;
  }

  // lista de alumnos
  const listEl = $("studentList");
  listEl.innerHTML = "";
  students.forEach((s, i) => {
    const cls = s.pct < 50 ? "low" : s.pct < 75 ? "mid" : "high";
    const barColor = s.pct < 50 ? "var(--bad)" : s.pct < 75 ? "var(--warn)" : "var(--good)";
    const div = document.createElement("div");
    div.className = "student";
    div.innerHTML = `
      <span class="s-rank">${i + 1}</span>
      <span class="s-name">${s.nombre}</span>
      <span class="s-bar"><i style="width:${s.pct}%;background:${barColor}"></i></span>
      <span class="s-pct ${cls}">${s.pct}%</span>`;
    listEl.appendChild(div);
  });

  // textos difíciles (simulados por tasa de fallo)
  const hard = [
    { t: TEXTS[9].titulo, pct: 68 },   // El mapa
    { t: TEXTS[7].titulo, pct: 64 },   // cuántico
    { t: TEXTS[13].titulo, pct: 61 },  // correlación
    { t: TEXTS[6].titulo, pct: 55 },   // falacia
  ].sort((a, b) => b.pct - a.pct);
  const hardEl = $("hardTexts");
  hardEl.innerHTML = "";
  hard.forEach((h, i) => {
    const colors = ["#ff5c7a", "#ff8a5c", "#ffc24b", "#ffd98a"];
    const div = document.createElement("div");
    div.className = "hard-text";
    div.innerHTML = `<span class="ht-dot" style="background:${colors[i]}"></span>${h.t}<span class="ht-pct">${h.pct}% fallo</span>`;
    hardEl.appendChild(div);
  });
}

function exportCSV() {
  const roster = getRoster();
  if (!roster.length) { showToast("Aún no hay alumnos reales. Haz que alguien complete una ronda."); return; }
  const head = ["Nombre", "Fecha", "Comprensión %", "Correctas", "Total", "Nivel", "Atención (s)"];
  const lines = roster.map(r => [r.nombre, r.fecha, r.pct, r.correct, r.total, r.level, r.attention]
    .map(v => `"${String(v).replace(/"/g, '""')}"`).join(","));
  const csv = head.join(",") + "\n" + lines.join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "profundiza_resultados.csv";
  a.click();
  URL.revokeObjectURL(a.href);
  showToast("CSV descargado 📄");
}

/* ---------- pitch ---------- */
function openPitch() {
  ["onboarding", "feed", "results", "teacher"].forEach(id => $(id).classList.add("hidden"));
  $("pitch").classList.remove("hidden");
  animatePitchNums();
}
function closePitch() {
  $("pitch").classList.add("hidden");
  $("onboarding").classList.remove("hidden");
}
function animatePitchNums() {
  document.querySelectorAll(".pnum[data-n]").forEach(el => {
    const target = +el.dataset.n;
    const dur = 1200;
    const t0 = performance.now();
    function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ---------- init ---------- */
load();
renderInterests();
updateStats();
if (state.studentName) $("studentName").value = state.studentName;
