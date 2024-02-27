import axios from "axios";

interface GlobalQuoteResponse {
  "Global Quote": {
    "05. price": string;
  };
}

export async function getStockPrice(symbol: string): Promise<number | null> {
  try {
    const response = await axios.get<GlobalQuoteResponse>(
      "https://www.alphavantage.co/query",
      {
        params: {
          function: "GLOBAL_QUOTE",
          symbol: symbol,
          apikey: process.env.ALPHA_VANTAGE_API_KEY,
        },
      }
    );

    const globalQuoteResponse = response.data;
    if (!globalQuoteResponse["Global Quote"]) {
      throw new Error(`Reached request limit for the day`);
    }
    const currentPriceString = globalQuoteResponse["Global Quote"]["05. price"];

    if (!currentPriceString) {
      throw new Error(`Price not found for symbol: ${symbol}`);
    }

    const currentPrice: number = parseFloat(currentPriceString);

    if (isNaN(currentPrice)) {
      throw new Error(`Invalid price received for symbol: ${symbol}`);
    }

    return currentPrice;
  } catch (error) {
    console.error(`Error fetching stock price: ${error}`);
    return null;
  }
}
