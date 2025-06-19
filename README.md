### Shopify Instock Notifier

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
