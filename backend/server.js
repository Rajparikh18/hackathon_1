const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Using Axios for HTTP requests

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Langflow Client Class
class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }
    async post(endpoint, body) {
        try {
            const response = await axios.post(`${this.baseURL}${endpoint}`, body, {
                headers: {
                    "Authorization": `Bearer ${this.applicationToken}`, // Add your application token here
                    "Content-Type": "application/json",
                },
            });
            console.log("response from line 26 is ",response);
            return response.data;
        } catch (error) {
            console.error('Request Error:', error.message);
            throw error;
        }
    }
    async runFlow(flowIdOrName, langflowId, inputValue, inputType = 'chat', outputType = 'chat') {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowIdOrName}`; // Replace with your Langflow IDs
        const body = {
            input_value: inputValue,
            input_type: inputType,
            output_type: outputType,
        };
        return this.post(endpoint, body);
    }
}
// Initialize Langflow Client
const langflowClient = new LangflowClient(
    'https://api.langflow.astra.datastax.com', // Replace with your base API URL
    'AstraCS:ScCfkpFrZwljuriRxLCpFLAd:7cc1cacd4f3bf19208e7c2bb7da30f155cbfbef82f5781f67879c3b07f4b5662' // Replace with your application token
);
// API endpoint for handling chat messages
app.post('/api/chat', async (req, res) => {
    const { message } = req.body; // Extract message from request body
    console.log('Received message:', message);
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await langflowClient.runFlow(
            '6ba1cf1f-f0be-40de-ba87-3dc0c6630c6c', // Replace with your flow ID
            '22c0277d-7cf1-499a-bcef-6bd3be691afe', // Replace with your Langflow ID
            message
        );

        // Extract and return the response from Langflow
        if (response && response.outputs) { 
            console.log("Response from Langflow:", response.outputs[0].outputs[0].artifacts.message);
            const outputMessage = response.outputs[0].outputs[0].artifacts.message; // Adjust based on Langflow's response format
            res.json({ response: outputMessage });
        } else {
            res.status(500).json({ error: 'No output from Langflow' });
        }
    } catch (error) {
        console.error('Error handling chat request:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
