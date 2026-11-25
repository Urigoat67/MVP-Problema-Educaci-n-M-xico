# Aula de Retos — Ficha técnica

**UniconHub Hack · Fase 1 | Versión 0.2 | 25 de noviembre de 2026**

## 1. Solución y alcance

Aula de Retos es una plataforma web educativa para primaria y secundaria que fortalece la comprensión, el razonamiento y la resolución de problemas mediante retos multidisciplinarios vinculados con los contenidos de la SEP.

El docente prepara actividades y analiza las propuestas de los alumnos; el estudiante explica sus datos, operaciones y conclusiones, revisa el prompt construido a partir de su razonamiento y recibe retroalimentación de IA, con acompañamiento docente o familiar. Dirección consulta indicadores históricos para identificar necesidades y definir estrategias de apoyo. El objetivo es enseñar a pensar y a utilizar la IA de manera crítica, no sustituir el esfuerzo del estudiante ni la evaluación docente.

**Estado actual:** prototipo navegable con tres portales, acceso simulado, datos ficticios y estado local. Cuenta con evaluación asistida mediante OpenAI y respuestas de demostración cuando no se configura la clave. La integración persistente, la generación automatizada de retos y el análisis histórico real están pendientes.

## 2. Viabilidad en el contexto mexicano

Según la SEP, en el ciclo 2024–2025 la población escolar objetivo era de aproximadamente 19.1 millones de alumnos:

| Nivel | Alumnos | Escuelas públicas | Escuelas privadas |
| --- | ---: | ---: | ---: |
| Primaria | 12,838,201 | 87,119 | 9,148 |
| Secundaria | 6,293,530 | 37,229 | 5,746 |
| Total | 19,131,731 | 124,348 | 14,894 |

En PISA 2025, solo el 30 % de los estudiantes mexicanos de 15 años alcanzó el nivel mínimo de competencia en matemáticas y el 50 % en lectura. La SEP reportó que el 42.7 % de las escuelas públicas de educación básica tenía internet en 2025–2026. Este último porcentaje incluye preescolar y no demuestra disponibilidad de equipos, calidad de conexión ni cobertura efectiva del producto.

Por ello se propone iniciar en escuelas con electricidad, internet y dispositivos disponibles, reutilizando aulas de cómputo, equipos compartidos y horarios escalonados. La plataforma será ligera, en español, accesible desde navegadores y sin exigir teléfonos personales, conexión en casa ni suscripciones individuales de IA. En etapas posteriores se incorporarán borradores sin conexión, sincronización diferida y actividades imprimibles. La evaluación de IA en tiempo real requerirá internet.

## 3. Stack tecnológico

| Capa | Tecnología | Estado / justificación |
| --- | --- | --- |
| Interfaz | Next.js 16.4.6, React 19.3.1, TypeScript 5.9 | Actual. Aplicación web adaptable; un código base para los tres portales. |
| Servidor | Node.js ≥20.9, Next.js Route Handlers | Actual para la evaluación; API escolar pendiente. Permite evolucionar sin separar servicios prematuramente. |
| Inteligencia artificial | API de OpenAI, `POST /api/evaluar` | Integración declarada en el prototipo. Inferencia remota, sin GPU local; clave en servidor y consumo controlado por actividad. |
| Persistencia | PostgreSQL administrado | Propuesto. Historial, rúbricas, entregas y relaciones entre escuelas, grupos y usuarios. |
| Infraestructura | Docker, nube administrada o VPS, HTTPS | Propuesto. Despliegue centralizado, respaldo y monitoreo; sin servidores por plantel. |
| Acceso y baja conectividad | Autenticación por roles, PWA, IndexedDB | Propuesto por fases. Separación de datos por plantel y borradores locales para sincronizar al recuperar conexión. |

La arquitectura propuesta es un monolito modular con base de datos compartida y aislamiento lógico por plantel. Los indicadores oficiales se calculan a partir de registros verificables; la IA sugiere retroalimentación, no decide calificaciones finales ni apoyos escolares.

## 4. Implementación por fases

| Fase | Alcance y resultado |
| --- | --- |
| 0 · Hackatón | Prototipo con los tres perfiles y demostración del flujo de evaluación y construcción de prompts. |
| 1 · MVP escolar | Autenticación, base de datos, separación por plantel y flujo completo de publicación, entrega individual, evaluación docente e indicadores reales. |
| 2 · Piloto | 3 escuelas y 180 alumnos (meta propuesta). Validar el uso de un equipo por aula, sesiones colectivas y acceso individual escalonado, conectividad, costo, calidad de la retroalimentación y avance en habilidades. |
| 3 · Expansión | Trabajo por equipos, generación de retos revisados por docentes, prácticas con tutor, análisis agregado, acceso con conectividad intermitente y escalamiento gradual. |

## 5. Alternativas de infraestructura e inversión estimada

### 5.1. Escenario de referencia

Escuela de 10 salones, 30 estudiantes por salón (300 alumnos) y 10 docentes. Se plantea una computadora y un proyector por salón, conexión a internet y acceso desde un navegador actualizado. En la primera etapa, el docente proyecta retos, facilita la discusión y registra propuestas por equipo o de forma escalonada. Para entregas individuales, práctica con tutor y seguimiento personalizado se aprovechan equipos compartidos, aulas de cómputo o turnos adicionales cuando estén disponibles. Una computadora por aula no equivale a 30 accesos individuales simultáneos.

### 5.2. Tres alternativas de alojamiento en la nube

Las tres alternativas conservan la interfaz web y PostgreSQL como base de datos, con IA mediante API externa. Se propone una infraestructura centralizada que pueda atender varios planteles con aislamiento lógico de datos, evitando un servidor por escuela. Las capacidades iniciales deberán comprobarse con pruebas de carga.

| Alternativa | Arquitectura y capacidad inicial | Infraestructura mensual (MXN) | IA mensual (MXN) | Total mensual (MXN) |
| --- | --- | ---: | ---: | ---: |
| A · Nube administrada, Node.js | Next.js + Node.js, servicio web Render de 1 vCPU/2 GB y PostgreSQL administrado de 1 GB RAM con 10 GB de almacenamiento | $1,000–$1,200 | $100–$200 | **$1,100–$1,400** |
| B · Nube administrada, Python | Next.js + Node.js para interfaz, FastAPI (Python) como servicio adicional de 512 MB–2 GB RAM y PostgreSQL administrado | $1,150–$1,700 | $100–$200 | **$1,250–$1,900** |
| C · Servidor virtual (VPS) | DigitalOcean Droplet Linux, 2 vCPU/4 GB RAM y disco SSD; Docker, Next.js/Node.js, PostgreSQL, HTTPS y respaldos externos | $700–$900 | $100–$200 | **$800–$1,100** |

| Alternativa | Ventajas | Consideraciones |
| --- | --- | --- |
| A | Reutiliza el stack actual; despliegue sencillo; base de datos administrada; menor carga operativa. | Mayor costo directo que un VPS; escalamiento y recursos adicionales se facturan según consumo. |
| B | Facilita análisis de datos, procesamiento curricular y futuras herramientas de IA mediante el ecosistema Python. | Dos servicios que mantener y supervisar; no es indispensable para el MVP ni reduce por sí mismo el costo de IA. |
| C | Menor costo directo; control del entorno; posibilidad de reutilizar contenedores y migrar posteriormente. | Requiere administración Linux, parches, monitoreo, respaldos probados y recuperación ante fallos; un único servidor es un punto de falla. |

