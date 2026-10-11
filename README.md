🛒 বাজার দর | BazarDor

BazarDor is a responsive web application that helps users explore the daily prices of essential products in Bangladesh. Users can browse products, explore categories, compare prices, view product details, and manage their profiles.

📖 Project Overview

BazarDor makes everyday market prices easier to explore through a clean, responsive, and user-friendly interface. The application displays essential products such as rice, lentils, oil, vegetables, fish, meat, eggs, milk, and spices.

This project is developed as part of the B14-A7-Bazar Dor Web Development Assignment.

✨ Key Features

- Responsive Navbar: Brand logo, Bangla date, category navigation, and authentication controls.
- Price Ticker: Scrolling market-price information with product names and price changes.
- Hero Section: Banner with a call-to-action that scrolls to the all-products section.
- Product Sections: Separate sections for products with rising and falling prices.
- Product Catalog: Responsive product cards with names, units, prices, and price-change indicators.
- Category Browsing: Explore products by category.
- Price Sorting: Sort products by default order, lowest price, or highest price.
- Product Details: View product descriptions and market-price summaries.
- Protected Routes: Require authentication to access protected product details.
- Authentication: Sign up, sign in, and sign out using Better Auth.
- Social Login: Google and GitHub authentication when configured.
- Profile Management: Update account information, including the user's name.
- Toast Notifications: Display success and error messages for supported actions.
- Loading States: Show loading indicators while product data is being fetched.
- Friendly 404 Pages: Help users return to the homepage from invalid routes.
- Shared Layout: Consistent Navbar and Footer across application pages.

🛠️ Technologies Used

Technology| Purpose
Next.js| Application framework and routing
React| User interface components
TypeScript| Type-safe development
Tailwind CSS| Responsive styling
Better Auth| Authentication and account management
SQLite| Authentication database
REST API| Product and category data
React Hot Toast| Notifications
Lucide React| Icons
Git and GitHub| Version control and repository hosting
Vercel| Deployment, if used

🔌 API Configuration

Base URL

https://openapi.programming-hero.com/api/bazardor

Available Endpoints

Endpoint| Description
"/products"| Get all products
"/products?category=chal"| Filter products by category
"/products/1"| Get a single product
"/categories"| Get all categories
"/categories/chal"| Get a single category

The application uses the configured API base URL to retrieve product and category information.

📄 Application Routes

Route| Description
"/"| Homepage and product sections
"/category/[slug]"| Category products and sorting
"/product/[slug]"| Protected product details
"/signin"| User login
"/signup"| User registration
"/profile"| Profile management
Not Found| Friendly invalid-route page

⚙️ Installation and Setup

Prerequisites

- Node.js
- npm
- Git

1. Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_URL

2. Open the Project Directory

cd assignment-7

3. Install Dependencies

npm install

4. Configure Environment Variables

Create a ".env" file if required by your project. Configure the Better Auth secret, application URL, database settings, and OAuth credentials according to your implementation.

Keep all secrets and private credentials out of GitHub.

5. Run the Development Server

npm run dev

Open "http://localhost:3000" (http://localhost:3000) in your browser.

6. Build the Application

npm run build

🔐 Authentication and Profile Management

Better Auth is used for user authentication and account management. Signed-in users can access protected product details and update supported profile in