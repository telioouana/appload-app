import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set in .env");
  process.exit(1);
}

const client = neon(DATABASE_URL);

const CARGOS = [
  {
    orderId: null, // Will be set dynamically
    category: "agriculture-products",
    description: "Fresh tomatoes for market distribution",
    quantity: "2.5",
    unit: "ton",
    packing: "boxes",
    isHazardous: false,
    hazchemCode: null,
    isRefrigerated: true,
    temperature: 8,
    temperatureInstructions: "Keep at 8°C during transport",
    isGroupageAllowed: true,
  },
  {
    orderId: null, // Will be set dynamically
    category: "construction",
    description: "Cement bags for building project",
    quantity: "25",
    unit: "ton",
    packing: "bags-50kg",
    isHazardous: false,
    hazchemCode: null,
    isRefrigerated: false,
    temperature: null,
    temperatureInstructions: null,
    isGroupageAllowed: false,
  },
  {
    orderId: null, // Will be set dynamically
    category: "fmcg",
    description: "Household cleaning chemicals",
    quantity: "1.2",
    unit: "ton",
    packing: "container-20ft",
    isHazardous: true,
    hazchemCode: "8",
    isRefrigerated: false,
    temperature: null,
    temperatureInstructions: null,
    isGroupageAllowed: false,
  },
  {
    orderId: null, // Will be set dynamically
    category: "machinery-equipment",
    description: "Agricultural irrigation pumps",
    quantity: "3",
    unit: "ton",
    packing: "pallets",
    isHazardous: false,
    hazchemCode: null,
    isRefrigerated: false,
    temperature: null,
    temperatureInstructions: null,
    isGroupageAllowed: true,
  },
  {
    orderId: null, // Will be set dynamically
    category: "medicine",
    description: "Vaccines requiring cold chain",
    quantity: "0.8",
    unit: "ton",
    packing: "boxes",
    isHazardous: false,
    hazchemCode: null,
    isRefrigerated: true,
    temperature: 2,
    temperatureInstructions: "Maintain at 2-8°C, temperature monitoring required",
    isGroupageAllowed: false,
  },
];

async function run() {
  try {
    // Get existing order IDs
    const orderRes = await client.query('SELECT id FROM "order" LIMIT 5');
    const orderIds = orderRes.rows.map(row => row.id);

    if (orderIds.length === 0) {
      console.error("No orders found. Please run orders seed first.");
      process.exit(1);
    }

    for (let i = 0; i < CARGOS.length && i < orderIds.length; i++) {
      const cargo = { ...CARGOS[i], orderId: orderIds[i] };

      const sql = `INSERT INTO cargo (
        order_id, category, description, quantity, unit, packing,
        is_hazardous, hazchem_code, is_refrigerated, temperature,
        temperature_instructions, is_groupage_allowed
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING id`;

      const params = [
        cargo.orderId,
        cargo.category,
        cargo.description,
        cargo.quantity,
        cargo.unit,
        cargo.packing,
        cargo.isHazardous,
        cargo.hazchemCode,
        cargo.isRefrigerated,
        cargo.temperature,
        cargo.temperatureInstructions,
        cargo.isGroupageAllowed,
      ];

      const res = await client.query(sql, params);
      console.log("Inserted cargo:", res.rows ?? res);
    }

    console.log("Done seeding cargo.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

run();