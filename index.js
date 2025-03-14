const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');

// Configuración del cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "bot-restaurante"
    }),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ],
        headless: true
    }
});

// Configuración de Dialogflow
const DIALOGFLOW_PROJECT_ID = 'botwhatsapp-453622';

// Función para obtener el token de acceso de Google
async function getAccessToken() {
    const auth = new GoogleAuth({
        keyFile: './dialogflow-key.json',
        scopes: ['https://www.googleapis.com/auth/dialogflow']
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    return token.token;
}

// Función para obtener respuesta de Dialogflow
async function getDialogflowResponse(message, sessionId) {
    try {
        const accessToken = await getAccessToken();
        const url = `https://dialogflow.googleapis.com/v2/projects/${DIALOGFLOW_PROJECT_ID}/agent/sessions/${sessionId}:detectIntent`;
        
        const data = {
            queryInput: {
                text: {
                    text: message,
                    languageCode: 'es'
                }
            }
        };

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.post(url, data, { headers });
        return response.data.queryResult.fulfillmentText;
    } catch (error) {
        console.error('Error al obtener respuesta de Dialogflow:', error);
        return 'Lo siento, hubo un error al procesar tu mensaje.';
    }
}

// Generar código QR
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Escanea el código QR con WhatsApp para iniciar sesión');
});

// Cuando el cliente está listo
client.on('ready', () => {
    console.log('Cliente WhatsApp listo!');
});

// Manejar mensajes entrantes
client.on('message', async msg => {
    if (msg.body.length === 0) return;

    try {
        // Usar el número de teléfono como ID de sesión
        const sessionId = msg.from.replace('@c.us', '');
        
        // Obtener respuesta de Dialogflow
        const response = await getDialogflowResponse(msg.body, sessionId);
        
        // Enviar respuesta al usuario
        if (response) {
            msg.reply(response);
        }
    } catch (error) {
        console.error('Error:', error);
        msg.reply('Lo siento, hubo un error al procesar tu mensaje.');
    }
});

// Manejar errores de autenticación
client.on('auth_failure', msg => {
    console.error('Error de autenticación:', msg);
});

// Iniciar el cliente
client.initialize();
