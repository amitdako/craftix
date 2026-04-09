# Craftix

> A social network aimed at sharing DIY projects, and watching and gaining inspiration from others' projects.

## About the Project

The primary goal of this project was to build a high-performance discovery tool where users can gain inspiration from others' projects. To achieve this, I implemented a dual-feed system:

- **Topical Feeds:** Curated streams focused on specific DIY niches (e.g., Woodworking, Tech, Home Decor).
- **Global Discovery:** A seamless, vertical scrolling feed designed for broad exploration.

## Tech Stack

- **Frontend:** React.js, React Router.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB.
- **Cloud & Storage:** AWS, Multer (for multipart/form-data handling).
-

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community) - Make sure the MongoDB service is running locally on the default port (`27017`).

## 🏗️ Architecture & Workflow

The architecture of Craftix is designed for scalability and a clean separation of concerns, ensuring a robust Fullstack environment:

### 1. Frontend (Client-Side)

- **Single Page Application (SPA):** Built with React.js to provide a fast, app-like experience without page reloads.
- **Modular Component Design:** Each UI element (Post, Navbar, Category Feed) is a self-contained component, making the codebase maintainable and reusable.
- **State Management & Routing:** Uses React Hooks and React Router to handle dynamic content fetching and seamless navigation between DIY categories and the main feed.

### 2. Backend (Server-Side)

- **RESTful API:** Developed with Node.js and Express to manage the flow of data between the user and the database.
- **Security & Auth:** Handles user authentication and secure data transactions.
- **Multipart Data Handling:** Uses `Multer` middleware to parse incoming project data, efficiently managing both textual metadata (titles, descriptions) and media files.

### 3. AWS Integration & Storage

- **Cloud Storage (Amazon S3):** Instead of storing heavy media files directly on the server, Craftix utilizes AWS S3. This ensures high availability and fast loading times for project images and assets.
- **Lightweight Database Strategy:** The database (MongoDB) only stores the metadata and the unique AWS S3 URL. This "Pointer" strategy keeps the database highly performant and prevents storage bloat.
- **Global Content Delivery:** By serving assets through AWS, the platform ensures that project inspiration is delivered quickly to users, regardless of their location.

## Getting Started

Note for Recruiters & Evaluators: To save your time, a full demonstration of the platform's functionality is available in the Preview Video above.
If you wish to run the code locally to review the architecture, you can do so using a local database. AWS keys are only required if you want to test the image upload feature.

## Prerequisites

Node.js (v16.x or higher)
MongoDB (A local instance running on your machine is sufficient)
(Optional) AWS S3 Bucket (Only needed to test the image upload functionality)

## Installation Steps:

```
git clone https://github.com/amitdako/craftix.git
```

```
cd craftix
```

## Backend Setup:

```
cd server
```

```
npm install
```

Create a .env file in the server root directory:

```
bash
touch .env
```

Open the new .env file and add the following variables. (Note: Replace the dummy values with your actual MongoDB connection string and a secure secret key):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/craftix
JWT_SECRET=put_your_own_secret_here

```

=======

```
cd server
```

```
npm install
```

Create a .env file in the server root directory.

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/craftix
```

and start the server:

```
npm run dev
```

#### Optional: Add AWS keys to enable image uploading

```
npm run dev
```

## Frontend Setup:

```
cd client
```

```
npm install
```

```
npm run dev
```

Open your browser and navigate to (http://localhost:5173/)

- **Preview:** ![demo](show.gif) — _Watch this quick preview to see Craftix in action!_