**Base de cálculo:** tipo de cambio presupuestario de $20 MXN/USD (no cotización vigente). Render: servicio Node.js de USD 25/mes, PostgreSQL de USD 19/mes más 10 GB a USD 0.30/GB; Python agrega USD 7–25/mes. VPS: USD 24/mes, respaldo semanal del servidor al 20 % y reserva de USD 5/mes para almacenamiento externo de copias de la base de datos. Los rangos incluyen margen para dominio, monitoreo básico y variaciones menores de consumo. Se requiere una persona responsable de la operación técnica; si se contrata administración externa se debe presupuestar por separado.

**Consumo de IA:** 300 alumnos × 4 evaluaciones al mes = 1,200 evaluaciones. Con una referencia de 2,000 tokens de entrada y 500 de salida por evaluación y tarifas de USD 0.40 y USD 1.60 por millón de tokens respectivamente, el consumo base sería de USD 1.92 (aprox. $38 MXN). Se asigna una reserva de $100–$200 mensuales para generación de retos, reintentos y análisis asistido. El modelo definitivo, límites de uso y calidad se validarán en el piloto.

### 5.3. Equipamiento escolar: inversión inicial

| Recurso | Cantidad | Costo unitario estimado (MXN) | Total (MXN) |
| --- | ---: | ---: | ---: |
| Computadora básica, 8 GB RAM y SSD de 256 GB | 10 | $7,000–$10,000 | $70,000–$100,000 |
| Proyector para aula, aprox. 3,000–3,500 lúmenes ANSI o equivalentes | 10 | $10,000–$14,000 | $100,000–$140,000 |
| Cableado, accesorios y montaje básico | 10 | $800–$1,500 | $8,000–$15,000 |
| Configuración, incorporación y capacitación docente | 1 plantel | $3,000–$6,000 | $3,000–$6,000 |
| **Total para 10 salones sin equipo** | | | **$181,000–$261,000** |

Si el plantel ya dispone de computadoras, proyectores y conectividad, la inversión inicial se limita a la incorporación y capacitación estimadas en **$3,000–$6,000**. Una modalidad gradual con una computadora y un proyector compartidos entre los diez salones, más accesorios y capacitación, tendría una inversión inicial estimada de **$20,800–$31,500**. Puede reducirse todavía más reutilizando pantallas, equipos disponibles o donados.

### 5.4. Costo total para una escuela de diez salones

| Alternativa | Operación mensual | Operación anual (12 meses) | Primer año con equipo existente | Primer año equipando 10 aulas |
| --- | ---: | ---: | ---: | ---: |
| A · Node.js administrado | $1,100–$1,400 | $13,200–$16,800 | $16,200–$22,800 | $194,200–$277,800 |
| B · Python administrado | $1,250–$1,900 | $15,000–$22,800 | $18,000–$28,800 | $196,000–$283,800 |
| C · VPS | $800–$1,100 | $9,600–$13,200 | $12,600–$19,200 | $190,600–$274,200 |

Con VPS y un solo conjunto de equipo compartido, el primer año se estima en $30,400–$44,700. Con equipos existentes, el costo directo recurrente de VPS equivale aproximadamente a $2.67–$3.67 por alumno al mes para 300 alumnos. Si varias escuelas comparten infraestructura, se distribuye el costo fijo según la carga real, mientras que la IA crece con el uso; no se presupone capacidad ilimitada.

Montos de planeación en MXN, no cotizaciones; servicios de nube antes de impuestos aplicables y equipamiento con precios de referencia al público. Los totales suponen internet y electricidad disponibles. Si hace falta contratar internet, reservar preliminarmente $600–$1,000/mes adicionales por plantel ($7,200–$12,000/año), sujeto a cobertura, velocidad y proveedor; también deben revisarse red interna, instalaciones eléctricas, consumo de energía y mantenimiento de equipos. No se requiere GPU ni servidor físico en cada escuela.

### 5.5. Estrategia de menor costo

Se recomienda comenzar con la alternativa C cuando exista capacidad de administración técnica centralizada; de otro modo, la alternativa A reduce el riesgo operativo. La alternativa B puede incorporarse por módulos cuando el análisis educativo requiera herramientas específicas de Python. No se recomienda adquirir servidores físicos por plantel en la primera etapa: requieren electricidad continua, seguridad, respaldo y mantenimiento local, y la IA externa seguiría necesitando internet.

