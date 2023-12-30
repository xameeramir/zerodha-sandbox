# zerodha-sandbox
This repository is the code for the [Free Zerodha APIs sandbox environment](https://nordible.com/zerodha-sandbox/) provided by nordible

## Run it locally

1. Clone the repository

    ```bash
    git clone https://github.com/nordible/zerodha-sandbox.git
    ```

2. Go to the project directory

    ```bash
    cd zerodha-sandbox
    ```

3. Install npm packages

    ```bash
    npm i
    ```

4. Execute

    ```bash
    npm start
    ```

## Docker Deployment (Contribution by Roney Dsilva)

### Prerequisites
- Docker installed on your system

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/nordible/zerodha-sandbox.git
    ```

2. Navigate to the project directory:

    ```bash
    cd zerodha-sandbox
    ```

3. Use the provided Docker Compose file to set up the environment:

    ```bash
    docker-compose up --build
    ```

4. Access the application via `http://localhost:3000` in your web browser.

This Docker deployment utilizes a PostgreSQL database and runs the Zerodha sandbox environment. Ensure you have Docker installed and running on your machine.

### Environment Variables
- `NODE_ENV`: Set to 'production'
- `DB_USER`: Database user name (e.g., `db_user`)
- `DB_HOST`: Database host (e.g., `postgres`)
- `DB_NAME`: Database name (e.g., `zerodha_db`)
- `DB_PASSWORD`: Database password (e.g., `zerodha_password`)

## Running Locally

For local development or manual setup, refer to the steps mentioned earlier in this README under "Running Locally."


## Collaborations are most welcome!
Collaborations [pull requests](https://github.com/nordible/zerodha-mock-apis/pulls) are welcome!

## Bugs and Issues

Have a bug or an issue with? [Open a new issue](https://github.com/nordible/zerodha-mock-apis/issues) here on GitHub.

## Copyright and License

Code licensed under [MIT](https://opensource.org/licenses/MIT). Everything else is [CC](http://creativecommons.org/)

## &copy; nordible

* [nordible](http://nordible.com/)
* [twitter.com/nordiblehq](https://twitter.com/nordiblehq)
* [fb.com/nordible](https://www.facebook.com/nordible)

