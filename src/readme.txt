 ~!~ WhatTheCard: Business Card SPA with CRM Features ~!~


Welcome to WhatTheCardd, a modern, single-page application (SPA) designed to help users manage and share their business cards seamlessly
. This project includes essential CRM capabilities, ensuring a user-friendly experience with smooth API integration for cards and user management.

-------------------------------------------------------------------

Project Overview ~!~ ~!~
This project is built with the following goals in mind:

Manage Business Cards: Users can create, edit, and share business cards.
CRM Integration: Track and manage user data and card interactions effectively.
API-Driven Architecture: Interacts with a backend API to retrieve, update, and manage card and user information.
SPA (Single Page Application): Ensures a seamless user experience with no unnecessary page reloads.
Responsive & UX-Friendly UI: Optimized for mobile and desktop views to provide an excellent user experience.

-------------------------------------------------------------------

~!~ Project Structure ~!~
The project is structured into key folders, as shown below:

Components/     - Reusable React components used throughout the app.
Media/          - Images and other media assets.
Pages/          - Individual pages of the SPA, including SignIn, SignUp, Home, and more.
Services/       - API and authentication services (e.g., axios setup).
Store/          - Redux state management setup.
Types/          - Type definitions used across the app for better TypeScript support.
validations/    - Input validations using Joi schema.
App.tsx         - Main app component that brings everything together.
index.css       - Global styles for the app.
main.tsx        - Entry point of the application.
vite-env.d.ts   - TypeScript environment setup file.

-------------------------------------------------------------------

~!~ Features ~!~
User Authentication:

Users can register and log in using the SignIn and SignUp pages.
Login attempts are limited to prevent brute-force attacks, with a 15-minute lockout mechanism.
JWT-based authentication and token management.
Business Card Management:

Users can create, edit, and delete business cards.
Supports browsing other users’ cards and adding them to Favorites.
CRM Module:

Integrated CRM features to manage customer data and enhance business relationships.
API Integration:

Uses Axios to interact with a RESTful API for user and card data.
Tokens are managed securely with localStorage.
Friendly UX/UI:

Includes animations (AOS library) for smooth transitions.
Designed with Flowbite-React components for a modern interface.


-------------------------------------------------------------------

~!~ Page Breakdown ~!~

SignIn: Handles user login and provides feedback on failed attempts with a lockout mechanism.

SignUp: Allows users to register and create an account.

CreateCard: Enables users to create personalized business cards.

Profile: Displays user information and their created cards.

CRM Dashboard: Provides tools for managing user interactions and tracking customer relationships.

------------------------------------------------------------------

~!~ Installation and Setup ~!~

To run this project locally, follow these steps:

Clone the repository:

bash
Copy code
git clone https://github.com/edenlesnik/WhatTheCardd.git
cd WhatTheCardd
Install dependencies:

bash
Copy code
npm install
Start the development server:

bash
Copy code
npm run dev
Build the project for production:

bash
Copy code
npm run build
Run the built version:

bash
Copy code
npm run preview

How Login Attempts Work******
This project ensures security by tracking login attempts using localStorage. After 3 failed attempts, the user is locked out for 15 minutes. The lock timer is reset automatically after this period.

------------------------------------------------------------------

~!~ Technologies Used ~!~
Frontend: React, TypeScript, TailwindCSS, Flowbite-React, AOS
State Management: Redux
Form Validation: Joi with React-Hook-Form
API Handling: Axios
Routing: React Router
Build Tool: Vite
