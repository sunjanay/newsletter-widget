// Simple Express server to handle Beehiiv API calls and avoid CORS issues
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all requests
app.use(cors());
app.use(express.json());

// Serve static files with proper headers
app.use(express.static('.', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Serve specific static files
app.get('/styles.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'styles.css'));
});

app.get('/app.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'app.js'));
});

// Serve the main page
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Beehiiv API proxy endpoint
app.get('/api/posts', async (req, res) => {
    try {
        const PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;
        const API_KEY = process.env.BEEHIIV_API_KEY;
        
        if (!PUBLICATION_ID || !API_KEY) {
            return res.status(400).json({ 
                error: 'Missing BEEHIIV_PUBLICATION_ID or BEEHIIV_API_KEY in environment variables' 
            });
        }

        const url = `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/posts?limit=50`;
        
        console.log('Fetching from Beehiiv API:', url);
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Beehiiv API Error:', response.status, errorText);
            return res.status(response.status).json({ 
                error: `Beehiiv API error: ${response.status} ${response.statusText}`,
                details: errorText
            });
        }

        const data = await response.json();
        console.log('Successfully fetched posts:', data.data?.length || 0, 'posts');
        
        // Debug the first post's structure
        if (data.data && data.data[0]) {
            console.log('Sample post structure:', Object.keys(data.data[0]));
            console.log('Date fields in first post:', {
                id: data.data[0].id,
                title: data.data[0].title?.substring(0, 50) + '...',
                created: data.data[0].created,
                publish_date: data.data[0].publish_date,
                published_at: data.data[0].published_at,
                date: data.data[0].date,
                created_at: data.data[0].created_at
            });
        }
        
        res.json(data);

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// For Vercel, export the app
module.exports = app;

// For local development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log('Make sure your .env file contains your Beehiiv credentials');
    });
}