import 'dotenv/config';

import { generateRandomString, hashPassword } from 'better-auth/crypto';
import { db } from '.';
import { user, account } from './schema';

const PASSWORD = 'Test@1234';
const COUNT = 10;

type UserType = 'shipper' | 'carrier';

function buildUsers() {
  const users: { id: string; name: string; email: string; type: UserType }[] = [];
  for (let n = 1; n <= COUNT; n++) {
    users.push({
      id: generateRandomString(32),
      name: `Testador ${n}`,
      email: `testador${n}+shipper@appload.co.mz`,
      type: 'shipper',
    });
    users.push({
      id: generateRandomString(32),
      name: `Testador ${n}`,
      email: `testador${n}+carrier@appload.co.mz`,
      type: 'carrier',
    });
  }
  return users;
}

async function main() {
  console.log('🌱 Seeding test users...');

  const hashedPassword = await hashPassword(PASSWORD);
  const now = new Date();
  const users = buildUsers();

  for (const u of users) {
    try {
      await db
        .insert(user)
        .values({
          id: u.id,
          name: u.name,
          email: u.email,
          emailVerified: true,
          type: u.type,
          role: 'user',
          status: 'active',
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing();

      await db
        .insert(account)
        .values({
          id: generateRandomString(32),
          accountId: u.id,
          providerId: 'credential',
          userId: u.id,
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing();

      console.log(`  ✓ ${u.type.padEnd(7)} | ${u.email}`);
    } catch (err) {
      console.error('Error seeding user', u.email, err);
    }
  }

  console.log(`\n✅ Done! Seeded ${users.length} users (${COUNT} shippers + ${COUNT} carriers).`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
