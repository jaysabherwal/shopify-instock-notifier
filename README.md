### Shopify Instock Notifier

This application will use Puppeteer to scrape the shopify links provided and  
then send a notification to a discord channel if it is in stock.

You can specify the poll time, which is the amount of time to wait inbetween checks.

It will run on `pm2` which restarts the application if there is an error.

The application is stateless, so if the item is instock over multiple checks of the app,   
it will send a message each time.

## Installation & Running

1. Copy `_scraper_settings_template.json` -> `scraper_settings.json`
   * Fill out the values:
    * Poll time: Time between each stock check
    * Channel ID: Discord text channel ID you want the notifications to go to
    * Scrapes:
       * Name: User defined name of the scrape
       * Link: Shopify product link
2. Copy `_.env_template` -> `.env`
   * Fill out the Discord bot token
3. Run `npm install`
4. Run `npm run build`
5. Install pm2: `npm install pm2 -g`
6. Run `pm2 start dist/index.js`
