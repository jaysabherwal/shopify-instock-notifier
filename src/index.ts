import dotenv from 'dotenv';
import { Scraper } from './scraper';

dotenv.config();

new Scraper().setup('./scraper_settings.json');