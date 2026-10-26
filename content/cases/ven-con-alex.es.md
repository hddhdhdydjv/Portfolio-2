---
uid: ven-con-alex
title: Ven con Alex
sidebar_heading: Una de esas cosas digitales
order: 0
featured: true
role: Product Designer (UX/UI) y responsable del design system
problem: Ven con Alex gana dinero solo si el cliente califica, firma y sigue pagando durante dos años. Cuando un cliente tiene un problema personal o de dinero, lo primero que deja de pagar es el auto. El riesgo real no era la adquisición, era la retención.
results:
  - En producción
  - Funnel de preaprobación, cita y documentos lanzado
  - Portal de clientes para pagos, documentos, servicios y emergencias
  - Producto bilingüe en inglés y español mexicano
meta_description: Financiamiento de autos para inmigrantes sin historial crediticio en EE.UU. — de una página de pre-lanzamiento a un funnel completo y un portal de clientes, en producción.
---

Diseñé el producto de Ven con Alex, una financiera de autos en San Antonio, Texas, que ayuda a inmigrantes sin historial crediticio en EE.UU. a tener un auto propio en dos años. El trabajo fue desde una página de pre-lanzamiento hasta un funnel completo (preaprobación, cita, documentos) y un portal de clientes para pagos, documentos del auto, servicios y emergencias. Está en producción.

| Proyecto | |
| --- | --- |
| Equipo | Fundadores, PM, equipo de ingeniería y una segunda diseñadora que se sumó en la fase final |
| Marca | Hecha por otra diseñadora; yo la apliqué al producto |
| Plataforma | Web app responsive (mobile-first), en inglés y español mexicano |
| Alcance | Sitio de pre-lanzamiento, Módulo 1 (adquisición), Módulo 2 (portal de clientes) |
| Fuera de alcance | Admin interno para asesores de venta (lo construyó ingeniería por separado) |

## El disparador

El brief llegó como un pedido de negocio: "armar algo simple para captar clientes, más un CRM". Los fundadores habían tenido una empresa de alquiler de autos en Ciudad de México, la vendieron y querían traer a Texas un modelo de financiamiento que habían visto funcionar en EE.UU.

El modelo: Ven con Alex entrega un auto seminuevo con seguro incluido, el cliente paga cada dos semanas y a los dos años el auto es suyo. Sin consulta al buró de crédito. Detrás del producto, asesores de venta califican a cada solicitante y le piden los documentos que faltan.

El plan inicial era un roadmap de 20 semanas por módulos: captación de leads con scoring por IA, una web app para clientes, un admin para empleados y, más adelante, un chatbot y procesamiento de documentos.

## Replantear el problema

Un formulario de leads resuelve la primera semana del negocio, no el negocio. Ven con Alex gana dinero solo si el cliente califica, firma y sigue pagando durante dos años, así que replanteé el problema alrededor de esa relación completa.

Los fundadores me dijeron algo que cambió el brief: cuando un cliente tiene un problema personal o de dinero, lo primero que deja de pagar es el auto. El riesgo real no era la adquisición, era la retención.

> **¿Cómo podríamos** lograr que personas que esperan ser rechazadas o engañadas califiquen rápido, y mantener después de la venta la confianza y la comodidad suficientes para que sigan pagando dos años?

Eso convirtió un problema en tres objetivos de producto:

1. **Calificar rápido sin espantar.** Pocas preguntas al principio, el resto después del compromiso.
2. **Ganar confianza desde la primera pantalla.** Cercano, humano, nunca burocrático.
3. **Hacer fácil tener el auto después de la venta.** Pagos, documentos, servicios y emergencias en un solo lugar, para que un problema con el auto no se convierta en un pago perdido.

## Discover: realidad del negocio vs. realidad del usuario

No tuve acceso directo a usuarios finales, así que armé la imagen del usuario con cuatro fuentes y contrasté contra ellas los supuestos del negocio.

| Fuente | Qué hice | Qué me dio |
| --- | --- | --- |
| Workshops con los fundadores | Un set de preguntas estructurado sobre negocio, usuarios, captación, scoring, UX interna, seguridad y métricas | Objetivos, reglas de elegibilidad, cómo trabajan los asesores, qué es un "buen lead" |
| Benchmark y desk research | Revisé flujos de financiamiento y compra de autos | Patrones de formularios por pasos, carga de documentos, seguimiento de pagos |
| Investigación asistida con IA | Sinteticé lo que se sabe sobre el acceso al crédito y al auto de inmigrantes hispanos en EE.UU. | Contexto que los fundadores daban por sentado |
| Observación en campo | En viajes a EE.UU., estudié publicidad en TV y carteles en autopistas dirigidos a esta audiencia | Cómo se le habla a esta audiencia: tono, mezcla de idiomas, promesas que funcionan |

