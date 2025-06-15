# Tickens – transforma tus tickets en conocimiento financiero

Tickens es una aplicación móvil que digitaliza tus tickets de compra y los convierte en *insights* accionables sobre tu gasto.
Mediante un _pipeline_ OCR + LLM, la app extrae cada línea del recibo, la categoriza y la guarda en un backend escalable basado en microservicios.
Así obtienes analíticas detalladas, presupuestos inteligentes y predicciones de consumo sin picar un solo número.

## Características principales

- **Escaneo multiformato**: foto desde cámara, imagen de galería o PDF — todo acaba en el mismo flujo automático.
- **Extracción de datos de alta precisión** gracias al preprocesado con OpenCV + Tesseract y al servicio LLM (GPT-4o-mini) que devuelve JSON listo para persistir.
- **Paneles interactivos** de gasto por categoría, tienda o periodo, con alertas en tiempo real cuando te acercas al presupuesto.
- **Predicciones y sugerencias** de ahorro basadas en tu histórico.
- **Autenticación JWT y sincronización segura** entre móvil y backend.
- **Arquitectura modular** con microservicios dockerizados, ideal para escalar o sustituir componentes sin tocar el núcleo.
- **Cobertura de pruebas > 90 %** en los endpoints críticos gracias a Jest, Supertest y Mongo-Memory-Server.

## Stack tecnológico

| Capa              | Tecnologías                                   | Motivos clave                                                                 |
|-------------------|-----------------------------------------------|-------------------------------------------------------------------------------|
| **App móvil**     | React Native + TypeScript + Expo              | UI nativa multiplataforma, recarga en caliente y tipado estático.             |
| **Backend API**   | Node.js 20 · Express 5                        | Rapidez, ecosistema npm y perfecta integración con JWT.                       |
| **Base de datos** | MongoDB 6 · Mongoose                          | Documentos flexibles y escalables, perfectos para JSON estructurado.          |
| **OCR Service**   | Flask · OpenCV · Pytesseract                  | Pipeline robusto de limpieza y extracción de texto desde imagen.              |
| **LLM Service**   | Flask · OpenAI SDK · Pydantic                 | Interpretación semántica del ticket a estructura validada.                    |
| **Orquestación**  | Docker · Docker Compose                       | Despliegue reproducible y portable en un solo comando.                        |
| **Testing**       | Jest-Expo · Supertest · mongodb-memory-server | Pruebas completas en frontend y backend con base de datos simulada.           |

## Arquitectura en alto nivel
Mobile App (React Native)
│
▼
API Gateway (Express) ───► MongoDB
│
├──► OCR Service (Flask + OpenCV + Tesseract)
└──► LLM Service (Flask + GPT-4o-mini)

La separación en microservicios permite escalar de forma independiente el procesamiento de imágenes (CPU) y el análisis semántico sin impactar el resto de la plataforma.

## Roadmap breve

- Integración **CI/CD** con GitHub Actions para tests automáticos y despliegue de contenedores.  
- **Sincronización con entidades bancarias (PSD2)** para reconciliar movimientos con tickets.  
- Sustitución de reglas heurísticas por un **motor de recomendaciones basado en ML**.  

## Instalación y ejecución

## Instalación y ejecución local

### Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Docker + Docker Compose](https://docs.docker.com/get-docker/)
- Un dispositivo móvil físico o emulador compatible con Expo (Android/iOS)
- Una cuenta en [OpenAI](https://platform.openai.com/) y una clave de API válida
- Node.js 20 y npm instalados en el sistema (solo para el frontend)

---

### Pasos de instalación

1. **Clona el repositorio y copia el archivo de entorno:**

    ```bash
   cp .env.template .env
    ```

Rellena los valores necesarios en `.env`, como las claves de OpenAI, URLs internas, etc.

2. **Arranca los servicios backend (API + OCR + LLM + MongoDB) con Docker:**

   ```bash
   docker compose up --build
   ```

   Esto construirá y levantará todos los contenedores necesarios. La primera vez puede tardar unos minutos.

3. **Lanza el frontend móvil con Expo:**

   ```bash
   cd frontend
   npx expo start
   ```

   Esto abrirá Metro Bundler en tu navegador y generará un código QR.

4. **Abre la app en tu dispositivo:**

   * Escanea el **código QR** con la app oficial de Expo Go (disponible en App Store / Play Store).
   * También puedes ejecutar en emulador o usar el enlace web desde Expo si estás en modo desarrollo.

5. **¡Listo!**

   Ya puedes probar la app de Tickens.

---

### Notas adicionales

* Puedes detener todos los servicios con `Ctrl+C` y luego `docker compose down` para limpiar contenedores.
* Si tienes problemas con Expo, asegúrate de que tu red local permita la conexión entre PC y móvil.


### Última APK estable

> _En construcción_

## Licencia

Este proyecto forma parte de un **Trabajo Fin de Grado (TFG)** desarrollado en la **Universidad de Granada (UGR)**.

La propiedad intelectual del código y los contenidos pertenece al autor y a la UGR, conforme a la normativa vigente de la institución.

**No se permite la reproducción, redistribución ni modificación del código sin autorización expresa.**

El repositorio es público únicamente con fines académicos, de transparencia y evaluación.

Para cualquier uso distinto, contacta con el autor.
