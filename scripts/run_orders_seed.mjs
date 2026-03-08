import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set in .env");
  process.exit(1);
}

const client = neon(DATABASE_URL);

const now = new Date();
const days = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000).toISOString();

const ORG_ID = "uS9XJgdh9CFxAZcSUuMu9zoHWTe7y7Xr";

const ORDERS = [
  {
    shipperId: ORG_ID,
    shipperName: "Seed Shipper A",
    loadingAddress: [
      { address: "Av. 24 de Julho 123, Bairro Central", placeId: "ChIJm31W5gKb5h4RBAJv-jOV6Sk", country: "Mozambique", state: "KaMavota" },
    ],
    expectedLoadingDate: days(1),
    offloadingAddress: [
      { address: "Rua José Mateus 45, Polana", placeId: "ChIJ45wxuKOb5h4RdIf7LKlYo4s", country: "Mozambique", state: "KaMaxakeni" },
    ],
    expectedOffloadingDate: days(3),
    distance: 120,
    expectedTrucks: 1,
    route: "national",
    share: "subscribers",
    status: "open",
    price: 120000,
    currency: "MZN",
  },
  {
    shipperId: ORG_ID,
    shipperName: "Seed Shipper B",
    loadingAddress: [
      { address: "Av. Eduardo Mondlane 200, Natikiri", placeId: "ChIJx-q1ANlJxhgRFp1zocKCyjk", country: "Mozambique", state: "Natikiri" },
    ],
    expectedLoadingDate: days(2),
    offloadingAddress: [
      { address: "Estrada Nacional Nº 13, Bairro Natikiri", placeId: "ChIJFYE7CpY1xhgRgMV0cn6b_-Y", country: "Mozambique", state: "Natikiri" },
    ],
    expectedOffloadingDate: days(4),
    distance: 300,
    expectedTrucks: 1,
    route: "national",
    share: "non-subscribers",
    status: "open",
    price: 300000,
    currency: "MZN",
  },
  {
    shipperId: ORG_ID,
    shipperName: "Seed Shipper C",
    loadingAddress: [
      { address: "Seed Loading St 3, Zambezia (Quelimane)", placeId: "ChIJO4170wn00hgRp-EMPnY2SLI", country: "Mozambique", state: "Quelimane" },
    ],
    expectedLoadingDate: days(3),
    offloadingAddress: [
      { address: "Seed Offload Ave 3, Zambezia", placeId: "ChIJO4170wn00hgRp-EMPnY2SLI", country: "Mozambique", state: "Quelimane" },
    ],
    expectedOffloadingDate: days(6),
    distance: 540,
    expectedTrucks: 1,
    route: "national",
    share: "subscribers",
    status: "open",
    price: 540000,
    currency: "MZN",
  },
  {
    shipperId: ORG_ID,
    shipperName: "Seed Shipper D",
    loadingAddress: [
      { address: "Seed Loading St 4, Inhambane", placeId: "ChIJm31W5gKb5h4RBAJv-jOV6Sk", country: "Mozambique", state: "Inhambane" },
    ],
    expectedLoadingDate: days(4),
    offloadingAddress: [
      { address: "Seed Offload Ave 4, Inhambane", placeId: "ChIJm31W5gKb5h4RBAJv-jOV6Sk", country: "Mozambique", state: "Inhambane" },
    ],
    expectedOffloadingDate: days(7),
    distance: 220,
    expectedTrucks: 1,
    route: "national",
    share: "non-subscribers",
    status: "open",
    price: 220000,
    currency: "MZN",
  },
  {
    shipperId: ORG_ID,
    shipperName: "Seed Shipper E",
    loadingAddress: [
      { address: "Av. 25 de Junho 50, Quelimane", placeId: "ChIJO4170wn00hgRp-EMPnY2SLI", country: "Mozambique", state: "Quelimane" },
    ],
    expectedLoadingDate: days(5),
    offloadingAddress: [
      { address: "Seed Offload Ave 5, Quelimane", placeId: "ChIJO4170wn00hgRp-EMPnY2SLI", country: "Mozambique", state: "Quelimane" },
    ],
    expectedOffloadingDate: days(9),
    distance: 410,
    expectedTrucks: 1,
    route: "national",
    share: "non-subscribers",
    status: "open",
    price: 410000,
    currency: "MZN",
  },
];

async function run() {
  try {
    for (const o of ORDERS) {
      const sql = `INSERT INTO "order" (
        shipper_id, shipper_name, loading_address, expected_loading_date,
        offloading_address, expected_offloading_date, distance, expected_trucks,
        route, share, status, price, currency
      ) VALUES ($1,$2,$3::jsonb,$4,$5::jsonb,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING id, legacy_id`;

      const params = [
        o.shipperId,
        o.shipperName,
        JSON.stringify(o.loadingAddress),
        o.expectedLoadingDate,
        JSON.stringify(o.offloadingAddress),
        o.expectedOffloadingDate,
        o.distance,
        o.expectedTrucks,
        o.route,
        o.share,
        o.status,
        o.price,
        o.currency,
      ];

      const res = await client.query(sql, params);
      console.log("Inserted order:", res.rows ?? res);
    }
    console.log("Done seeding orders.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

run();
