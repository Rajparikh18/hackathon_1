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
    import.meta.env.APPLICATION_TOKEN
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
            import.meta.env.FLOW_ID1,
            import.meta.env.FLOW_ID2,
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