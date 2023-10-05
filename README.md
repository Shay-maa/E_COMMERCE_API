# E-Commerce API

This is an E-Commerce API built using Express.js, MongoDB, and other technologies to provide a robust backend for an e-commerce application.
<br>
<br>
<h2>Getting Started</h2>
<h2>Prerequisites</h2>
<p>Before you begin, ensure you have met the following requirements:</p>
<br/>
<ul>
<li>Node.js and npm installed on your machine.</li>
<li>MongoDB installed and running.</li>
<li>Git (optional, for cloning the repository).</li>
</ul>

<h2>Installation</h2>
<ol>
    <li>Clone the repository (if you haven't already):</li>
</ol>

<pre><code>git clone https://github.com/Shay-maa/e-commerce-api.git
cd e-commerce-api
</code></pre>

<ol start="2">
    <li>Install dependencies:</li>
</ol>

<pre><code>npm install
</code></pre>
<ol start="3">
    <li>Configure environment variables as needed (e.g., database connection details, API secrets).</li>
    <li>Start the server:</li>
</ol>

<pre><code>npm start
</code></pre>

<h2>Features</h2>
<ul>
  <li>Create a server using Express.js with nodemon for automatic reloading.</li>
  <li>Log HTTP requests using Morgan.</li>
  <li>Connect to MongoDB to store and retrieve data.</li>
  <li>Implement CRUD operations for categories, subcategories, brands, and products.</li>
  <li>Handle errors gracefully using error-handling middleware.</li>
  <li>Implement reusable error classes for better error management.</li>
  <li>Support development and production error handling environments.</li>
  <li>Handle unhandled routes and send errors to the error-handling middleware.</li>
  <li>Implement validation layers for input data.</li>
  <li>Configure ESLint for code linting.</li>
  <li>Use Mongoose middleware for various operations.</li>
  <li>Utilize Multer for file uploading.</li>
  <li>Employ Sharp library for image processing.</li>
  <li>Support single and multiple file uploads.</li>
  <li>Save image names in the database and return URLs in the response.</li>
</ul>

