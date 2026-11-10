# Raíz · Pitch de 3 minutos

## 1. El problema (30 s)

En muchas comunidades de Chiapas, la escuela convive con internet intermitente, grupos multigrado y materiales que no siempre hablan del territorio donde viven los estudiantes. La tecnología educativa suele asumir conexión permanente, cuentas en la nube y video pesado.

**Raíz** parte de lo contrario: aprender debe funcionar **sin señal**, en una laptop o tablet, y con ejemplos de Chiapas.

## 2. La solución (45 s)

Raíz es una **enciclopedia interactiva offline** de primaria y secundaria.

- 9 grados: 1º a 6º de primaria y 1º a 3º de secundaria.
- 6 materias: Matemáticas, Ciencias Naturales, Lengua y Literatura, Historia, Geografía y Programación.
- 42 misiones de 8 a 15 minutos, con **9 historias narradas**.
- **Modo cuento:** voz que lee la historia y acompaña cada paso.
- **Reto rápido:** 10 preguntas en 60 segundos, con racha y récord personal.
- Cada misión: explicación breve, interacción y reto con retroalimentación.
- Voz femenina en español, con selección de voz y lectura de la misión completa: objetivo, ideas y pasos.
- Sonido, progreso local, racha y logros.
- 100 % offline: sin backend, sin login, sin CDN.
- Se instala como app en Android, iPhone, Windows, macOS y Linux.

No es un curso en video. Es un **laboratorio para tocar el concepto**: una tortilla dividida en fracciones, una planta con hotspots, una balanza algebraica, una célula, una línea del tiempo, un mapa de Chiapas y un robot que se programa con bloques.

## 3. Demo (60 s)

1. Abrimos Raíz en la laptop.
2. **Desconectamos el Wi-Fi** frente al jurado.
3. Entramos a **1º de primaria → Lengua → La palabra que se perdió**.
4. Activamos **Modo cuento**: la voz narra la historia; elegimos la palabra amable.
5. Pasamos a **4º de primaria → Matemáticas → Fracciones en la cocina** y ajustamos la tortilla a 3/4.
6. Terminamos la misión: confeti, XP, logro y progreso guardado.
7. Abrimos **1º de secundaria → Programación → El robot de Luci**.
8. Agregamos bloques, ejecutamos y vemos a Luci moverse por el tablero hasta la meta.
9. Abrimos **Reto rápido**: 10 preguntas en 60 segundos, como un Quiz Battle pero sin internet.
10. Abrimos **Mi cuaderno**: XP, una misión completada y avance por materia.
11. Mostramos que la app se puede **instalar** en el teléfono y que también existe el HTML único.
12. Volvemos a conectar. Todo sigue igual.

Frase clave: **“Lo que acabas de ver no usó internet en ningún momento.”**

## 4. Por qué puede ganar (30 s)

- **Pertinencia local:** ejemplos de Chiapas, no contenido genérico.
- **Offline real:** no es una promesa; el service worker y los recursos locales lo demuestran.
- **Aprendizaje activo:** cada concepto se manipula, no solo se lee.
- **Pensamiento computacional sin instalar nada:** Luci se programa con bloques y se ejecuta sin internet.
- **Cuentos con voz:** en los primeros grados la historia se escucha y se elige; el mismo modo acompaña a secundaria.
- **Quiz Battle sin servidor:** el reto rápido toma preguntas de todas las misiones y funciona en un solo dispositivo.
- **Diseño para aulas reales:** funciona en laptops modestas y tablets; no requiere cuentas.
- **Base escalable:** el contenido está separado del motor; se pueden agregar más misiones, materias y lenguas indígenas.

## 5. Impacto y siguientes pasos (15 s)

Métricas del piloto:

- Porcentaje de estudiantes que completan la misión.
- Ganancia en el reto antes/después.
- Tiempo de preparación docente ahorrado.
- Funcionamiento sin conexión en el dispositivo objetivo.

Siguientes pasos:

- Revisión con maestros de Chiapas.
- Versión en tseltal y tsotsil con hablantes nativos.
- Modo docente con reportes de grupo.
- Empaquetado instalable para laptops sin navegador moderno.
- Más materias: Lengua y Literatura, Formación Cívica, Inglés.

## Preguntas que pueden hacerte

**¿Cómo garantizas que el contenido sea correcto?**
Está alineado conceptualmente al Plan 2022 y es un prototipo revisable. Antes de aula se valida con docentes y se contrasta con los libros de texto. No usamos IA para inventar contenido.

**¿Por qué no una app nativa?**
La PWA permite un solo código para laptop y tablet, y el service worker da offline real. Para laptops muy antiguas se puede empaquetar con Tauri/Electron.

**¿Cómo gana dinero o se sostiene?**
Gratis para escuelas públicas; licencias para escuelas privadas, ONG o gobiernos; alianzas de contenido. El costo marginal por estudiante es casi cero porque no hay servidores.

**¿Qué pasa si no hay electricidad?**
El software no resuelve la energía, pero el bajo consumo y el tamaño reducido permiten usarlo en laptops con batería. El contenido también se puede imprimir desde el navegador.

**¿Cómo cuidan los datos?**
No hay cuentas ni servidores. El progreso vive en `localStorage` del dispositivo. No se recopilan datos personales.

**¿Qué los hace diferentes de una enciclopedia?**
Una enciclopedia se lee; Raíz se manipula. Cada misión termina con una decisión, un reto o una simulación, no solo con texto.
