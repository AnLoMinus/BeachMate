# BeachMate 🏖️

BeachMate is an open-source web application that provides real-time beach and sea-related services, designed to enhance your beach experience. Built with modern web technologies, it offers a responsive and intuitive interface for accessing weather updates, beach locations, and various beach activities.

## 🌊 Features

- **Real-time Weather Updates**: Get current weather conditions and sea forecasts
- **Beach Mapping**: Find nearby beaches with distance information
- **Water Sports**: Information about available water sports activities
- **Event Calendar**: Stay updated with beach events and activities
- **Social Sharing**: Easy sharing of beach information with friends
- **Music & Entertainment**: Updates on beach performances and activities

## 🌍 Worldwide Beach Travel

BeachMate now includes worldwide beach travel features:

- Interactive world map with popular beach destinations
- Real-time weather information for beaches worldwide
- Recommended travel seasons based on location
- Integration with Google Maps Platform
- Detailed beach information including ratings and photos

## 🗺️ Google Maps Integration

BeachMate uses Google Maps Platform for:

- Interactive beach mapping
- Location-based services
- Place details and photos
- Real-time navigation
- Beach ratings and reviews

To use the Google Maps features:

1. Get an API key from the [Google Cloud Console](https://console.cloud.google.com)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Replace `YOUR_API_KEY` in scripts.js with your actual API key

## API Key Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API key)
5. Add API key restrictions:
   - Application restrictions: HTTP referrers
   - API restrictions: Select specific APIs
6. Replace `YOUR_ACTUAL_API_KEY` in scripts.js with your key

⚠️ **Security Note**: Never commit your API key to version control. Use environment variables or configuration files that are ignored by git.

## 🚀 Technologies Used

- HTML5
- CSS3 (with modern animations and transitions)
- JavaScript (ES6+)
- Bootstrap 5
- Font Awesome Icons
- Weather API Integration

## 📱 Responsive Design

BeachMate is fully responsive and works seamlessly across:

- Desktop computers
- Tablets
- Mobile devices

## 🛠️ Installation

1. Clone the repository:
