const story = (title, scene, paragraphs, question, options, hint) => ({
  type: 'story',
  title,
  scene,
  paragraphs,
  question,
  options,
  hint,
});

const quiz = (title, questions) => ({ type: 'quiz', title, questions });
const summary = (title, text) => ({ type: 'summary', title, text });

export const STORY_LESSONS = [
  {
    id: 'story-p1-palabra',
    gradeId: 'p1',
    subject: 'lengua',
    title: 'La palabra que se perdió',
    subtitle: 'Un cuento sobre las palabras amables',
    description: 'Acompaña a Luci al mercado y ayuda a doña Rosa a recuperar una palabra muy importante.',
    duration: 10,
    xp: 100,
    scene: 'market',
    objective: 'Reconocer palabras amables y usarlas en una conversación.',
    keyIdeas: [
      'Las palabras pueden alegrar o entristecer a alguien.',
      'Dar las gracias es una forma de cuidar a los demás.',
      'Escuchar también es una forma de hablar con el corazón.',
    ],
    steps: [
      story(
        'El mercado sin “gracias”',
        'market',
        [
          'Luci llegó al mercado de doña Rosa. Había frutas, flores y mucha gente.',
          'Pero algo raro pasaba: nadie decía “gracias”. Doña Rosa estaba triste porque sentía que su mercado se había vuelto frío.',
          'Luci encontró una palabra brillando debajo de un costal de naranjas. Era la palabra “gracias”.',
        ],
        '¿Qué debe hacer Luci con la palabra “gracias”?',
        [
          { text: 'Devolverla a doña Rosa y usarla con la gente.', correct: true, feedback: '¡Sí! Las palabras amables vuelven a circular cuando las usamos.' },
          { text: 'Guardarla en su bolsillo y no decirla.', correct: false, feedback: 'Si la guarda, el mercado sigue frío. Las palabras sirven cuando se comparten.' },
          { text: 'Cambiarla por una naranja.', correct: false, feedback: 'Las palabras no se cambian por cosas: se comparten.' },
        ],
        'Piensa qué palabra hace sentir bien a otra persona.'
      ),
      quiz('Reto de palabras', [
        { q: '¿Qué palabra ayudó a alegrar el mercado?', options: ['Gracias', 'Silencio', 'Prisa', 'Ruido'], correct: 0, explain: '“Gracias” reconoce lo que otros hacen por nosotros.' },
        { q: '¿Qué significa ser amable con las palabras?', options: ['Hablar con respeto', 'Gritar', 'No escuchar', 'Burlarse'], correct: 0, explain: 'La amabilidad se nota en el tono y en el respeto.' },
        { q: '¿Qué otra palabra amable puedes usar?', options: ['Por favor', 'Fuera', 'Cállate', 'Nunca'], correct: 0, explain: '“Por favor” también cuida la relación con los demás.' },
      ]),
      summary('Palabras que abrazan', 'Las palabras amables son pequeñas semillas: pueden cambiar el día de alguien. Practica “gracias” y “por favor” en casa.'),
    ],
  },
  {
    id: 'story-p2-gota',
    gradeId: 'p2',
    subject: 'ciencias',
    title: 'El viaje de la gota',
    subtitle: 'Un cuento sobre el ciclo del agua',
    description: 'Sigue a una gota llamada Nube desde el mar hasta la lluvia y descubre cómo viaja el agua.',
    duration: 10,
    xp: 100,
    scene: 'water',
    objective: 'Explicar el recorrido del agua en el ciclo natural.',
    keyIdeas: [
      'El sol calienta el agua y la convierte en vapor.',
      'El vapor se enfría y forma nubes.',
      'La lluvia devuelve el agua a la tierra y a los ríos.',
    ],
    steps: [
      story(
        'Nube quiere volver al mar',
        'water',
        [
          'Nube era una gota que vivía en el mar. Un día, el sol la calentó tanto que subió al cielo convertida en vapor.',
          'Arriba hacía frío. Nube se juntó con otras gotitas y se convirtió en una nube gris.',
          'Cuando la nube se puso muy pesada, cayó la lluvia. Nube aterrizó en una montaña y empezó a bajar por un río.',
        ],
        '¿Qué crees que le pasó a Nube después de caer en la montaña?',
        [
          { text: 'Bajó por el río y volvió al mar.', correct: true, feedback: '¡Exacto! El agua sigue un ciclo: mar, vapor, nube, lluvia y río.' },
          { text: 'Desapareció para siempre.', correct: false, feedback: 'El agua no desaparece: se transforma y sigue viajando.' },
          { text: 'Se convirtió en una piedra.', correct: false, feedback: 'El agua cambia de estado, pero no se convierte en piedra.' },
        ],
        'Recuerda: el agua cambia de estado, pero no desaparece.'
      ),
      quiz('Reto del agua', [
        { q: '¿Qué hace el sol con el agua del mar?', options: ['La evapora', 'La congela', 'La esconde', 'La pinta'], correct: 0, explain: 'El sol calienta el agua y la convierte en vapor.' },
        { q: '¿Qué forma una nube?', options: ['Vapor que se enfría', 'Arena', 'Humo', 'Piedras'], correct: 0, explain: 'El vapor se condensa en gotitas que forman nubes.' },
        { q: '¿Qué pasa cuando la nube se pone pesada?', options: ['Llueve', 'Se vuelve sol', 'Se queda quieta', 'Se seca'], correct: 0, explain: 'Las gotas caen como precipitación.' },
      ]),
      summary('El agua viaja', 'El ciclo del agua conecta el mar, el cielo, la montaña y el río. Cuidar el agua es cuidar ese viaje.'),
    ],
  },
  {
    id: 'story-p3-colibri',
    gradeId: 'p3',
    subject: 'lengua',
    title: 'El colibrí que no compartía',
    subtitle: 'Una fábula sobre compartir',
    description: 'Un colibrí encuentra un jardín lleno de flores y debe decidir si comparte o no.',
    duration: 10,
    xp: 100,
    scene: 'forest',
    objective: 'Identificar la moraleja de una fábula y reflexionar sobre compartir.',
    keyIdeas: [
      'Las fábulas dejan una enseñanza llamada moraleja.',
      'Compartir fortalece la amistad y la comunidad.',
      'Las decisiones tienen consecuencias para uno y para los demás.',
    ],
    steps: [
      story(
        'El jardín del colibrí',
        'forest',
        [
          'Un colibrí encontró un jardín secreto lleno de flores dulces. Quiso quedarse con todo para él.',
          'Las abejas y las mariposas llegaron, pero el colibrí les dijo: “Este jardín es solo mío”.',
          'Con el paso de los días, las flores dejaron de recibir visita. El jardín se puso triste y el colibrí se quedó solo.',
        ],
        '¿Qué debió hacer el colibrí?',
        [
          { text: 'Compartir el jardín con los demás.', correct: true, feedback: '¡Sí! Compartir mantiene vivos los jardines y las amistades.' },
          { text: 'Echar a todos para siempre.', correct: false, feedback: 'Echar a todos lo dejó solo; la moraleja habla de compartir.' },
          { text: 'Llevarse las flores a su nido.', correct: false, feedback: 'Las flores necesitan su jardín y a sus polinizadores.' },
        ],
        'Piensa en lo que pasó cuando el colibrí se quedó solo.'
      ),
      quiz('Reto de fábulas', [
        { q: '¿Qué es una moraleja?', options: ['La enseñanza de la fábula', 'El personaje', 'El lugar', 'El título'], correct: 0, explain: 'La moraleja es la enseñanza final.' },
        { q: '¿Qué consecuencia trajo no compartir?', options: ['Soledad y jardín triste', 'Más amigos', 'Más flores', 'Nada'], correct: 0, explain: 'El colibrí se quedó solo y el jardín se apagó.' },
        { q: '¿Qué valor enseña la historia?', options: ['Compartir', 'Gritar', 'Esconder', 'Correr'], correct: 0, explain: 'La fábula invita a compartir.' },
      ]),
      summary('La moraleja del colibrí', 'Compartir no quita: multiplica. Una comunidad que comparte florece.'),
    ],
  },
  {
    id: 'story-p4-milpa',
    gradeId: 'p4',
    subject: 'ciencias',
    title: 'La milpa de los abuelos',
    subtitle: 'Un cuento sobre las plantas y el suelo',
    description: 'Luci visita la milpa de sus abuelos y descubre por qué maíz, frijol y calabaza crecen juntos.',
    duration: 11,
    xp: 110,
    scene: 'forest',
    objective: 'Reconocer la relación entre plantas, suelo y cuidado del ambiente.',
    keyIdeas: [
      'La milpa combina plantas que se ayudan entre sí.',
      'El frijol aporta nutrientes al suelo.',
      'La calabaza cubre el suelo y conserva la humedad.',
    ],
    steps: [
      story(
        'Tres plantas, un equipo',
        'forest',
        [
          'Luci llegó a la milpa de sus abuelos. Vio maíz alto, frijol enredado y calabaza extendida por el suelo.',
          '—No están juntas por casualidad —dijo su abuela—. El frijol alimenta la tierra, la calabaza la protege y el maíz sostiene al frijol.',
          'Luci quiso arrancar una planta que le pareció “un estorbo”. Su abuelo le pidió pensar antes de hacerlo.',
        ],
        '¿Qué debe hacer Luci?',
        [
          { text: 'Observar cómo se ayudan antes de arrancar nada.', correct: true, feedback: '¡Muy bien! Cada planta cumple una función en la milpa.' },
          { text: 'Arrancar la planta que no le gustó.', correct: false, feedback: 'Antes de quitar una planta hay que entender su función.' },
          { text: 'Regar solo el maíz.', correct: false, feedback: 'Todas las plantas necesitan cuidados y forman un sistema.' },
        ],
        'Piensa en las relaciones entre las plantas, no solo en una.'
      ),
      quiz('Reto de la milpa', [
        { q: '¿Qué aporta el frijol al suelo?', options: ['Nutrientes', 'Plástico', 'Sequía', 'Ruido'], correct: 0, explain: 'El frijol fija nutrientes y mejora el suelo.' },
        { q: '¿Para qué sirve la calabaza en la milpa?', options: ['Cubre el suelo y conserva humedad', 'Tapa el sol para siempre', 'Ahuyenta a las personas', 'Se come el maíz'], correct: 0, explain: 'Su hoja ancha protege el suelo.' },
        { q: '¿Qué es una milpa?', options: ['Un sistema de cultivo asociado', 'Una sola planta', 'Un animal', 'Una máquina'], correct: 0, explain: 'La milpa combina varios cultivos que se ayudan.' },
      ]),
      summary('Cuidar la milpa', 'La milpa enseña que las plantas, el suelo y las personas forman un equipo. Observar antes de actuar es parte de cuidar.'),
    ],
  },
  {
    id: 'story-p5-rio',
    gradeId: 'p5',
    subject: 'lengua',
    title: 'La noticia del río',
    subtitle: 'Un cuento sobre hechos y opiniones',
    description: 'En el periódico escolar aparecen dos notas sobre el río. Luci debe distinguir datos de opiniones.',
    duration: 11,
    xp: 110,
    scene: 'city',
    objective: 'Distinguir hechos verificables de opiniones en un texto.',
    keyIdeas: [
      'Un hecho se puede comprobar.',
      'Una opinión expresa un punto de vista.',
      'Leer con criterio ayuda a no confundir datos con creencias.',
    ],
    steps: [
      story(
        'Dos notas, una verdad',
        'city',
        [
          'El periódico escolar publicó dos notas. Una decía: “El río bajó 20 centímetros esta semana”.',
          'La otra decía: “El río es el más bonito de todo Chiapas”.',
          'Luci debía elegir cuál nota usar para su reportaje sobre el agua.',
        ],
        '¿Cuál nota contiene un hecho que se puede comprobar?',
        [
          { text: '“El río bajó 20 centímetros esta semana”.', correct: true, feedback: '¡Sí! Es un dato que se puede medir y verificar.' },
          { text: '“El río es el más bonito de Chiapas”.', correct: false, feedback: 'Eso es una opinión: depende de gustos.' },
          { text: 'Las dos son igual de comprobables.', correct: false, feedback: 'La belleza no se mide; el nivel del río sí.' },
        ],
        'Pregúntate: ¿esto se puede medir o comprobar?'
      ),
      quiz('Reto de criterio', [
        { q: '¿Cuál es un hecho?', options: ['El río tiene 20 cm menos', 'El río es hermoso', 'El río es el mejor', 'Todos aman el río'], correct: 0, explain: 'Se puede medir y comprobar.' },
        { q: '¿Cuál es una opinión?', options: ['El río es el más bonito', 'El río mide 20 cm', 'Llueve en agosto', 'El agua corre'], correct: 0, explain: 'La belleza es una valoración.' },
        { q: '¿Para qué sirve separar hechos de opiniones?', options: ['Para informar con criterio', 'Para no leer', 'Para inventar', 'Para callar'], correct: 0, explain: 'Ayuda a evaluar la información.' },
      ]),
      summary('Periodista con criterio', 'Cuando leas una noticia, separa lo que se comprueba de lo que alguien piensa. Eso te vuelve un lector crítico.'),
    ],
  },
  {
    id: 'story-p6-energia',
    gradeId: 'p6',
    subject: 'ciencias',
    title: 'La energía de la comunidad',
    subtitle: 'Un cuento sobre decisiones y recursos',
    description: 'La comunidad de Luci debe elegir cómo obtener energía para la escuela sin dañar el entorno.',
    duration: 11,
    xp: 110,
    scene: 'storm',
    objective: 'Comparar fuentes de energía y tomar una decisión argumentada.',
    keyIdeas: [
      'Las fuentes renovables se regeneran.',
      'Los combustibles fósiles se agotan y contaminan.',
      'Las decisiones ambientales afectan a toda la comunidad.',
    ],
    steps: [
      story(
        'La escuela necesita luz',
        'storm',
        [
          'La escuela de Luci necesitaba electricidad. Una empresa ofreció carbón, barato pero contaminante.',
          'Otra propuesta era instalar paneles solares y un pequeño aerogenerador, con una inversión inicial mayor.',
          'La comunidad se reunió para decidir. Luci tenía que argumentar su voto.',
        ],
        '¿Qué opción conviene más a largo plazo?',
        [
          { text: 'Paneles solares y viento: renovables y limpios.', correct: true, feedback: '¡Bien! Aunque la inversión inicial es mayor, cuida el ambiente y no se agota.' },
          { text: 'Carbón, porque es más barato ahora.', correct: false, feedback: 'El carbón contamina y se agota; el ahorro inmediato tiene un costo ambiental.' },
          { text: 'No hacer nada y quedarse sin luz.', correct: false, feedback: 'La comunidad necesita una solución; no decidir también es una decisión.' },
        ],
        'Piensa en el costo ambiental, no solo en el precio de hoy.'
      ),
      quiz('Reto de energía', [
        { q: '¿Cuál es una fuente renovable?', options: ['Sol', 'Carbón', 'Petróleo', 'Gas'], correct: 0, explain: 'El sol se regenera constantemente.' },
        { q: '¿Qué problema tiene el carbón?', options: ['Contamina y se agota', 'Es invisible', 'No da energía', 'Es renovable'], correct: 0, explain: 'Es un combustible fósil no renovable.' },
        { q: '¿Qué debe considerar una comunidad al decidir?', options: ['Costo, ambiente y futuro', 'Solo el precio', 'Solo la prisa', 'Nada'], correct: 0, explain: 'Las decisiones sostenibles consideran varios factores.' },
      ]),
      summary('Energía con futuro', 'Elegir energía es elegir el futuro de la comunidad. Las renovables cuidan el aire, el agua y el territorio.'),
    ],
  },
  {
    id: 'story-s1-escriba',
    gradeId: 's1',
    subject: 'historia',
    title: 'La voz de Mesoamérica',
    subtitle: 'Un relato sobre memoria y escritura',
    description: 'Un joven escriba maya debe decidir qué registrar en un códice para las generaciones futuras.',
    duration: 12,
    xp: 130,
    scene: 'pyramid',
    objective: 'Valorar la escritura y la memoria histórica de los pueblos mesoamericanos.',
    keyIdeas: [
      'Los mayas desarrollaron un sistema de escritura propio.',
      'Los códices conservaban historia, astronomía y rituales.',
      'La memoria de un pueblo se transmite con palabras, imágenes y tradición oral.',
    ],
    steps: [
      story(
        'El códice del tiempo',
        'pyramid',
        [
          'En una ciudad maya, un joven escriba preparaba un códice. Debía elegir qué historia dejar para el futuro.',
          'Podía registrar solo las fiestas de los gobernantes o también la vida del pueblo: sus cultivos, sus cuentos y sus observaciones del cielo.',
          'El escriba miró el amanecer y pensó en quienes leerían el códice muchos años después.',
        ],
        '¿Qué hace más valioso el códice?',
        [
          { text: 'Registrar la vida del pueblo y sus conocimientos.', correct: true, feedback: '¡Sí! La memoria completa incluye a la comunidad, no solo a los gobernantes.' },
          { text: 'Registrar solo las fiestas de los gobernantes.', correct: false, feedback: 'La historia también la construyen las personas comunes.' },
          { text: 'No registrar nada para no equivocarse.', correct: false, feedback: 'No escribir también silencia la memoria.' },
        ],
        'Piensa en quiénes construyen la historia además de los gobernantes.'
      ),
      quiz('Reto de memoria', [
        { q: '¿Qué era un códice?', options: ['Un libro con escritura e imágenes', 'Una pirámide', 'Un animal', 'Una herramienta'], correct: 0, explain: 'Los códices mayas registraban conocimientos e historia.' },
        { q: '¿Qué nos ayuda a conocer el pasado?', options: ['Fuentes escritas y orales', 'Solo la imaginación', 'El azar', 'El olvido'], correct: 0, explain: 'Las fuentes escritas, orales y materiales permiten reconstruir el pasado.' },
        { q: '¿Por qué es valiosa la memoria comunitaria?', options: ['Guarda identidad y saberes', 'Es más corta', 'No cambia', 'Es secreta'], correct: 0, explain: 'La memoria transmite identidad y conocimiento.' },
      ]),
      summary('Escribir para no olvidar', 'La historia se construye con muchas voces. Escuchar a la comunidad también es hacer historia.'),
    ],
  },
  {
    id: 'story-s2-temblor',
    gradeId: 's2',
    subject: 'ciencias',
    title: 'El temblor en la sierra',
    subtitle: 'Un relato sobre prevención y comunidad',
    description: 'Un temblor sorprende a un pueblo de la sierra. Luci debe decidir cómo actuar y qué aprender.',
    duration: 12,
    xp: 130,
    scene: 'storm',
    objective: 'Aplicar medidas básicas de prevención y organización ante un sismo.',
    keyIdeas: [
      'Chiapas está en una zona de actividad sísmica.',
      'La prevención salva vidas: rutas, simulacros y acuerdos comunitarios.',
      'La información y la calma son tan importantes como la infraestructura.',
    ],
    steps: [
      story(
        'La tierra se movió',
        'storm',
        [
          'El temblor llegó sin aviso. En la escuela, algunos niños corrieron hacia la puerta; otros se quedaron paralizados.',
          'Luci recordó el simulacro: no correr, cubrirse y sujetarse. Después, salir con calma por la ruta segura.',
          'Al terminar, la comunidad revisó los daños y se organizó para ayudar a las familias.',
        ],
        '¿Cuál es la mejor primera acción durante el temblor?',
        [
          { text: 'Cubrirse, sujetarse y esperar a que pase.', correct: true, feedback: '¡Correcto! Protegerse primero evita accidentes; después se evacúa con calma.' },
          { text: 'Correr hacia las escaleras.', correct: false, feedback: 'Correr durante el movimiento aumenta el riesgo de caídas.' },
          { text: 'Gritar y empujar a los demás.', correct: false, feedback: 'El pánico puede causar más daño que el sismo.' },
        ],
        'Primero protegerse; luego evacuar con calma.'
      ),
      quiz('Reto de prevención', [
        { q: '¿Qué hacer durante un sismo?', options: ['Cubrirse y sujetarse', 'Correr sin mirar', 'Saltar', 'Gritar'], correct: 0, explain: 'Protegerse la cabeza y el cuerpo es lo primero.' },
        { q: '¿Qué debe existir en la escuela?', options: ['Rutas y simulacros', 'Solo libros', 'Nada', 'Un solo extintor'], correct: 0, explain: 'Las rutas y los simulacros salvan vidas.' },
        { q: '¿Qué hacer después del sismo?', options: ['Evacuar con calma y revisar daños', 'Volver a correr', 'Ignorar a los demás', 'Esconderse'], correct: 0, explain: 'La calma y la organización son clave.' },
      ]),
      summary('Preparados y unidos', 'La prevención no evita todos los sismos, pero reduce riesgos. Organizarse y mantener la calma protege a la comunidad.'),
    ],
  },
  {
    id: 'story-s3-cafe',
    gradeId: 's3',
    subject: 'geografia',
    title: 'El café que cruza el mundo',
    subtitle: 'Un relato sobre globalización y territorio',
    description: 'Luci sigue el recorrido del café de su comunidad hasta una taza en otro continente.',
    duration: 12,
    xp: 140,
    scene: 'trade',
    objective: 'Analizar la cadena global del café y sus efectos en la comunidad local.',
    keyIdeas: [
      'La globalización conecta producción local con mercados globales.',
      'La cadena de valor incluye productores, intermediarios, tostadores y consumidores.',
      'El comercio justo y la organización local pueden mejorar las condiciones.',
    ],
    steps: [
      story(
        'De la sierra a la taza',
        'trade',
        [
          'El café de la comunidad de Luci viaja en costales. Pasa por intermediarios, se tuesta en otro país y regresa como una taza que cuesta mucho más de lo que pagaron por el grano.',
          'La comunidad quiere decidir: vender todo al intermediario o organizarse para procesar y vender directo.',
          'Luci investiga la cadena y descubre que la mayor parte del precio no queda en la sierra.',
        ],
        '¿Qué opción puede fortalecer más a la comunidad?',
        [
          { text: 'Organizarse para procesar y vender directo.', correct: true, feedback: '¡Sí! La organización local puede captar más valor y mejorar ingresos.' },
          { text: 'Vender todo al primer intermediario sin negociar.', correct: false, feedback: 'Pierde poder de negociación y valor local.' },
          { text: 'Dejar de producir café para siempre.', correct: false, feedback: 'La solución no es abandonar, sino mejorar la cadena y la organización.' },
        ],
        'Piensa en quién se queda con el valor del café.'
      ),
      quiz('Reto de globalización', [
        { q: '¿Qué es la globalización?', options: ['Conexión de mercados y culturas', 'Un tipo de café', 'Una montaña', 'Un impuesto'], correct: 0, explain: 'Conecta producción, comercio y culturas a escala mundial.' },
        { q: '¿Qué ayuda a los productores locales?', options: ['Organizarse y vender directo', 'Vender sin negociar', 'Abandonar la tierra', 'Depender de un solo comprador'], correct: 0, explain: 'La organización mejora la negociación y el valor local.' },
        { q: '¿Qué es el comercio justo?', options: ['Un intercambio con condiciones más equitativas', 'Vender más caro sin razón', 'No comerciar', 'Un monopolio'], correct: 0, explain: 'Busca precios y condiciones más justas para quienes producen.' },
      ]),
      summary('Territorio y mundo', 'Lo local y lo global están conectados. Organizarse, conocer la cadena y cuidar la identidad ayuda a que el café deje más valor en la comunidad.'),
    ],
  },
];
