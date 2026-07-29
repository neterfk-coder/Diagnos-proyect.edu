const en = {
  codigo: "en",
  nombre: "English",

  nav: {
    lema: "reasoning tutor",
    analizar: "Analyze exercise",
    grafica: "Graphs",
    tutor: "Study tutor",
    docente: "Teacher dashboard",
    entrar: "Sign in",
    invitado: "Guest",
    modoInvitado: "Guest mode",
    sinHistorial: "History is not saved",
    crearCuenta: "Create a free account",
    salirInvitado: "Exit guest mode",
    cerrarSesion: "Sign out",
    idioma: "Language",
    roles: { estudiante: "Student", docente: "Teacher" },
  },

  racha: {
    aria: "Your daily streak",
    titulo: "Streak",
    dia: "day",
    dias: "days",
    seguidos: "in a row",
    hoyHecho: "Today already counts",
    hoyPendiente: "Today doesn't count yet",
    empezar: "Start your streak today",
    empezarTexto:
      "Diagnose an exercise, clear a practice problem or create study material. Any of the three makes the day count.",
    mejor: "Your best streak",
    proximoHito: "Next milestone",
    enPeligroTitulo: "Your streak is on the line",
    enPeligroTexto: "Do one activity today so you don't lose it.",
    semana: "This week",
    diasCortos: ["S", "M", "T", "W", "T", "F", "S"],

    subeTitulo: "A",
    subeTitulo2: "streak!",
    subeTexto: "Come back tomorrow to keep it growing.",
    hitoTexto: "You've hit a milestone. That's consistency, not luck.",
    seguir: "Keep going",
  },

  progreso: {
    etiqueta: "Your progress",
    aria: "Progress and rewards",
    puntos: "points",
    paraCofre: "to the next chest",
    coleccion: "Your collection",
    de: "of",
    bloqueada: "Not unlocked",

    motivos: {
      diagnostico: "Exercise diagnosed",
      descubrimiento: "You worked it out yourself!",
      ejercicioSuperado: "Exercise overcome",
      bucleCerrado: "Misconception overcome",
      materialEstudio: "Study material created",
    },

    cofreListo: "Chest ready!",
    cofreAbrir: "Open chest",
    cofreEspera: "Keep practising to fill the bar",
    cofrePendientes: "chests waiting",

    abriendo: "Opening…",
    premioTitulo: "New sticker!",
    premioRepetida: "You already had it, but it still looks good",
    premioCerrar: "Nice",

    rarezas: {
      comun: "Common",
      raro: "Rare",
      epico: "Epic",
      legendario: "Legendary",
    },

    pegatinas: {
      "primer-paso": "First step",
      "cazador-signos": "Sign hunter",
      equilibrista: "Tightrope walker",
      parentesis: "Bracket tamer",
      fraccionario: "Fraction master",
      socratico: "Socratic",
      insistente: "Persistent",
      lector: "Voracious reader",
      "mente-clara": "Clear mind",
      "sin-red": "No safety net",
      demoledor: "Myth breaker",
      eureka: "Eureka!",
    },
  },

  pie: {
    lema: "It doesn't correct your answer. It corrects your reasoning.",
    descripcion:
      "An AI tutor that finds the exact step where a student's reasoning broke, names the misconception behind it, and guides them until they discover it themselves.",
    evento: "Prometheus July AI Challenge · 2026",
    derechos: "All rights reserved.",
    hecho: "Built with Next.js, Groq and Appwrite",
    estado: "All systems operational",

    producto: {
      titulo: "Product",
      enlaces: [
        { href: "/analizar", texto: "Analyze an exercise" },
        { href: "/grafica", texto: "Function lab" },
        { href: "/tutor", texto: "Study tutor (PDF)" },
        { href: "/docente", texto: "Teacher dashboard" },
        { href: "/#metodo", texto: "How it works" },
        { href: "/ayuda#catalogo", texto: "Misconception catalogue" },
      ],
    },
    cuenta: {
      titulo: "Account",
      enlaces: [
        { href: "/entrar", texto: "Sign in" },
        { href: "/registro", texto: "Create an account" },
        { href: "/perfil", texto: "My profile" },
        { href: "/analizar", texto: "Continue as guest" },
      ],
    },
    soporte: {
      titulo: "Support",
      enlaces: [
        { href: "/ayuda", texto: "Help centre" },
        { href: "/ayuda#faq", texto: "Frequently asked questions" },
        { href: "/contacto", texto: "Contact us" },
        { href: "/contacto#problema", texto: "Report a problem" },
      ],
    },
    legal: {
      titulo: "Legal",
      enlaces: [
        { href: "/terminos", texto: "Terms of use" },
        { href: "/privacidad", texto: "Privacy policy" },
        { href: "/terminos#cookies", texto: "Cookie policy" },
        { href: "/ayuda#accesibilidad", texto: "Accessibility" },
      ],
    },
    barraLegal: [
      { href: "/terminos", texto: "Terms" },
      { href: "/privacidad", texto: "Privacy" },
      { href: "/terminos#cookies", texto: "Cookies" },
      { href: "/ayuda#accesibilidad", texto: "Accessibility" },
    ],
  },

  inicio: {
    etiqueta: "AI reasoning tutor · Algebra",
    titulo1: "It doesn't correct your answer.",
    titulo2: "It corrects your reasoning.",
    entrada:
      "When you get an exercise wrong, apps just say «incorrect». Diagnos tells you",
    entradaEnfasis: "why you thought that way",
    entradaFin:
      ", at which exact step, and guides you with questions until you find the error yourself.",
    ctaAnalizar: "Analyze my exercise",
    ctaDocente: "I'm a teacher",
    notaCta: "Works with pencil, paper and a photo. Built for real classrooms.",

    tarjetaEtiqueta: "Live diagnosis",
    tarjetaPagina: "notebook · p. 12",
    tarjetaMisconception: "Misconception · SIG-01",
    tarjetaExplicacion:
      "When you moved the 5 to the other side, you assumed it keeps its sign. What did you do to the left that you didn't do to the right?",

    problemaEtiqueta: "The problem",
    problemaTitulo: "«Incorrect, the answer was 5» teaches nothing.",
    problemaTexto1: "Behind every repeated mistake there is a",
    problemaEnfasis: "misconception",
    problemaTexto2:
      ": a false rule the student believes to be true. A teacher with thirty-five students cannot diagnose it notebook by notebook. Diagnos can — without robbing the student of the joy of discovering it.",

    metodoEtiqueta: "The method",
    metodoTitulo: "Four steps, zero answers given away",
    metodo: [
      {
        titulo: "Show your work",
        detalle:
          "A photo of your notebook is enough. Diagnos reads your handwriting and reconstructs every step exactly as you thought it.",
      },
      {
        titulo: "Find the broken step",
        detalle:
          "It doesn't check your final answer: it walks through your reasoning and pinpoints where the logic broke.",
      },
      {
        titulo: "Name your misconception",
        detalle:
          "It classifies the error against a real pedagogical catalogue. It's not a mistyped symbol: it's an idea that needs fixing.",
      },
      {
        titulo: "Guide you until you see it",
        detalle:
          "It never gives you the solution. A dialogue of questions leads you to state your own error, and then you practise against it.",
      },
    ],

    catalogoEtiqueta: "Pedagogical rigour",
    catalogoTitulo:
      "A real catalogue of misconceptions, not made-up labels",
    catalogoTexto:
      "Every diagnosis is classified against a taxonomy of algebraic errors documented in educational research. That makes it possible to measure, compare and — above all — re-teach with precision.",

    docenteEtiqueta: "For teachers",
    docenteTitulo: "Your classroom's heat map, notebook by notebook",
    docenteTexto:
      "Every anonymous diagnosis feeds a dashboard showing which misconceptions dominate your class this week. Stop guessing what to re-teach on Monday: look at it.",
    docenteCta: "See the teacher dashboard",
    docenteDemoEtiqueta: "Demo class · this week",

    cierreTitulo1: "The best moment to learn",
    cierreTitulo2: "is right after getting it wrong.",
    cierreCta: "Start now — it's free",
  },

  analizar: {
    etiqueta: "Analyze exercise",
    titulo: "Get it wrong with confidence",
    entrada:
      "Here a mistake isn't a red mark: it's the starting point. Upload your work and let's find out together which idea needs adjusting.",
    paso2: "Step 2 · Diagnosis",
    tituloCorrecto: "Your reasoning is flawless",
    tituloError: "I found where it broke",
    misconception: "Misconception",
    esperandoTitulo: "The dialogue will appear here",
    esperandoTexto:
      "After the diagnosis, the tutor will ask you questions — it will never give you the answer.",
    errorTitulo: "Something went wrong",
    errorGenerico: "An error occurred during the diagnosis.",
    errorLento:
      "The model is taking too long and the request was cancelled. This is usually a temporary load spike: try again, or type your steps instead of uploading the photo.",
  },

  zonaCarga: {
    paso1: "Step 1 · Your work",
    titulo: "Show me how you solved it",
    entrada:
      "Upload a photo of your notebook or type your steps, one per line. It doesn't matter if it's wrong: that's the whole point.",
    arrastra: "Drag a photo of your notebook here",
    elegir: "Choose photo",
    quitar: "Remove photo",
    altPrevia: "Uploaded notebook photo",
    separador: "or type it",
    ariaTexto: "Type your work step by step",
    enviar: "Diagnose my reasoning",
    enviando: "Reading your reasoning…",
  },

  traza: {
    aqui: "Reasoning broke here",
  },

  chat: {
    paso3: "Step 3 · Socratic dialogue",
    titulo: "Find it yourself — I only ask",
    pensando: "Thinking of the next question…",
    descubierto:
      "You found it on your own. Now let's cement it with targeted practice ↓",
    completado: "Dialogue complete",
    marcador: "Type your answer…",
    ariaEntrada: "Your reply to the tutor",
    enviar: "Send",
    errorRed: "The connection dropped. Tell me your idea again.",
  },

  practica: {
    paso4: "Step 4 · Targeted practice",
    titulo: "Three exercises against your error, not against chance",
    entrada: "Tailored to the misconception you just discovered",
    generar: "Generate my practice",
    generando: "Designing your practice…",
    verPista: "Show hint",
    ocultarPista: "Hide hint",
    error: "The exercises could not be generated.",
    niveles: {
      basico: "basic",
      intermedio: "intermediate",
      desafio: "challenge",
    },

    // Closing the loop: solve, check, overcome
    resolver: "Solve",
    ocultarResolucion: "Hide",
    tuRespuesta: "Your work",
    marcadorRespuesta: "Write your steps here, one per line",
    comprobar: "Check",
    comprobando: "Checking…",
    errorComprobar: "Your answer could not be checked. Please try again.",
    superado: "Overcome",
    reincidido: "Try again",
    progreso: "overcome",
    reintentar: "Try again",
    cerradoTitulo: "You have overcome this misconception",
    cerradoTexto:
      "You solved all three exercises without falling into the same reasoning again. That is what understanding it means — not getting it right.",
    parcialTitulo: "You are on the right track",
    parcialTexto:
      "Finish the remaining exercises to confirm the idea has settled.",
  },

  docente: {
    etiqueta: "Teacher dashboard",
    titulo: "What to re-teach on Monday",
    entrada:
      "Every anonymous diagnosis from your students is aggregated here. These aren't grades: it's a map of the ideas your classroom needs to revisit.",
    cargando: "Loading diagnoses…",
    registrados: "Diagnoses recorded",
    dominante: "Dominant misconception in class",
    mapaTitulo: "Misconception heat map",
    envivo: "live data · Appwrite",
    demo: "demonstration data",
    casos: "cases",
    sinClasificar: "Unclassified",
    sugerenciaEtiqueta: "Suggestion for your next class",
    sugerenciaTitulo1: "Open the class with a counterexample of «",
    sugerenciaTitulo2: "» and let the group take it apart out loud.",
    sugerenciaTexto:
      "Misconceptions aren't erased by stating the correct rule: they're replaced when the student sees their own rule produce an absurd result. Diagnos does that one-to-one; you can do it with the whole class at once.",

    // Restricted access
    entrarTitulo: "This dashboard is for teachers",
    entrarTexto:
      "Sign in with your teacher account to see your classroom map. The data is anonymous and aggregated: an individual student is never shown.",
    entrarBoton: "Sign in",
    registroBoton: "Create a teacher account",
    soloDocentesTitulo: "Your account is a student account",
    soloDocentesTexto:
      "The classroom dashboard is only visible to teacher accounts. You can change your account role from your profile.",
    irAlPerfil: "Go to my profile",

    // Classroom code
    codigoEtiqueta: "Your classroom code",
    codigoTexto:
      "Share it with your students. Diagnoses from anyone who enters it will show up here.",
    copiar: "Copy",
    copiado: "Copied",
    sinDatosTitulo: "No diagnoses yet",
    sinDatosTexto:
      "As soon as a student in your classroom analyses an exercise, their misconception will appear on this map.",
    errorCarga: "The classroom could not be loaded. Reload the page.",
  },

  grafica: {
    etiqueta: "Function lab",
    titulo: "See what the function actually looks like",
    entrada:
      "Pick a function, move the parameters and watch what happens to the curve. Understanding a fraction or an equation gets much easier once you can see it change.",

    familias: {
      trigonometrica: "Trigonometric",
      algebraica: "Algebraic",
    },

    parametros: "Parameters",
    ayudaParametros:
      "Move each control and watch what changes. It is the fastest way to understand what every number does.",

    a: "Amplitude",
    aTexto: "Stretches or squashes the curve vertically. A negative value flips it.",
    b: "Frequency",
    bTexto: "Compresses or stretches the curve horizontally. It changes the period.",
    c: "Horizontal shift",
    cTexto: "Moves the curve left or right.",
    d: "Vertical shift",
    dTexto: "Moves the whole curve up or down.",

    encuadre: "View",
    acercar: "Zoom in",
    alejar: "Zoom out",
    reiniciar: "Reset",

    asintotas:
      "The dashed orange lines are asymptotes: the function does not exist there.",
    pistaCursor: "Hover over the graph to read its values.",

    notas: {
      tan: "The tangent shoots off to infinity every π, which is why it appears cut into branches.",
      sec: "The secant is 1/cos, so it does not exist wherever the cosine is zero.",
      csc: "The cosecant is 1/sin, so it does not exist wherever the sine is zero.",
      cot: "The cotangent is cos/sin, so it does not exist wherever the sine is zero.",
      inversa: "1/x never touches zero: it gets infinitely close to both axes.",
      raiz: "The square root does not exist for negative numbers, so the curve starts at zero.",
      logaritmo: "The logarithm only exists for positive values.",
    },
  },

  tutor: {
    etiqueta: "AI study tutor",
    titulo: "Turn any PDF into study material",
    entrada:
      "Upload a document and get an elaborated summary, the key points, flashcards to test yourself and exercises to apply what you read.",

    soltar: "Drop your PDF here",
    elegir: "Choose a PDF",
    quitar: "Remove file",
    limite: "PDF with selectable text",
    leyendoPdf: "Reading the PDF…",
    separador: "or paste the text",
    marcadorTexto:
      "Paste here the text you want to study — notes, an article, a chapter…",
    ariaTexto: "Text to study",
    generar: "Create my study material",
    generando: "Reading your document…",

    fases: [
      "Reading the document…",
      "Extracting the text…",
      "Finding the key ideas…",
      "Writing your material…",
    ],

    paginas: "pages",
    caracteres: "characters",
    leidoEn: "read in",
    partes: "parts",
    parteFallida: "one part could not be read",
    partesFallidas: "parts could not be read",
    recortado:
      "Very long document: only the first part was analysed. The rest was left out.",
    otro: "Study another document",

    pestanas: {
      resumen: "Summary",
      puntos: "Key points",
      flashcards: "Flashcards",
      ejercicios: "Exercises",
    },

    flashcardsAyuda: "Click a card to flip it",
    anverso: "Question",
    reverso: "Answer",
    tarjeta: "Card",
    de: "of",
    anterior: "Previous",
    siguiente: "Next",
    girar: "Flip card",

    verPista: "Show hint",
    ocultarPista: "Hide hint",

    errorTitulo: "That didn't work",
    errores: {
      sin_texto:
        "Almost no text could be extracted. If your PDF is a scan or a photo, it has no text layer — copy the text and paste it below instead.",
      grande:
        "That PDF could not be read in the browser and is too large to upload. Copy the text and paste it below instead.",
      ilegible: "That file could not be read as a PDF.",
      limite:
        "The Groq per-minute token limit was reached. Wait about a minute and try again, or use a shorter document.",
      vacio: "No usable study material came back. Please try again.",
      generico: "The study material could not be generated. Please try again.",
    },
  },

  paginas: {
    volver: "Back to home",

    ayuda: {
      etiqueta: "Help centre",
      titulo: "Everything you need to use Diagnos",
      entrada:
        "Short answers to the questions we get most. If none of this solves it, write to us and a person will reply.",
      empezar: {
        titulo: "Getting started",
        pasos: [
          {
            titulo: "Photograph or type your work",
            texto:
              "Take a picture of your notebook, or type your steps one per line. Handwriting works; a straight, well-lit photo works better.",
          },
          {
            titulo: "Read the diagnosis",
            texto:
              "Diagnos marks the first step where the reasoning broke and names the misconception behind it. Later steps are marked as carried-over, not as new mistakes.",
          },
          {
            titulo: "Answer the questions",
            texto:
              "The tutor will only ask. It will not give you the answer, on purpose: the point is that you say it out loud yourself.",
          },
        ],
      },
      faq: {
        titulo: "Frequently asked questions",
        preguntas: [
          {
            p: "Why doesn't it just tell me the correct answer?",
            r: "Because being told the rule does not remove a misconception. It gets replaced when you see your own rule produce an absurd result. That is why the tutor asks instead of explaining, and why the third practice exercise is designed so your own mistake contradicts itself.",
          },
          {
            p: "Does it work with handwriting?",
            r: "Yes. Take the photo straight on, with the page well lit and no shadow across it. If a step is transcribed wrong, retype that step by hand and run it again.",
          },
          {
            p: "What if my procedure is actually correct?",
            r: "Diagnos will say so and will not invent an error. It only opens the Socratic dialogue when it finds a broken step.",
          },
          {
            p: "Do I need an account?",
            r: "No. Guest mode gives you the full diagnosis, the dialogue and the practice. What you lose is history: nothing is saved between sessions.",
          },
          {
            p: "What does the teacher see?",
            r: "Aggregated, anonymous counts of misconceptions. No names, no grades, no individual answers. It is a map of what to re-teach, not a marking sheet.",
          },
          {
            p: "Which subjects does it cover?",
            r: "First-year secondary school algebra, classified against a twelve-entry catalogue of documented misconceptions. Anything outside that is out of scope for now.",
          },
        ],
      },
      catalogo: {
        titulo: "Misconception catalogue",
        entrada:
          "Every diagnosis is classified against one of these twelve entries. The codes are stable, which is what makes the teacher dashboard possible.",
      },
      accesibilidad: {
        titulo: "Accessibility",
        parrafos: [
          "Diagnos is built to be usable with a keyboard alone: every control is reachable by tabbing and shows a visible focus ring. Form fields have labels, errors are announced to screen readers, and the Socratic dialogue is a live region so new tutor messages are read out.",
          "If you have reduced motion enabled in your system settings, every animation on the site is disabled automatically — nothing moves, fades or slides.",
          "Colour is never the only way information is conveyed: the broken step is marked with an icon and a text label, not just with amber.",
          "If something is unusable for you, tell us. Accessibility problems are treated as bugs, not as requests.",
        ],
      },
    },

    contacto: {
      etiqueta: "Contact",
      titulo: "Talk to a person",
      entrada:
        "Questions, ideas, or something broken. We read everything and reply to all of it.",
      canales: [
        {
          titulo: "General enquiries",
          detalle: "For anything about the product, classroom use or partnerships.",
          valor: "hola@diagnos.app",
        },
        {
          titulo: "Teachers and schools",
          detalle: "Using Diagnos with a whole class, or across several groups.",
          valor: "docentes@diagnos.app",
        },
        {
          titulo: "Response time",
          detalle: "We aim to answer within two working days.",
          valor: "Monday to Friday",
        },
      ],
      formulario: {
        titulo: "Report a problem",
        entrada:
          "Tell us what happened and what you expected instead. If it involves a specific exercise, paste the steps.",
        nombre: "Your name",
        correo: "Email address",
        asunto: "Subject",
        mensaje: "What happened",
        enviar: "Send message",
        enviando: "Sending…",
        enviado: "Message sent",
        exitoTitulo: "Thank you",
        exitoTexto:
          "We have your message. If you left an email address, we will reply to it.",
        otro: "Send another message",
        faltaNombre: "Tell us your name.",
        faltaAsunto: "Add a subject.",
        faltaMensaje: "Describe what happened.",
      },
    },

    terminos: {
      etiqueta: "Legal",
      titulo: "Terms of use",
      actualizado: "Last updated: July 2026",
      secciones: [
        {
          titulo: "What Diagnos is",
          parrafos: [
            "Diagnos is an educational tool that analyses a student's algebra work, identifies where the reasoning broke and guides them with questions. It is a study aid, not a substitute for a teacher, and it does not issue grades or certificates.",
            "This is a prototype built for the Prometheus July AI Challenge. It is offered as it is, without any guarantee of availability or continuity.",
          ],
        },
        {
          titulo: "Acceptable use",
          parrafos: [
            "Use Diagnos for learning and teaching. Do not use it to submit work as your own where that is not allowed, do not upload other people's material without permission, and do not try to overload or break the service.",
            "You are responsible for anything you upload, including photographs of notebooks that may contain other people's handwriting.",
          ],
        },
        {
          titulo: "Accuracy",
          parrafos: [
            "The diagnosis is produced by an AI model and can be wrong: it may transcribe a step incorrectly, or classify a misconception badly. Always check the result against your own judgement, and treat a teacher's opinion as the one that counts.",
          ],
        },
        {
          id: "cookies",
          titulo: "Cookies and local storage",
          parrafos: [
            "Diagnos does not use advertising or tracking cookies. It does not profile you and it does not share data with advertisers.",
            "It stores two things in your browser's local storage: the language you chose, and your session state. Both stay on your device, are never sent to a server for tracking, and are removed when you sign out or clear your browser data.",
          ],
        },
        {
          titulo: "Changes",
          parrafos: [
            "These terms may change as the product develops. The date above always reflects the current version.",
          ],
        },
      ],
    },

    privacidad: {
      etiqueta: "Legal",
      titulo: "Privacy policy",
      actualizado: "Last updated: July 2026",
      secciones: [
        {
          titulo: "The short version",
          parrafos: [
            "We store as little as possible. We do not sell data, we do not run advertising, and the teacher dashboard never shows an individual student.",
          ],
        },
        {
          titulo: "What we store",
          parrafos: [
            "When a diagnosis finds an error, we record three anonymous fields: the detected exercise statement, the misconception code, and the number of the broken step. Nothing links that record to a person.",
            "Your language preference and your session state live only in your browser's local storage, never on our servers.",
          ],
        },
        {
          titulo: "What we do not store",
          parrafos: [
            "We do not keep the photographs of notebooks. An image is sent for analysis, processed, and not written to any database of ours.",
            "We do not keep the Socratic conversation. It lives in the browser tab and disappears when you close it.",
          ],
        },
        {
          titulo: "Third parties",
          parrafos: [
            "Text and images you submit are processed by Groq, which runs the AI models that produce the diagnosis. Anonymous diagnosis records are stored with Appwrite. Both are processors acting on our behalf.",
          ],
        },
        {
          titulo: "Children",
          parrafos: [
            "Diagnos is designed for secondary school students, so many users are minors. That is exactly why the records are anonymous and no personal data is required to use the tool: guest mode needs no account at all.",
          ],
        },
        {
          titulo: "Your rights",
          parrafos: [
            "Because the diagnosis records contain no identifying data, we cannot link them back to you to retrieve or delete them individually. Anything that is yours — language, session — you can erase yourself by clearing your browser storage. For anything else, write to us.",
          ],
        },
      ],
    },

    perfil: {
      etiqueta: "My profile",
      titulo: "Your account",
      sinSesionTitulo: "You are not signed in",
      sinSesionTexto:
        "Sign in to keep your diagnoses, or carry on as a guest — the tool works either way.",
      invitadoTitulo: "You are browsing as a guest",
      invitadoTexto:
        "Everything works, but nothing is saved. Create a free account to keep your history and track which misconceptions you have already overcome.",
      campos: {
        nombre: "Name",
        correo: "Email address",
        rol: "Role",
        idioma: "Interface language",
      },
      preferencias: "Preferences",
      datos: "Your data",
      datosTexto:
        "Your account and session are managed by Appwrite. The language preference is stored only in this browser. Signing out ends the session on this device only.",
      salir: "Sign out",
      entrar: "Sign in",
      registro: "Create an account",

      aulaTitulo: "Classroom",
      aulaDocenteTexto:
        "This is your classroom code. Give it to your students so their diagnoses show up on your dashboard.",
      aulaEstudianteTexto:
        "If your teacher gave you a classroom code, enter it here. Your diagnoses will feed their class map, always anonymously.",
      aulaCampo: "Classroom code",
      aulaGuardar: "Save",
      aulaGuardando: "Saving…",
      aulaGuardada: "Saved",
      aulaSalir: "Leave classroom",
      sinAula: "You don't belong to a classroom.",

      rolTitulo: "Account type",
      rolTexto:
        "Switch to teacher if you need to see a classroom map. You can switch back at any time.",
      rolGuardado: "Role updated",
    },
  },

  acceso: {
    // Panel de marca
    claims: [
      {
        titulo: "«Incorrect» teaches nothing.",
        texto: "Diagnos finds the exact step where your reasoning broke.",
      },
      {
        titulo: "It never gives you the answer.",
        texto: "It asks questions until you state your own error yourself.",
      },
      {
        titulo: "A map of your entire classroom.",
        texto:
          "Every anonymous diagnosis tells the teacher what to re-teach on Monday.",
      },
    ],
    panelEtiqueta: "Live diagnosis",
    panelPagina: "p. 12",
    panelMisconception: "Misconception · SIG-01",
    panelExplicacion:
      "When you moved the 5 to the other side, you assumed it keeps its sign.",
    verMensaje: "View message",

    // Selector
    iniciarSesion: "Sign in",
    crearCuenta: "Create account",

    // Campos
    correo: "Email address",
    contrasena: "Password",
    nombre: "Name",
    mostrarClave: "Show password",
    ocultarClave: "Hide password",

    // Entrar
    entrarTitulo: "Back to your reasoning",
    entrarEntrada:
      "Your diagnoses, your named errors and your progress are waiting where you left them.",
    recordar: "Keep me signed in",
    olvidaste: "Forgot your password?",
    entrarBoton: "Sign in",
    entrarCargando: "Verifying…",
    entrarListo: "Welcome back",
    separadorEntrar: "or continue without an account",
    invitadoBoton: "Continue as guest",
    invitadoEntrando: "Entering…",
    invitadoNota:
      "As a guest you can diagnose exercises, but your history won't be saved.",
    sinCuenta: "Don't have an account yet?",
    creaUna: "Create one for free",

    // Registro
    registroTitulo: "Start by getting it wrong",
    registroEntrada:
      "Create your free account. No card, no limit on exercises.",
    quienEres: "Who are you?",
    roles: [
      { id: "estudiante", texto: "I'm a student", pie: "Diagnose your exercises" },
      { id: "docente", texto: "I'm a teacher", pie: "See your classroom map" },
    ],
    condiciones:
      "I accept the Diagnos terms of use and privacy policy.",
    registroBoton: "Create my account",
    registroCargando: "Creating your account…",
    registroListo: "Account created",
    separadorRegistro: "or try without an account",
    yaTienes: "Already have an account?",
    iniciaSesion: "Sign in",

    // Recuperar
    volver: "Back to sign in",
    recuperarTitulo: "Recover your access",
    recuperarEntrada:
      "Enter the email you signed up with and we'll send you a link to choose a new password.",
    recuperarBoton: "Send me the link",
    recuperarCargando: "Sending the link…",
    recuperarListo: "Link sent",
    recuperarNota:
      "The link expires in 30 minutes. If it doesn't arrive, check your spam folder.",
    enviadoTitulo: "Check your email",
    enviadoTexto1: "We sent a recovery link to",
    enviadoTexto2:
      ". Open it on this same device to choose your new password.",
    volverEntrar: "Back to sign in",
    reenviarEn: "Resend in",
    reenviar: "Resend the link",

    // Validación
    faltaCorreo: "Enter your email.",
    correoInvalido: "That email doesn't look valid.",
    faltaClave: "Enter your password.",
    eligeClave: "Choose a password.",
    claveCorta: "At least 8 characters.",
    claveDebil: "Add uppercase letters, numbers or symbols.",
    faltaNombre: "What should we call you?",
    faltaCondiciones: "We need you to accept the terms.",

    // Fuerza de la contraseña
    fuerza: ["Very weak", "Weak", "Fair", "Good", "Excellent"],

    // Errors returned by the accounts backend
    errores: {
      correoEnUso: "An account with that email already exists. Sign in instead.",
      credencialesMal: "That email or password is not correct.",
      cuentaBloqueada: "This account is blocked. Please get in touch.",
      clavePersonal:
        "That password is too guessable: avoid using your name or your email.",
      datosInvalidos: "Check the details: one of the fields has an invalid format.",
      yaHaySesion: "You already had a session open. Reload the page.",
      origenNoAutorizado:
        "This domain is not authorised in the Appwrite project. It has to be registered as a web platform.",
      enlaceCaducado:
        "That link has already been used or has expired. Request a new one from “Forgot your password?”.",
      demasiadosIntentos: "Too many attempts in a row. Wait a moment.",
      generico: "The operation could not be completed. Please try again.",
      sinCuentas:
        "Accounts are not configured on this deployment. You can continue as a guest.",
    },

    // New password, after following the recovery email
    nuevaTitulo: "Choose your new password",
    nuevaEntrada:
      "Type it twice. Once saved you can sign in with it straight away.",
    nuevaClave: "New password",
    repetirClave: "Repeat the password",
    noCoinciden: "The two passwords do not match.",
    guardarClave: "Save password",
    guardandoClave: "Saving…",
    claveGuardada: "Password updated",
    listoTitulo: "You can sign in now",
    listoTexto: "Your password has been updated. Sign in with the new one.",
  },
};

export default en;
