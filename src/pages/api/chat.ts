import type { APIRoute } from 'astro';
import axios from 'axios';

class LangflowClient {
    private baseURL: string;
    private applicationToken: string;

    constructor(baseURL: string, applicationToken: string) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }

    async post(endpoint: string, body: any) {
        try {
            const response = await axios.post(`${this.baseURL}${endpoint}`, body, {
                headers: {
                    "Authorization": `Bearer ${this.applicationToken}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error('Request Error:', error);
            throw error;
        }
    }

    async runFlow(flowIdOrName: string, langflowId: string, inputValue: string, inputType = 'chat', outputType = 'chat') {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowIdOrName}`;
        const body = {
            input_value: inputValue,
            input_type: inputType,
            output_type: outputType,
        };
        return this.post(endpoint, body);
    }
}

// Initialize client outside the handler
const langflowClient = new LangflowClient(
    'https://api.langflow.astra.datastax.com',
    'AstraCS:pFhTjYYiDSUAzRnucAIWPpSA:411c05aae4d6e3ab030b5478214512c8a895c36a1a4fdeac88fcfa9a98b454b6'
);

export const POST: APIRoute = async ({ request }) => {
    try {
        console.log('Hello there from route');
        const { message } = await request.json();

        if (!message) {
            return new Response(JSON.stringify({ error: 'Message is required' }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const response = await langflowClient.runFlow(
            'bf2fa8d0-4746-402e-a23d-4814e99b0345',
            '63d336fa-2a2c-41aa-bd05-13e1d71b3694',
            message
        );

        if (response && response.outputs) {
            const outputMessage = response.outputs[0].outputs[0].artifacts.message;
            return new Response(JSON.stringify({ response: outputMessage }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            return new Response(JSON.stringify({ error: 'No output from Langflow' }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

    } catch (error) {
        console.error('Error handling chat request:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};