El mayor gasto en escuelas sin infraestructura es el equipamiento, no el alojamiento. Por ello, la adopción comenzará en planteles equipados y se ampliará por fases mediante reutilización de dispositivos, equipamiento compartido y alianzas para atender las brechas de conectividad.

## 6. Condiciones para llevarlo a producción

- Validación pedagógica de contenidos y rúbricas por docentes; capacitación y acompañamiento de los planteles.
- Protección de datos de menores: avisos y autorizaciones aplicables, acceso por rol y plantel, minimización de datos enviados a IA, cifrado, retención definida y supervisión humana. Las barreras socioeconómicas no se usan para calificar ni clasificar alumnos.
- Validación del piloto: participación, mejora en criterios comparables de comprensión y razonamiento, concordancia entre retroalimentación de IA y evaluación docente, disponibilidad y costo por alumno activo. El impacto educativo todavía no está demostrado.

**Conclusión:** no se requiere una inversión masiva en hardware para comenzar en planteles equipados. Aula de Retos puede crecer de manera incremental y concentrar la inversión donde existan brechas, sin condicionar el aprendizaje a que todos los estudiantes tengan dispositivos propios. Su diferenciador es enseñar a formular, cuestionar y mejorar el razonamiento con IA, conectando el aprendizaje del alumno con el trabajo docente y las decisiones escolares.

## Fuentes y referencias

- [SEP — Principales Cifras del Sistema Educativo Nacional 2024–2025, pp. 26 y 30](https://planeacion.sep.gob.mx/Doc/estadistica_e_indicadores/principales_cifras/principales_cifras_2024_2025_bolsillo.pdf).
- [SEP — Boletín 370, conectividad escolar, ciclo 2025–2026](https://www.gob.mx/sep/prensa/boletin-370-sobre-la-informacion-publicada-este-domingo-en-el-diario-el-universal-titulada-escuelas-sin-internet-o-computadoras?idiom=es).
- [OCDE — PISA 2025, nota de México](https://www.oecd.org/en/publications/pisa-2025-results-volume-i-country-notes_2d4ff9ea-en/mexico_85702d30-en.html).
- [INEGI — ENDUTIH 2025](https://www.inegi.org.mx/programas/endutih/2025/default.html), contexto de acceso a TIC en hogares.
- [Repositorio de Aula de Retos](https://github.com/Urigoat67/MVP-Problema-Educaci-n-M-xico), [package.json](https://github.com/Urigoat67/MVP-Problema-Educaci-n-M-xico/blob/main/package.json) y [especificación técnica actualizada](https://github.com/Urigoat67/MVP-Problema-Educaci-n-M-xico/blob/main/aula-de-retos-especificacion-tecnica.txt).

### Referencias de costos tecnológicos y equipamiento

- [Render — Precios de servicios web y PostgreSQL](https://render.com/pricing).
- [DigitalOcean — Precios de Droplets](https://www.digitalocean.com/pricing/droplets), [respaldos](https://docs.digitalocean.com/products/backups/details/pricing/) y [precios generales](https://www.digitalocean.com/pricing).
- [OpenAI — Precios de referencia GPT-4.1 mini](https://developers.openai.com/api/docs/models/gpt-4.1-mini). El modelo es una referencia de cálculo, no una selección definitiva.
- [Cyberpuerta — Laptops económicas](https://www.cyberpuerta.mx/laptops-economicas/), referencia de equipos de oficina con 8 GB de RAM y SSD.
- [Epson México — PowerLite E20 para aulas](https://www.tiendaepson.com.mx/proyectores/oficina/epson-powerlite-e20-portable-projector), referencia de proyección educativa (precio listado de $13,999, disponibilidad por confirmar).