Lo que traía el negocio: los usuarios son mexicanos en el sur de EE.UU., muchos sin historial crediticio, que necesitan un auto pronto y no tienen paciencia para formularios largos.

Lo que sumó la investigación: esta persona está acostumbrada a que la miren desde arriba, trabaja muchas horas por poco dinero y espera letra chica. Quiere a alguien cercano que la entienda, no "alguien de traje".

**Lo que no pude evaluar:** entrevistas o pruebas de usabilidad con solicitantes reales. Traté el conocimiento de los fundadores como hipótesis, no como hechos, y diseñé los flujos para poder medirlos una vez en producción.

## Define: insights y espacio de solución

Cuatro insights definieron dónde trabajar:

| Insight | Entonces el producto tenía que… |
| --- | --- |
| Esperan rechazo y trampas ocultas | Decir sí o no temprano, y convertir un "no" en una conversación |
| Su vida pasa por el celular y WhatsApp | Ser mobile-first, con WhatsApp como canal humano |
| Poca paciencia para formularios, pero el compromiso crece cuando hay un auto a la vista | Pedir lo mínimo para preaprobar y pedir documentos después de agendar la cita |
| El auto es una herramienta de trabajo y el dinero es justo | Mantener el auto andando y los pagos simples después de la venta |

**Espacio de solución elegido:** una web app responsive, no una app nativa. No hay que instalar nada y un link viaja bien por WhatsApp. La lancé en tres etapas para que el negocio aprendiera antes de construir más:

1. **Pre-lanzamiento:** una página "próximamente en San Antonio" que juntaba emails early-bird.
2. **Módulo 1, adquisición:** landing, inventario, preaprobación, agenda de citas, carga de documentos.
3. **Módulo 2, propiedad:** registro para preaprobados, primer pago, historial de pagos, documentos del auto, servicios, incidentes, notificaciones, firma de contrato, soporte.

La IA entró por WhatsApp. La preaprobación hacía una primera calificación con preguntas y respuestas; después, un agente de IA integrado en WhatsApp seguía la conversación: respondía dudas, guiaba al usuario y entendía su caso particular, mientras otra IA precalificaba los leads por detrás. El scoring a cargo de agentes autónomos quedó para una etapa siguiente.

## Develop: diseñar para este contexto

A mitad de camino, los fundadores reabrieron el alcance: deudas e historial de pagos, historial de dueños de cada auto, avisos de cobranza, verificaciones a domicilio. Cada pedido nuevo pasó por una sola pregunta: ¿ayuda a esta persona a quedarse con el auto y seguir pagando? Estas son las decisiones en las que el contexto del usuario cambió el diseño.

| Contexto | Decisión |
| --- | --- |
| Espera que lo rechacen | Preaprobación en dos pasos cortos (datos básicos, rango de pago inicial) con respuesta en el momento |
| Un "no" confirma su miedo | La pantalla de rechazo explica por qué (código postal todavía sin cobertura, menor de 21) y ofrece "Get in touch via WhatsApp" |
| El compromiso crece con la cita agendada | Los documentos se piden *después* de la cita: "Do you have 2 more minutes?" |
| El celular es la computadora, WhatsApp es la bandeja de entrada | La confirmación y los recordatorios llegan por WhatsApp; la identificación y el comprobante de domicilio se fotografían con el celular |
| El teléfono es más estable que el email | El registro y el login usan el teléfono de la preaprobación |
| Presupuesta por sueldo, no por precio total | Los autos muestran primero el pago inicial "Drive Out", no el precio de lista |
| Muchos pagan en efectivo o por depósito | "Hacer un pago": transferencia o depósito y foto del comprobante; el estado muestra "en proceso" |
| El papeleo es donde los agarran | "Tu guantera en la mano": seguro, patentes, contrato y garantía, con avisos de "Actualización necesaria" |
| Auto roto es no trabajar, y después no pagar | Servicios divididos en preventivo y correctivo; si el auto no anda, se sugieren grúas |
| Un accidente es un momento de pánico | Un formulario corto de incidente y un recordatorio de llamar al seguro |
| Bilingües, español mexicano en casa | Versiones completas en inglés y español mexicano con selector de idioma |
| Quiere una persona, no una institución | Los textos hablan como Alex ("Tell Alex a little about yourself"), un video de Alex en la landing, nombres de pila en todo |
| Muchos no califican solos por falta de documentación, pero un familiar o conocido sí | Se acepta un co-firmante con ID de Texas, y el agente de WhatsApp explora cada caso: quién presenta la documentación y qué plan de pagos le sirve |

## Deliver: prototipo, sistema y handoff

Armé un design system y un único archivo de handoff organizado como lo iba a construir ingeniería: por módulo y después por breakpoint (mobile, tablet, desktop), con cada flujo de izquierda a derecha, incluidos estados vacíos, de error y casos borde.

- **Design system:** componentes y patrones compartidos entre la landing, el funnel y el portal, para que la segunda diseñadora pudiera sumarse tarde y seguir las mismas reglas.
- **Casos borde como pantallas propias:** "preaprobado sin cita", "con cita pero sin auto elegido", "registrado sin plan activo". Cada uno tiene su propia home.
- **Anotaciones en el archivo** para el comportamiento que no se ve en una pantalla estática (por ejemplo: cuando el usuario ya está preaprobado, "Get pre-approved" pasa a "Buy" y lleva directo a la carga de documentos).
- **Pruebas en dispositivos:** la confirmación de cita se exploró en pantallas chicas (iPhone SE, iPhone 13 mini) porque la audiencia suele usar teléfonos más viejos o más chicos.

**Validación.** No hubo pruebas formales con usuarios antes del lanzamiento. Lo que armaría en un proyecto así, y lo que recomiendo como próximo paso:

1. Cinco sesiones remotas de think-aloud en español con personas que encajen en el perfil, sobre los flujos de preaprobación y primer pago.
2. Un test de concepto rápido de la pantalla de rechazo: ¿se siente como una puerta cerrada o como un próximo paso?
3. Analítica del funnel desde el día uno, para que las primeras semanas en producción funcionen como la prueba.

## Resultado y cómo medirlo

El producto está en producción: el funnel de adquisición y el portal de clientes. Todavía no hay métricas, así que esto es cómo probaría que el problema cambió, atado a los tres objetivos.

| Objetivo | Métrica | Qué demuestra |
| --- | --- | --- |
| Calificar rápido | Tasa de finalización de la preaprobación y tiempo medio para completarla | Que el flujo corto no espanta |
| Calificar rápido | Porcentaje de preaprobados que suben documentos después de agendar | Que postergar los documentos funciona |
| Ganar confianza | Rechazados que tocan WhatsApp | Que un "no" sigue siendo una conversación |
| Ganar confianza | Tasa de asistencia a la cita | Que la confirmación por WhatsApp genera compromiso |
| Propiedad fácil | Tasa de pagos a tiempo en los primeros 6 meses | Que el portal sostiene la relación de 2 años |
| Propiedad fácil | Pedidos de servicio e incidentes resueltos en el portal vs. por teléfono | Que los problemas con el auto no se vuelven pagos perdidos |

Las métricas que proponían los fundadores eran leads por semana, leads contactados y leads convertidos; la tabla las extiende a la relación después de la venta.

## Colaboración

Trabajé con los fundadores en qué construir, con el PM en cuándo y con ingeniería en cómo. Esto es quién participó en cada etapa y dónde los sumaría antes la próxima vez.

| Etapa | Quién | Qué decidimos juntos | Idealmente |
| --- | --- | --- | --- |
| Discover | Fundadores | Modelo de negocio, reglas de elegibilidad, quién es el cliente | Sumar 3 a 5 llamadas con clientes reales de la red de los fundadores |
| Define | Fundadores, PM | División en módulos y orden de lanzamiento, qué quedaba para después | Ingeniería y diseño juntos para definir cómo calificarían los agentes de IA y cómo medirlos |
| Develop | PM, ingeniería | Patrones de la plataforma, qué necesita el admin de cada pantalla | Una revisión compartida por sprint con el equipo que construía el admin |
| Deliver | Ingeniería, segunda diseñadora | Handoff, casos borde, reglas del design system | Sesiones de QA en dispositivos reales antes de cada lanzamiento |
| Después del lanzamiento | Fundadores, PM | — | Una revisión de métricas a los 30 días del lanzamiento |

## Reflexión

La mayor palanca fue replantear el brief: de captar leads a sostener una relación de dos años. Por eso existe el portal.

Qué haría distinto:

- **Hablar con usuarios antes de la primera pantalla,** aunque sea de manera informal. Todos los insights de usuario acá llegaron de segunda mano.
- **Medir desde el primer día.** Antes de lanzar, dejar definido qué contar: cuántas personas empiezan la preaprobación, cuántas la terminan y cuántas pagan a tiempo. Sin esos números, hoy no puedo mostrar con datos que el diseño funcionó.
- **Diseñar el panel de los agentes de IA.** La plataforma la iban a operar personas y agentes de IA. Me hubiera gustado participar en el panel para configurar las instrucciones de cada agente y medir si funcionaban bien: si calificaban correctamente a los leads, si hacían las preguntas correctas y si llevaban la conversación hacia un dato útil. Lo que ve el cliente depende de lo que pasa de ese lado.

El proyecto se hizo antes del boom de la IA, pero ya la veníamos considerando. Muchas ideas quedaron para más adelante con las bases sentadas: planes de pago personalizados, que un familiar presente la documentación y agentes que acompañen cada caso.
