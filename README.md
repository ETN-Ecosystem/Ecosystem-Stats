# ETN Ecosystem Statistics Dashboard

## Overview

This repository contains the source code for the ETN Ecosystem Statistics Dashboard, a web application designed to provide real-time insights into the ETN ecosystem on the TON blockchain. The dashboard offers a comprehensive view of key metrics, including token information, price trends, wallet balances within the ecosystem, recent decentralized exchange (DEX) transactions, and details about Soulbound Token (SBT) collections.

This dashboard is intended to be a valuable resource for the ETN community, providing transparency and easy access to important data about the ecosystem's health and activity.

## Features

* **Token Information:** Displays essential details about the ETN token, such as its name, symbol, decimals, total supply, and the number of holders.
* **Real-time Rates:** Shows the current exchange rates of ETN in USD, TON, and ETB.
* **Price Chart:** Visualizes the historical price data of ETN over the last 30 days.
* **Ecosystem Wallet Balances:** Provides a list of key wallets within the ETN ecosystem, along with their current token balances.
* **STON.fi DEX Transactions:** Displays the latest transactions occurring on the STON.fi decentralized exchange for the ETN token.
* **SBT Collections:** Presents information about the ETN Soulbound Token collections, including owner details and total minted amounts.

## Technologies Used

* **React:** A JavaScript library for building user interfaces.
* **TypeScript:** A typed superset of JavaScript that enhances code maintainability and reduces errors.
* **Vite:** A build tool that provides a fast and efficient development experience.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **react-chartjs-2:** A React wrapper for Chart.js, used for rendering the price chart.
* **Axios:** A promise-based HTTP client for making API requests.
* **TON Blockchain:** The underlying blockchain infrastructure for the ETN ecosystem.
* **TonAPI:** An API used to fetch data related to the TON blockchain, including token information, rates, transactions, and wallet balances.

## Getting Started

To run this application locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd etn-ecosystem-stats
    ```
    Replace `<repository-url>` with the actual URL of this GitHub repository.

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

    This command will start the application in development mode. Open your browser and navigate to `http://localhost:5173` to view the dashboard.

## Configuration

The application relies on the following constants, which can be found in `src/constants/index.ts`:

* `TOKEN_ADDRESS`: The address of the ETN jetton on the TON blockchain.
* `STONFI_ADDRESS`: The address of the STON.fi DEX contract used for fetching transactions.
* `SBT_COLLECTIONS`: An array of objects containing the addresses and types of the ETN SBT collections.
* `ECOSYSTEM_WALLETS`: An array of objects defining the purpose and addresses of key wallets within the ETN ecosystem.

You may need to update these constants if the relevant addresses change or if new collections/wallets are added to the ecosystem.

## API Rate Limiting

The application fetches data from the TonAPI, which has a rate limit of one request per second. To avoid exceeding this limit, the application includes a small delay between consecutive API calls.

## Contributing

Contributions to this project are welcome. If you have suggestions for improvements or find any issues, please feel free to open a pull request or submit an issue on GitHub.

## License

This project is open-source and available under the [Specify License] license.

## Contact

For any questions or inquiries, please contact the ETN ecosystem team.
