# Northcoders News API

https://news-api-9k2x.onrender.com

A news api allowing users to use CRUD (Create, Read, Update, Delete) operations to interact with the database

## Setup
Must be on node v20.5.0 or later and psql version 14.9 or later

1.  Clone the repo.
----
            
            Press the green "<> code" button at the top of the reop and copy the link.
    
         
            * Press the green "<> code" button at the top of the reop and copy the link.
            * open up the terminal and select a folder to clone the repo into and then run the command "git clone <copied link>"
            * "run npm install" to install the project depenedncies
            * "run np  install -D" to install the dev dependencies


\
\
2.  Add .env.<enviroment> files with a single line of code setting the enviroment to connect to each database

----
        .env.development
            PGDATABASE=development
        
        .env.test
            PGDATABASE=test

        .env.production
            DATABASE_URL=<your_url>

3.  Create and seed the database

----
        * Open up the terminal and run "npm setup-dbs"
        * Then run the seed command "npm seed"

*The api should now be succesfully installed and ready for use*

\
\
\
__Scripts__

        "npm setup-dbs" - Drops the databases and then creates them again.
        "npm seed" - seeds the database with the data decided by the enviroment variable.
        "npm test" - runs jests testing script, running all tests
        "npm prepare" - sets up husky, only letting commits if no tests fail
        "npm start" - starts up the server to listen for incoming requests
        "npm seed-prod" - sets the NODE_ENV to production and then runs the seed script
