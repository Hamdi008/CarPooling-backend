# Express Server

This project is a Node.js server using the Express framework.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Usage](#usage)
    - [Start the Server](#start-the-server)
    - [Configuration](#configuration)
---

## Prerequisites

Before running this project, ensure you have the following software installed:

- **Node.js** (v14 or higher recommended): [Download Node.js](https://nodejs.org/)
- **npm**: This comes with Node.js and is used to manage project dependencies.

## Installation

1. Clone this repository or download the project files to your local machine.
2. Open a terminal and navigate to the project's root directory.
3. Install the dependencies by running:

   ```bash
   npm install

## Usage
1. Start the Server
- Using node: node server.js
- Using nodemon: npm install -g nodemon
                 nodemon server.js
2. Configuration
The server is set to listen on port 3000 by default. To change the port, open server.js and modify the following line:
const port = YOUR_NEW_PORT_NUMBER;
Replace YOUR_NEW_PORT_NUMBER with the desired port number.
