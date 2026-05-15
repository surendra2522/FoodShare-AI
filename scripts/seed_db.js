import supabase from '../backend/config/supabaseClient.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '../ai/dataset/food_waste_data.csv');
const DONOR_ID = '675755ab-01a0-410e-9eb9-af4d6df16c8d';

async function seed() {
    console.log('Reading dataset...');
    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split('\n').slice(1); // skip header
    
    const donations = [];
    const foodTypeMap = { '1': 'Veg', '2': 'Non-Veg', '3': 'Mixed' };
    const functionNames = ['Royal Wedding', 'Tech Summit 2026', 'Charity Gala', 'Community Feast', 'Corporate Lunch'];
    const areas = ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitech City', 'Madhapur'];

    console.log(`Processing ${lines.length} records...`);
    
    for (const line of lines) {
        if (!line.trim()) continue;
        const [guests, foodType, freshness, surplus] = line.split(',');
        
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // random date in last 30 days

        donations.push({
            donor_id: DONOR_ID,
            function_name: functionNames[Math.floor(Math.random() * functionNames.length)],
            food_type: foodTypeMap[foodType] || 'Veg',
            servings: parseInt(surplus),
            expiry_hours: parseInt(freshness),
            pickup_area: areas[Math.floor(Math.random() * areas.length)],
            status: Math.random() > 0.3 ? 'delivered' : 'accepted',
            created_at: date.toISOString(),
            accepted_at: date.toISOString(),
            location: { lat: 17.3850 + (Math.random() - 0.5) * 0.1, lng: 78.4867 + (Math.random() - 0.5) * 0.1 }
        });
    }

    console.log('Inserting into Supabase...');
    // Insert in chunks of 50 to avoid payload limits
    const chunkSize = 50;
    for (let i = 0; i < donations.length; i += chunkSize) {
        const chunk = donations.slice(i, i + chunkSize);
        const { error } = await supabase.from('donations').insert(chunk);
        if (error) {
            console.error('Error inserting chunk:', error.message);
        } else {
            console.log(`Inserted chunk ${i/chunkSize + 1}`);
        }
    }
    
    console.log('Seeding complete!');
}

seed();
