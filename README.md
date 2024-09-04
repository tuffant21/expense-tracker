# Expense Tracking System
This project is a Expense Tracking System that allows users to manage their bills, including features such as adding, 
updating, and deleting bills, with support for auto-pay, due dates, and balance tracking. It is built with Node.js, 
Express, and MongoDB, and is containerized using Docker. This project is built primarily by ChatGPT.

## Screenshots
![application](/screenshots/application.jpeg)

## Features
* Add, Edit, and Delete Bills: Users can manage their bills, including specifying due dates, balances, and payment 
details.
* Auto-Pay Management: Toggle auto-pay for each bill.
* Date Picker: Use a calendar dialog for selecting the last payment date of each bill.
* Currency Formatting: All balances and due amounts are automatically formatted as currency with two decimal places.
* Docker Support: The project includes a Docker setup, making it easy to run the application and MongoDB in containers.
* Data Initialization: Provides an initialization script to seed MongoDB with sample bill data.

## Project Structure
```bash
├── .env                   # Environment variables
├── .nvmrc                 # Node.js version file
├── Dockerfile             # Dockerfile for the application
├── docker-compose.yml     # Docker Compose setup for MongoDB and the Express app
├── init-data.js           # Script to seed the MongoDB database with sample data
├── package.json           # Node.js dependencies and scripts
├── server.js              # Express.js server with REST API for managing bills
└── public/                # Static files for the frontend (HTML, CSS, JS)
```

## Prerequisites
Before running this project, ensure you have the following installed:

* Node.js (version specified in .nvmrc)
* Docker (for running the containers)

## Environment Variables
You will need to set the following environment variables in the .env file:

```env
MONGO_URL=mongodb://root:example@localhost:27017
MONGO_DB=bills-db
MONGO_COLLECTION=bills
```

The default MongoDB credentials and URL are specified in docker-compose.yml.

## Setup and Installation
1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```
2. Install Dependencies

Install the Node.js dependencies using the following command:
```bash
npm install
```

3. Run docker build

There is a docker file that needs to be build for the docker compose to work. You can build it with this command:

```bash
npm run docker:build
```

4. Run the Project

You can run the project using Docker:

```bash
npm run docker:compose:up
```
This command will start the MongoDB service and the Express.js application.

5. Seed the Database

To seed the MongoDB database with initial data, run the following command:

```bash
node init-data.js
```
This script connects to MongoDB and inserts a sample dataset into the bills collection.

## API Endpoints
The following REST API endpoints are available for interacting with the bills:

* GET /api/bills 
  * Fetch all bills.
* POST /api/bills
  * Add a new bill.
* PUT /api/bills/:id
  * Update an existing bill by ID.
* DELETE /api/bills/:id
  * Delete a bill by ID.

## Sample Bill JSON Structure
```json
{
    "bill": "Phone",
    "dueDate": "1st day of month",
    "autoPay": false,
    "due": "135.80",
    "balance": "1466.52",
    "website": "Val Eichhorn",
    "lastPaymentDate": "08/04",
    "disabled": false
}
```

## Frontend
The project includes a frontend (in the public folder) that displays the list of bills in a table format. Users can:

* Edit any field, including bill amounts and due dates.
* Enable or disable bills.
* Delete bills with confirmation.
* Add new bills using the form.
* Sort the table by column.
* Use a calendar dialog for selecting the last payment date.

## Docker
The project uses Docker and Docker Compose to simplify the setup. Here's a quick overview of the containers:

* MongoDB: A MongoDB service for storing bill data.
* Bill Service: An Express.js application for serving the frontend and providing the REST API.

## Build and Run
To build and run the application in containers:

```bash
npm run docker:compose:up
```

This will start the app on port 3000 (by default) and MongoDB on port 27017.

## License
This project is licensed under the MIT License.
