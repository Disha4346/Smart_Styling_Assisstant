# Smart Styling Assistant – Frontend

## Overview

This is the **frontend application** for the Smart Styling Assistant project.
It provides the user interface for authentication, outfit recommendations, occasion-based styling, and price comparison.

The frontend is built using **React** and communicates with the backend APIs to fetch styling suggestions and user data.

---

## Features

* User Authentication (Login / Register)
* Protected Dashboard
* Occasion-Based Outfit Suggestions
* AI Styling Page
* Outfit Recommendation Interface
* Price Comparison Page
* Responsive UI

---

## Project Structure

```
frontend
│
├── public
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src
│   ├── components
│   │   └── ProtectedRoute.js
│   │
│   ├── context
│   │   └── AuthContext.js
│   │
│   ├── pages
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── AIStylingPage.js
│   │   ├── OccasionDetail.js
│   │   ├── OccasionExplore.js
│   │   ├── OutfitRecommendation.js
│   │   └── PriceComparison.js
│   │
│   └── styles
│       ├── Auth.css
│       └── Dashboard.css
│
└── package.json
```

---

## Installation

Navigate to the frontend folder:

```
cd frontend
```

Install dependencies:

```
npm install
```

Start the development server:

```
npm start
```

The application will run on:

```
http://localhost:3000
```

---

## Tech Stack

* React
* JavaScript
* CSS
* Context API (Authentication State)
* REST API Integration

---

## Integration

The frontend communicates with the backend server to:

* Authenticate users
* Retrieve outfit recommendations
* Fetch product prices
* Handle styling suggestions

---

## Future Improvements

* Avatar-based outfit try-on
* AI-generated styling suggestions
* Improved UI/UX
* Mobile responsiveness
* Fashion dataset integration
