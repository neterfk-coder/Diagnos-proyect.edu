const es = {
  codigo: "es",
  nombre: "Español",

  nav: {
    lema: "tutor de razonamiento",
    analizar: "Analizar ejercicio",
    tutor: "Tutor de estudio",
    docente: "Panel docente",
    entrar: "Entrar",
    invitado: "Invitado",
    modoInvitado: "Modo invitado",
    sinHistorial: "Sin historial guardado",
    crearCuenta: "Crear una cuenta gratis",
    salirInvitado: "Salir del modo invitado",
    cerrarSesion: "Cerrar sesión",
    idioma: "Idioma",
    roles: { estudiante: "Estudiante", docente: "Docente" },
  },

  pie: {
    lema: "No corrige tu respuesta. Corrige tu razonamiento.",
    descripcion:
      "Un tutor con IA que encuentra el paso exacto donde se rompió el razonamiento del estudiante, nombra la concepción errónea que hay detrás y lo guía hasta que la descubre por sí mismo.",
    evento: "Prometheus July AI Challenge · 2026",
    derechos: "Todos los derechos reservados.",
    hecho: "Hecho con Next.js, Groq y Appwrite",
    estado: "Todos los sistemas operativos",

    producto: {
      titulo: "Producto",
      enlaces: [
        { href: "/analizar", texto: "Analizar un ejercicio" },
        { href: "/tutor", texto: "Tutor de estudio (PDF)" },
        { href: "/docente", texto: "Panel docente" },
        { href: "/#metodo", texto: "Cómo funciona" },
        { href: "/ayuda#catalogo", texto: "Catálogo de concepciones" },
      ],
    },
    cuenta: {
      titulo: "Cuenta",
      enlaces: [
        { href: "/entrar", texto: "Iniciar sesión" },
        { href: "/registro", texto: "Crear una cuenta" },
        { href: "/perfil", texto: "Mi perfil" },
        { href: "/analizar", texto: "Continuar como invitado" },
      ],
    },
    soporte: {
      titulo: "Soporte",
      enlaces: [
        { href: "/ayuda", texto: "Centro de ayuda" },
        { href: "/ayuda#faq", texto: "Preguntas frecuentes" },
        { href: "/contacto", texto: "Contacto" },
        { href: "/contacto#problema", texto: "Reportar un problema" },
      ],
    },
    legal: {
      titulo: "Legal",
      enlaces: [
        { href: "/terminos", texto: "Condiciones de uso" },
        { href: "/privacidad", texto: "Política de privacidad" },
        { href: "/terminos#cookies", texto: "Política de cookies" },
        { href: "/ayuda#accesibilidad", texto: "Accesibilidad" },
      ],
    },
    barraLegal: [
      { href: "/terminos", texto: "Condiciones" },
      { href: "/privacidad", texto: "Privacidad" },
      { href: "/terminos#cookies", texto: "Cookies" },
      { href: "/ayuda#accesibilidad", texto: "Accesibilidad" },
    ],
  },

  inicio: {
    etiqueta: "Tutor de razonamiento con IA · Álgebra",
    titulo1: "No corrige tu respuesta.",
    titulo2: "Corrige tu razonamiento.",
    entrada:
      "Cuando fallas un ejercicio, las apps te dicen «incorrecto». Diagnos te dice",
    entradaEnfasis: "por qué pensaste así",
    entradaFin:
      ", en qué paso exacto, y te guía con preguntas hasta que tú mismo descubres el error.",
    ctaAnalizar: "Analizar mi ejercicio",
    ctaDocente: "Soy docente",
    notaCta: "Funciona con lápiz, papel y una foto. Pensado para aulas reales.",

    tarjetaEtiqueta: "Diagnóstico en vivo",
    tarjetaPagina: "cuaderno · pág. 12",
    tarjetaMisconception: "Concepción errónea · SIG-01",
    tarjetaExplicacion:
      "Al pasar el 5 al otro lado, asumiste que conserva su signo. ¿Qué le hiciste a la izquierda que no le hiciste a la derecha?",

    problemaEtiqueta: "El problema",
    problemaTitulo: "«Incorrecto, la respuesta era 5» no enseña nada.",
    problemaTexto1: "Detrás de cada error repetido hay una",
    problemaEnfasis: "concepción errónea",
    problemaTexto2:
      ": una regla falsa que el estudiante cree verdadera. Un docente con treinta y cinco alumnos no puede diagnosticarla cuaderno por cuaderno. Diagnos sí — y sin quitarle al estudiante el gusto de descubrirla.",

    metodoEtiqueta: "El método",
    metodoTitulo: "Cuatro pasos, cero respuestas regaladas",
    metodo: [
      {
        titulo: "Muestra tu procedimiento",
        detalle:
          "Una foto de tu cuaderno basta. Diagnos lee tu escritura a mano y reconstruye cada paso tal como lo pensaste.",
      },
      {
        titulo: "Encuentra el paso roto",
        detalle:
          "No revisa tu respuesta final: recorre tu razonamiento y localiza el punto exacto donde la lógica se quebró.",
      },
      {
        titulo: "Nombra tu concepción errónea",
        detalle:
          "Clasifica el error contra un catálogo pedagógico real. No es un símbolo mal escrito: es una idea que hay que corregir.",
      },
      {
        titulo: "Te guía hasta que lo descubres",
        detalle:
          "Nunca te da la solución. Un diálogo de preguntas te lleva a enunciar tu propio error, y luego practicas contra él.",
      },
    ],

    catalogoEtiqueta: "Rigor pedagógico",
    catalogoTitulo:
      "Un catálogo real de concepciones erróneas, no etiquetas inventadas",
    catalogoTexto:
      "Cada diagnóstico se clasifica contra una taxonomía de errores algebraicos documentada en la investigación educativa. Eso permite medir, comparar y — sobre todo — re-enseñar con precisión.",

    docenteEtiqueta: "Para docentes",
    docenteTitulo: "El mapa de calor de tu aula, cuaderno por cuaderno",
    docenteTexto:
      "Cada diagnóstico anónimo alimenta un panel que muestra qué concepciones erróneas dominan en tu clase esta semana. Deja de adivinar qué re-enseñar el lunes: míralo.",
    docenteCta: "Ver el panel docente",
    docenteDemoEtiqueta: "Aula demo · esta semana",

    cierreTitulo1: "El mejor momento para aprender",
    cierreTitulo2: "es justo después de equivocarse.",
    cierreCta: "Empezar ahora — es gratis",
  },

  analizar: {
    etiqueta: "Analizar ejercicio",
    titulo: "Equivócate con confianza",
    entrada:
      "Aquí un error no es una nota roja: es el punto de partida. Sube tu procedimiento y averigüemos juntos qué idea hay que ajustar.",
    paso2: "Paso 2 · Diagnóstico",
    tituloCorrecto: "Tu razonamiento es impecable",
    tituloError: "Encontré dónde se rompió",
    misconception: "Concepción errónea",
    esperandoTitulo: "El diálogo aparecerá aquí",
    esperandoTexto:
      "Después del diagnóstico, el tutor te hará preguntas — nunca te dará la respuesta.",
    errorTitulo: "Algo salió mal",
    errorGenerico: "Ocurrió un error al diagnosticar.",
    errorLento:
      "El modelo está tardando demasiado y se canceló la petición. Suele ser saturación puntual: vuelve a intentarlo, o escribe tus pasos en vez de subir la foto.",
  },

  zonaCarga: {
    paso1: "Paso 1 · Tu procedimiento",
    titulo: "Muéstrame cómo lo resolviste",
    entrada:
      "Sube una foto de tu cuaderno o escribe tus pasos, uno por línea. No importa si está mal: justamente de eso se trata.",
    arrastra: "Arrastra aquí la foto de tu cuaderno",
    elegir: "Elegir foto",
    quitar: "Quitar foto",
    altPrevia: "Foto del cuaderno cargada",
    separador: "o escríbelo",
    ariaTexto: "Escribe tu procedimiento paso a paso",
    enviar: "Diagnosticar mi razonamiento",
    enviando: "Leyendo tu razonamiento…",
  },

  traza: {
    aqui: "Aquí se rompió el razonamiento",
  },

  chat: {
    paso3: "Paso 3 · Diálogo socrático",
    titulo: "Descúbrelo tú — yo solo pregunto",
    pensando: "Pensando la siguiente pregunta…",
    descubierto:
      "Lo descubriste por tu cuenta. Ahora, a afianzarlo con práctica dirigida ↓",
    completado: "Diálogo completado",
    marcador: "Escribe tu respuesta…",
    ariaEntrada: "Tu respuesta al tutor",
    enviar: "Enviar",
    errorRed: "Se cortó la conexión. Escríbeme de nuevo tu idea.",
  },

  practica: {
    paso4: "Paso 4 · Práctica dirigida",
    titulo: "Tres ejercicios contra tu error, no contra el azar",
    entrada: "Generados a la medida de la concepción errónea que acabas de descubrir",
    generar: "Generar mi práctica",
    generando: "Diseñando tu práctica…",
    verPista: "Ver pista",
    ocultarPista: "Ocultar pista",
    error: "No se pudieron generar los ejercicios.",
    niveles: {
      basico: "básico",
      intermedio: "intermedio",
      desafio: "desafío",
    },
  },

  docente: {
    etiqueta: "Panel docente",
    titulo: "Qué re-enseñar el lunes",
    entrada:
      "Cada diagnóstico anónimo de tus estudiantes se agrega aquí. No son calificaciones: es un mapa de las ideas que tu aula necesita revisar.",
    cargando: "Cargando diagnósticos…",
    registrados: "Diagnósticos registrados",
    dominante: "Concepción dominante en el aula",
    mapaTitulo: "Mapa de calor de concepciones erróneas",
    envivo: "datos en vivo · Appwrite",
    demo: "datos de demostración",
    casos: "casos",
    sinClasificar: "Sin clasificar",
    sugerenciaEtiqueta: "Sugerencia para la próxima clase",
    sugerenciaTitulo1: "Abre la clase con un contraejemplo de «",
    sugerenciaTitulo2: "» y deja que el grupo lo desarme en voz alta.",
    sugerenciaTexto:
      "Las concepciones erróneas no se borran diciendo la regla correcta: se reemplazan cuando el estudiante ve que su regla produce un resultado absurdo. Diagnos hace eso uno a uno; tú puedes hacerlo con toda el aula a la vez.",
  },

  tutor: {
    etiqueta: "Tutor de estudio con IA",
    titulo: "Convierte cualquier PDF en material de estudio",
    entrada:
      "Sube un documento y obtén un resumen elaborado, los puntos clave, flashcards para ponerte a prueba y ejercicios para aplicar lo que has leído.",

    soltar: "Suelta aquí tu PDF",
    elegir: "Elegir un PDF",
    quitar: "Quitar archivo",
    limite: "PDF, hasta 12 MB",
    separador: "o pega el texto",
    marcadorTexto:
      "Pega aquí el texto que quieres estudiar — apuntes, un artículo, un capítulo…",
    ariaTexto: "Texto para estudiar",
    generar: "Crear mi material de estudio",
    generando: "Leyendo tu documento…",

    fases: [
      "Leyendo el documento…",
      "Extrayendo el texto…",
      "Buscando las ideas clave…",
      "Redactando tu material…",
    ],

    paginas: "páginas",
    caracteres: "caracteres",
    leidoEn: "leído en",
    partes: "partes",
    parteFallida: "una parte no se pudo leer",
    partesFallidas: "partes no se pudieron leer",
    recortado:
      "Documento muy largo: solo se analizó la primera parte. El resto quedó fuera.",
    otro: "Estudiar otro documento",

    pestanas: {
      resumen: "Resumen",
      puntos: "Puntos clave",
      flashcards: "Flashcards",
      ejercicios: "Ejercicios",
    },

    flashcardsAyuda: "Haz clic en una tarjeta para girarla",
    anverso: "Pregunta",
    reverso: "Respuesta",
    tarjeta: "Tarjeta",
    de: "de",
    anterior: "Anterior",
    siguiente: "Siguiente",
    girar: "Girar la tarjeta",

    verPista: "Ver pista",
    ocultarPista: "Ocultar pista",

    errorTitulo: "Eso no ha funcionado",
    errores: {
      sin_texto:
        "Casi no se pudo extraer texto. Si tu PDF es un escaneo o una foto, no tiene capa de texto — copia el texto y pégalo aquí abajo.",
      grande: "Ese PDF es demasiado grande. El límite son 12 MB.",
      ilegible: "Ese archivo no se pudo leer como PDF.",
      limite:
        "Se alcanzó el límite de tokens por minuto de Groq. Espera un minuto y vuelve a intentarlo, o usa un documento más corto.",
      vacio: "No llegó material de estudio aprovechable. Inténtalo de nuevo.",
      generico: "No se pudo generar el material de estudio. Inténtalo de nuevo.",
    },
  },

  paginas: {
    volver: "Volver al inicio",

    ayuda: {
      etiqueta: "Centro de ayuda",
      titulo: "Todo lo que necesitas para usar Diagnos",
      entrada:
        "Respuestas breves a lo que más nos preguntan. Si nada de esto lo resuelve, escríbenos y te contesta una persona.",
      empezar: {
        titulo: "Primeros pasos",
        pasos: [
          {
            titulo: "Fotografía o escribe tu procedimiento",
            texto:
              "Haz una foto de tu cuaderno, o escribe tus pasos uno por línea. La letra a mano funciona; una foto recta y bien iluminada funciona mejor.",
          },
          {
            titulo: "Lee el diagnóstico",
            texto:
              "Diagnos marca el primer paso donde se rompió el razonamiento y nombra la concepción errónea que hay detrás. Los pasos posteriores se marcan como arrastrados, no como errores nuevos.",
          },
          {
            titulo: "Responde a las preguntas",
            texto:
              "El tutor solo pregunta. No te da la respuesta, y es a propósito: la gracia está en que la enuncies tú.",
          },
        ],
      },
      faq: {
        titulo: "Preguntas frecuentes",
        preguntas: [
          {
            p: "¿Por qué no me dice directamente la respuesta correcta?",
            r: "Porque que te digan la regla no elimina una concepción errónea. Se reemplaza cuando ves que tu propia regla produce un resultado absurdo. Por eso el tutor pregunta en vez de explicar, y por eso el tercer ejercicio de práctica está diseñado para que tu propio error se contradiga solo.",
          },
          {
            p: "¿Funciona con letra a mano?",
            r: "Sí. Haz la foto de frente, con la hoja bien iluminada y sin sombras encima. Si transcribe mal un paso, reescribe ese paso a mano y vuelve a lanzarlo.",
          },
          {
            p: "¿Y si mi procedimiento está bien?",
            r: "Diagnos lo dirá y no se inventará un error. Solo abre el diálogo socrático cuando encuentra un paso roto.",
          },
          {
            p: "¿Necesito una cuenta?",
            r: "No. El modo invitado te da el diagnóstico completo, el diálogo y la práctica. Lo que pierdes es el historial: no se guarda nada entre sesiones.",
          },
          {
            p: "¿Qué ve el docente?",
            r: "Recuentos agregados y anónimos de concepciones erróneas. Sin nombres, sin notas, sin respuestas individuales. Es un mapa de qué re-enseñar, no una hoja de calificaciones.",
          },
          {
            p: "¿Qué materias cubre?",
            r: "Álgebra de primer año de secundaria, clasificada contra un catálogo de doce concepciones erróneas documentadas. Lo que quede fuera de eso, por ahora, queda fuera.",
          },
        ],
      },
      catalogo: {
        titulo: "Catálogo de concepciones erróneas",
        entrada:
          "Cada diagnóstico se clasifica contra una de estas doce entradas. Los códigos son estables, y eso es justo lo que hace posible el panel docente.",
      },
      accesibilidad: {
        titulo: "Accesibilidad",
        parrafos: [
          "Diagnos está hecho para poder usarse solo con teclado: se llega a todos los controles tabulando y todos muestran un anillo de foco visible. Los campos tienen etiqueta, los errores se anuncian a los lectores de pantalla y el diálogo socrático es una región activa, así que los mensajes nuevos del tutor se leen en voz alta.",
          "Si tienes activadas las animaciones reducidas en tu sistema, todas las animaciones del sitio se desactivan solas: no se mueve, ni se desvanece, ni se desliza nada.",
          "El color nunca es la única forma de transmitir información: el paso roto se marca con un icono y una etiqueta de texto, no solo con ámbar.",
          "Si algo te resulta inusable, dínoslo. Los problemas de accesibilidad se tratan como errores, no como peticiones.",
        ],
      },
    },

    contacto: {
      etiqueta: "Contacto",
      titulo: "Habla con una persona",
      entrada:
        "Dudas, ideas o algo que se ha roto. Lo leemos todo y lo contestamos todo.",
      canales: [
        {
          titulo: "Consultas generales",
          detalle: "Para cualquier cosa sobre el producto, su uso en el aula o colaboraciones.",
          valor: "hola@diagnos.app",
        },
        {
          titulo: "Docentes y centros",
          detalle: "Usar Diagnos con una clase entera, o con varios grupos.",
          valor: "docentes@diagnos.app",
        },
        {
          titulo: "Tiempo de respuesta",
          detalle: "Intentamos responder en un plazo de dos días laborables.",
          valor: "De lunes a viernes",
        },
      ],
      formulario: {
        titulo: "Reportar un problema",
        entrada:
          "Cuéntanos qué pasó y qué esperabas en su lugar. Si tiene que ver con un ejercicio concreto, pega los pasos.",
        nombre: "Tu nombre",
        correo: "Correo electrónico",
        asunto: "Asunto",
        mensaje: "Qué ha pasado",
        enviar: "Enviar mensaje",
        enviando: "Enviando…",
        enviado: "Mensaje enviado",
        exitoTitulo: "Gracias",
        exitoTexto:
          "Tenemos tu mensaje. Si dejaste un correo, te responderemos ahí.",
        otro: "Enviar otro mensaje",
        faltaNombre: "Dinos tu nombre.",
        faltaAsunto: "Añade un asunto.",
        faltaMensaje: "Describe qué ha pasado.",
      },
    },

    terminos: {
      etiqueta: "Legal",
      titulo: "Condiciones de uso",
      actualizado: "Última actualización: julio de 2026",
      secciones: [
        {
          titulo: "Qué es Diagnos",
          parrafos: [
            "Diagnos es una herramienta educativa que analiza el procedimiento de álgebra de un estudiante, identifica dónde se rompió el razonamiento y lo guía con preguntas. Es un apoyo al estudio, no un sustituto del docente, y no emite calificaciones ni certificados.",
            "Este es un prototipo construido para el Prometheus July AI Challenge. Se ofrece tal cual, sin garantía de disponibilidad ni de continuidad.",
          ],
        },
        {
          titulo: "Uso aceptable",
          parrafos: [
            "Usa Diagnos para aprender y para enseñar. No lo uses para entregar como propio un trabajo donde eso no esté permitido, no subas material de otras personas sin su permiso y no intentes saturar ni romper el servicio.",
            "Eres responsable de lo que subes, incluidas las fotografías de cuadernos que puedan contener la letra de otras personas.",
          ],
        },
        {
          titulo: "Exactitud",
          parrafos: [
            "El diagnóstico lo produce un modelo de IA y puede equivocarse: puede transcribir mal un paso o clasificar mal una concepción errónea. Contrasta siempre el resultado con tu propio criterio, y ten la opinión del docente como la que vale.",
          ],
        },
        {
          id: "cookies",
          titulo: "Cookies y almacenamiento local",
          parrafos: [
            "Diagnos no usa cookies de publicidad ni de seguimiento. No te perfila y no comparte datos con anunciantes.",
            "Guarda dos cosas en el almacenamiento local de tu navegador: el idioma que elegiste y el estado de tu sesión. Ambos se quedan en tu dispositivo, nunca se envían a un servidor con fines de seguimiento y desaparecen al cerrar sesión o al borrar los datos del navegador.",
          ],
        },
        {
          titulo: "Cambios",
          parrafos: [
            "Estas condiciones pueden cambiar según evolucione el producto. La fecha de arriba refleja siempre la versión vigente.",
          ],
        },
      ],
    },

    privacidad: {
      etiqueta: "Legal",
      titulo: "Política de privacidad",
      actualizado: "Última actualización: julio de 2026",
      secciones: [
        {
          titulo: "La versión corta",
          parrafos: [
            "Guardamos lo mínimo posible. No vendemos datos, no hacemos publicidad y el panel docente nunca muestra a un estudiante concreto.",
          ],
        },
        {
          titulo: "Qué guardamos",
          parrafos: [
            "Cuando un diagnóstico encuentra un error, registramos tres campos anónimos: el enunciado del ejercicio detectado, el código de la concepción errónea y el número del paso roto. Nada vincula ese registro con una persona.",
            "Tu preferencia de idioma y el estado de tu sesión viven solo en el almacenamiento local de tu navegador, nunca en nuestros servidores.",
          ],
        },
        {
          titulo: "Qué no guardamos",
          parrafos: [
            "No conservamos las fotografías de los cuadernos. La imagen se envía para analizarla, se procesa y no se escribe en ninguna base de datos nuestra.",
            "No conservamos la conversación socrática. Vive en la pestaña del navegador y desaparece al cerrarla.",
          ],
        },
        {
          titulo: "Terceros",
          parrafos: [
            "El texto y las imágenes que envías los procesa Groq, que ejecuta los modelos de IA que producen el diagnóstico. Los registros anónimos de diagnóstico se almacenan en Appwrite. Ambos actúan como encargados por cuenta nuestra.",
          ],
        },
        {
          titulo: "Menores",
          parrafos: [
            "Diagnos está pensado para estudiantes de secundaria, así que muchas personas usuarias son menores. Precisamente por eso los registros son anónimos y no hace falta ningún dato personal para usar la herramienta: el modo invitado no requiere cuenta alguna.",
          ],
        },
        {
          titulo: "Tus derechos",
          parrafos: [
            "Como los registros de diagnóstico no contienen datos identificativos, no podemos vincularlos contigo para recuperarlos ni borrarlos individualmente. Lo que sí es tuyo —idioma, sesión— puedes borrarlo tú mismo limpiando el almacenamiento del navegador. Para cualquier otra cosa, escríbenos.",
          ],
        },
      ],
    },

    perfil: {
      etiqueta: "Mi perfil",
      titulo: "Tu cuenta",
      sinSesionTitulo: "No has iniciado sesión",
      sinSesionTexto:
        "Inicia sesión para conservar tus diagnósticos, o sigue como invitado: la herramienta funciona igual.",
      invitadoTitulo: "Estás navegando como invitado",
      invitadoTexto:
        "Todo funciona, pero no se guarda nada. Crea una cuenta gratis para conservar tu historial y seguir qué concepciones erróneas ya has superado.",
      campos: {
        nombre: "Nombre",
        correo: "Correo electrónico",
        rol: "Rol",
        idioma: "Idioma de la interfaz",
      },
      preferencias: "Preferencias",
      datos: "Tus datos",
      datosTexto:
        "Tu cuenta y tu sesión las gestiona Appwrite. La preferencia de idioma se guarda solo en este navegador. Al cerrar sesión se cierra únicamente en este dispositivo.",
      salir: "Cerrar sesión",
      entrar: "Iniciar sesión",
      registro: "Crear una cuenta",
    },
  },

  acceso: {
    claims: [
      {
        titulo: "«Incorrecto» no enseña nada.",
        texto: "Diagnos encuentra el paso exacto donde tu razonamiento se rompió.",
      },
      {
        titulo: "Nunca te da la respuesta.",
        texto: "Te hace preguntas hasta que tú mismo enuncias tu propio error.",
      },
      {
        titulo: "Un mapa de tu aula entera.",
        texto:
          "Cada diagnóstico anónimo le dice al docente qué re-enseñar el lunes.",
      },
    ],
    panelEtiqueta: "Diagnóstico en vivo",
    panelPagina: "pág. 12",
    panelMisconception: "Concepción errónea · SIG-01",
    panelExplicacion:
      "Al pasar el 5 al otro lado, asumiste que conserva su signo.",
    verMensaje: "Ver mensaje",

    iniciarSesion: "Iniciar sesión",
    crearCuenta: "Crear cuenta",

    correo: "Correo electrónico",
    contrasena: "Contraseña",
    nombre: "Nombre",
    mostrarClave: "Mostrar contraseña",
    ocultarClave: "Ocultar contraseña",

    entrarTitulo: "Vuelve a tu razonamiento",
    entrarEntrada:
      "Tus diagnósticos, tus errores nombrados y tu progreso te esperan donde los dejaste.",
    recordar: "Mantener sesión abierta",
    olvidaste: "¿Olvidaste tu contraseña?",
    entrarBoton: "Entrar",
    entrarCargando: "Verificando…",
    entrarListo: "Bienvenida/o de vuelta",
    separadorEntrar: "o entra sin cuenta",
    invitadoBoton: "Continuar como invitado",
    invitadoEntrando: "Entrando…",
    invitadoNota:
      "Como invitado puedes diagnosticar ejercicios, pero no se guardará tu historial.",
    sinCuenta: "¿Aún no tienes cuenta?",
    creaUna: "Crea una gratis",

    registroTitulo: "Empieza por equivocarte",
    registroEntrada:
      "Crea tu cuenta gratis. Sin tarjeta, sin límite de ejercicios.",
    quienEres: "¿Quién eres?",
    roles: [
      { id: "estudiante", texto: "Soy estudiante", pie: "Diagnostica tus ejercicios" },
      { id: "docente", texto: "Soy docente", pie: "Ve el mapa de tu aula" },
    ],
    condiciones:
      "Acepto las condiciones de uso y la política de privacidad de Diagnos.",
    registroBoton: "Crear mi cuenta",
    registroCargando: "Creando tu cuenta…",
    registroListo: "Cuenta creada",
    separadorRegistro: "o prueba sin cuenta",
    yaTienes: "¿Ya tienes cuenta?",
    iniciaSesion: "Inicia sesión",

    volver: "Volver a iniciar sesión",
    recuperarTitulo: "Recupera tu acceso",
    recuperarEntrada:
      "Escribe el correo con el que te registraste y te enviaremos un enlace para elegir una contraseña nueva.",
    recuperarBoton: "Enviarme el enlace",
    recuperarCargando: "Enviando el enlace…",
    recuperarListo: "Enlace enviado",
    recuperarNota:
      "El enlace caduca en 30 minutos. Si no te llega, revisa la carpeta de correo no deseado.",
    enviadoTitulo: "Revisa tu correo",
    enviadoTexto1: "Enviamos un enlace de recuperación a",
    enviadoTexto2:
      ". Ábrelo desde este mismo dispositivo para elegir tu nueva contraseña.",
    volverEntrar: "Volver a iniciar sesión",
    reenviarEn: "Reenviar en",
    reenviar: "Reenviar el enlace",

    faltaCorreo: "Escribe tu correo.",
    correoInvalido: "Ese correo no parece válido.",
    faltaClave: "Escribe tu contraseña.",
    eligeClave: "Elige una contraseña.",
    claveCorta: "Mínimo 8 caracteres.",
    claveDebil: "Añade mayúsculas, números o símbolos.",
    faltaNombre: "¿Cómo te llamamos?",
    faltaCondiciones: "Necesitamos que aceptes las condiciones.",

    fuerza: ["Muy débil", "Débil", "Aceptable", "Buena", "Excelente"],

    // Errores devueltos por el servidor de cuentas
    errores: {
      correoEnUso: "Ya existe una cuenta con ese correo. Inicia sesión.",
      credencialesMal: "Ese correo o esa contraseña no son correctos.",
      cuentaBloqueada: "Esta cuenta está bloqueada. Escríbenos.",
      clavePersonal:
        "Esa contraseña es demasiado obvia: evita usar tu nombre o tu correo.",
      datosInvalidos: "Revisa los datos: hay algún campo con un formato no válido.",
      yaHaySesion: "Ya tenías una sesión abierta. Recarga la página.",
      origenNoAutorizado:
        "Este dominio no está autorizado en el proyecto de Appwrite. Hay que registrarlo como plataforma web.",
      enlaceCaducado:
        "Ese enlace ya se usó o ha caducado. Pide uno nuevo desde «¿Olvidaste tu contraseña?».",
      demasiadosIntentos: "Demasiados intentos seguidos. Espera un momento.",
      generico: "No se pudo completar la operación. Inténtalo de nuevo.",
      sinCuentas:
        "Las cuentas no están configuradas en este despliegue. Puedes continuar como invitado.",
    },

    // Nueva contraseña, al volver desde el correo de recuperación
    nuevaTitulo: "Elige tu nueva contraseña",
    nuevaEntrada:
      "Escríbela dos veces. Al guardarla podrás iniciar sesión con ella inmediatamente.",
    nuevaClave: "Nueva contraseña",
    repetirClave: "Repite la contraseña",
    noCoinciden: "Las dos contraseñas no coinciden.",
    guardarClave: "Guardar contraseña",
    guardandoClave: "Guardando…",
    claveGuardada: "Contraseña actualizada",
    listoTitulo: "Ya puedes entrar",
    listoTexto: "Tu contraseña quedó actualizada. Inicia sesión con la nueva.",
  },
};

export default es;
