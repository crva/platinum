# platinum - Warframe Relic Price Viewer

A simple web application to view and compare prices of relics and their rewards in Warframe.

## Features

- Browse relics by tier (Lith, Meso, Neo, Axi, Requiem)
- View the best relic upgrade to maximize chances of obtaining platinum (`tools/relic_profitability.ts`)
- View reward items with minimum and median prices
- Select items to highlight the most expensive ones in each rarity
- Item history to view total platinum for selected items
- View global statistics about relics (best rare reward, top 10 most profitable relics ...)

## Data Retrieval

The application loads relic data from a local JSON file (`relic_prices.json`) located in the `public` directory. The data includes relic tiers, names, and their associated rewards with pricing information.

The `relic_prices.json` file is generated using the script in `tools/relic_prices.ts`, which fetches data from:

- [Warframe Stat API](https://drops.warframestat.us/data/relics.json) for relic information
- [Warframe Market API](https://api.warframe.market/v2) for sell order prices

The script calculates minimum and median prices for each reward item based on current market data.

![stonks](./stonks.png)
