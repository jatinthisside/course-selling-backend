# Course Selling Platform Backend

This is the backend API for a simple Course Selling Platform built using Express.js, Sequelize, and MySQL. The application allows admins to manage courses, and users to view courses.

## Features

- **User Registration**: Users can create an account by providing basic details.
- **Admin Access**: Admins can create, update, and delete courses.
- **Course Management**: Users can view available courses.
- **Sequelize ORM**: Uses Sequelize for interacting with the MySQL database.
  
## Tech Stack

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building the API.
- **Sequelize**: ORM for MySQL database management.
- **MySQL**: Database for storing user and course data.
- **Dotenv**: For managing environment variables.

## Requirements

- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)

## Installation

Follow the steps below to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/course-selling-platform-backend.git
2. **Navigate to the project folder**:
   ```bash
   git clone https://github.com/your-username/course-selling-platform-backend.git
3. **Clone the repository**:
   ```bash
   cd course-selling-platform-backend
4. **Install dependencies**:
   ```bash
   npm install
5. **Set up environment variables**:
   ```env
   DB_USERNAME=your-database-username
   DB_PASSWORD=your-database-password
   JWT_SECRET=localhost
   PORT=3000
6. **Create the database**:
   ```mysql server
   CREATE DATABASE coursedb;
1. **Run the server**:
   ```bash
   npm start
