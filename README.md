# Bot de WhatsApp con Dialogflow

Bot de WhatsApp que utiliza Dialogflow para procesar lenguaje natural y responder automáticamente a los mensajes.

## Configuración

1. Renombra `dialogflow-key.example.json` a `dialogflow-key.json`
2. Reemplaza los valores en `dialogflow-key.json` con tus credenciales de Dialogflow
3. Instala las dependencias:
```bash
npm install
```
4. Ejecuta el bot:
```bash
node index.js
```

## Despliegue en Render

1. Crea una cuenta en [Render](https://render.com)
2. Conecta tu repositorio de GitHub
3. Crea un nuevo Web Service
4. Configura las siguientes variables de entorno:
   - Copia el contenido de tu `dialogflow-key.json` y guárdalo como variable de entorno `DIALOGFLOW_CREDENTIALS`

## Características

- Integración con WhatsApp Web
- Procesamiento de lenguaje natural con Dialogflow
- Respuestas automáticas configurables
- Soporte para múltiples idiomas

## Uso

- Envía mensajes al número de WhatsApp vinculado
- El bot procesará los mensajes usando Dialogflow y responderá automáticamente

## Notas Importantes

- Mantén WhatsApp Web abierto para que el bot funcione
- No cierres la terminal donde se ejecuta el bot
- Las credenciales de Dialogflow son privadas, no las compartas
