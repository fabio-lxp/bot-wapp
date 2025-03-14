const axios = require('axios');
const util = require('util');

async function getAccessToken() {
    const { GoogleAuth } = require('google-auth-library');
    const auth = new GoogleAuth({
        keyFile: './dialogflow-key.json',
        scopes: ['https://www.googleapis.com/auth/dialogflow']
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    return token.token;
}

async function testDialogflow() {
    try {
        // Obtener token de acceso
        const accessToken = await getAccessToken();
        console.log('Token de acceso obtenido');

        // Configurar la solicitud a Dialogflow
        const sessionId = 'test-' + Date.now();
        const url = `https://dialogflow.googleapis.com/v2/projects/botwhatsapp-453622/agent/sessions/${sessionId}:detectIntent`;
        
        const data = {
            queryInput: {
                text: {
                    text: 'Hola',
                    languageCode: 'es'
                }
            }
        };

        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        console.log('Enviando solicitud a Dialogflow...');
        const response = await axios.post(url, data, { headers });
        
        console.log('Respuesta recibida:');
        console.log(util.inspect(response.data, { depth: null, colors: true }));

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Detalles:', error.response.data);
        }
        }
}

testDialogflow();
