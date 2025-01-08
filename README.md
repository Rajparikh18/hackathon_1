# AI Chatbot for Social Media Performance Analysis

This project is a basic chatbot designed to analyze social media performance. It uses **LangFlow** for creating workflows, **Astra DB** for database operations, and integrates **React**, **TailwindCSS**, and **ShadCN components** for the frontend.

## Setup Instructions

### Prerequisites
- **Node.js** (>= 16.x)
- **NPM** or **Yarn**
- **Astra DB Account**

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file and add:
   ```env
   ASTRA_DB_ID=<your-db-id>
   ASTRA_DB_REGION=<your-region>
   ASTRA_DB_APPLICATION_TOKEN=<your-app-token>
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:4321`.

## About the Chatbot

The chatbot analyzes social media posts and engagement data. It provides insights like:
- Which post types (carousel, reels, static images) perform better.
- Engagement comparisons (e.g., likes, shares, comments).

We used GPT in LangFlow to process the data and generate these insights. For example:
- "Reels drive twice as many comments as static images."
- "Carousel posts have 20% higher engagement than other formats."

Let us know if you need help setting up or have any questions!

