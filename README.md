# Newsletter Blog Widget

A beautiful, responsive newsletter blog widget that displays your latest Beehiiv newsletter posts in a clean blog-style layout.

## Features

- 🎨 **Modern Blog Layout** - 3 cards per row on desktop, responsive design
- 📱 **Fully Responsive** - Adapts to all screen sizes (3→2→1 columns)
- 🔄 **Real-time Updates** - Fetches latest posts from Beehiiv API
- ⚡ **Fast Loading** - Optimized with loading states and error handling
- 🎭 **Smooth Animations** - Hover effects and loading animations
- 🔧 **Easy Setup** - Simple configuration with environment variables

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your Beehiiv credentials in `.env`:**
   ```env
   BEEHIIV_PUBLICATION_ID=your_publication_id
   BEEHIIV_API_KEY=your_api_key
   PORT=3001
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Visit your widget:**
   ```
   http://localhost:3001
   ```

## API Configuration

### Required Environment Variables

- `BEEHIIV_PUBLICATION_ID` - Your Beehiiv publication ID (format: `pub_xxxxxxxxx`)
- `BEEHIIV_API_KEY` - Your Beehiiv API key from your account settings

### Optional Environment Variables

- `PORT` - Server port (default: 3001)
- `BEEHIIV_LIST_ID` - Specific list ID (optional)

## Project Structure

```
windsurf-project/
├── server.js          # Express server with API proxy
├── app.js             # Frontend JavaScript
├── index.html         # Main HTML file
├── styles.css         # CSS styling
├── package.json       # Dependencies and scripts
├── .env              # Environment variables
└── README.md         # This file
```

## Features Overview

### Blog-Style Layout
- Image prominently displayed at the top of each card
- Title, subtitle, and description below the image
- Consistent card heights using flexbox
- Professional typography and spacing

### Responsive Design
- **Desktop (1024px+):** 3 cards per row
- **Tablet (768px-1024px):** 2 cards per row  
- **Mobile (< 768px):** 1 card per row

### API Integration
- Fetches posts from Beehiiv API via server proxy
- Handles CORS issues with Express middleware
- Error handling and loading states
- Automatic retries and graceful fallbacks

## Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server

### Server Endpoints

- `GET /` - Serves the main widget interface
- `GET /api/posts` - Proxy endpoint for Beehiiv API

## Troubleshooting

### Common Issues

1. **"Missing credentials" error**
   - Ensure your `.env` file has the correct `BEEHIIV_PUBLICATION_ID` and `BEEHIIV_API_KEY`

2. **Posts not loading**
   - Check browser console for API errors
   - Verify your API key has the correct permissions
   - Ensure your publication ID is correct

3. **Server won't start**
   - Check if port 3001 is already in use
   - Run `npm install` to ensure all dependencies are installed

### Debug Mode

Open browser Developer Tools (F12) → Console tab to see detailed API logs and error messages.

## Customization

### Styling
Edit `styles.css` to customize:
- Colors and gradients
- Card dimensions and spacing
- Typography and fonts
- Animation effects

### Layout
Modify the grid layout in `styles.css`:
```css
.posts-container {
    grid-template-columns: repeat(3, 1fr); /* Change number for different layout */
}
```

## Dependencies

- **express** - Web server framework
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## License

ISC