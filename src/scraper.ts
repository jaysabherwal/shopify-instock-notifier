import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import { readFileSync } from "node:fs";
import { Browser, LaunchOptions } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import logger from "./logger";

interface Settings {
    channel_id: string;
    poll_time_ms: number;
    scrapes: Scrape[];
}

interface Scrape {
    name: string;
    link: string;
}

export class Scraper {
    private client: Client;
    private browser: Browser;

    setup = async (location: string) => {
        await this.setupDiscordClient();
        await this.setupPuppeteer();
        await this.setupScrapes(location);
    };

    private timeout = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private setupScrapes = async (location: string) => {
        logger.info("Setting up scrapes")
        const str: string  = readFileSync(location).toString();
        
        // Loose parsing - no validation
        const settings: Settings = JSON.parse(str);


        while (true) {
            try {
                const page = await this.browser.newPage();
                for (const scrape of settings.scrapes) {
                    logger.info(`Scraping ${scrape.name}`);

                    await page.goto(scrape.link);
                    
                    const disabledElement = await page.$('shopify-accelerated-checkout[disabled]');

                    if (!disabledElement) {
                        await (this.client.channels.cache.get(settings.channel_id) as TextChannel).send(`Scrape triggered! **${scrape.name}**, ${scrape.link}`);
                    }

                }
                
                await page.close();
                await this.timeout(settings.poll_time_ms);
            } catch (err) {
                logger.error('Caught error, continuing')
            }
        }
    };

    private setupDiscordClient = async () => {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds],
        });

        this.client.on(Events.ClientReady, () => {
            logger.info(`Logged in as ${this.client.user.tag}`);
        });

        this.client.on(Events.ShardDisconnect, () => {
            logger.info(`Disconnected`);
        });

        await this.client.login(process.env.DISCORD_TOKEN).catch((e) => logger.error(e));
    };

    private setupPuppeteer = async () => {
        puppeteer.use(StealthPlugin());

        const launchOptions: LaunchOptions = {
          headless: true,
        }

        this.browser = await puppeteer.launch(launchOptions);
    };
}


