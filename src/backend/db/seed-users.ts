import 'dotenv/config';

import { generateRandomString, hashPassword } from 'better-auth/crypto';
import { db } from '.';
import { user, account } from './schema';

const PASSWORD = 'Test@1234';
const COUNT = 10;

type UserType = 'shipper' | 'carrier';

function buildUsers() {
  type Gender = 'male' | 'female' | 'other';
  const users: { id: string; name: string; email: string; type: UserType; phoneNumber: string; gender: Gender }[] = [];
  for (let n = 1; n <= COUNT; n++) {
    const shipperPhone = `+25884${String(n).padStart(7, '0')}`;
    const carrierPhone = `+25886${String(n).padStart(7, '0')}`;
    const gender: Gender = n % 2 === 0 ? 'female' : 'male';

    users.push({
      id: generateRandomString(32),
      name: `Testador ${n}`,
      email: `testador${n}+shipper@appload.co.mz`,
      type: 'shipper',
      phoneNumber: shipperPhone,
      gender,
    });

    users.push({
      id: generateRandomString(32),
      name: `Testador ${n}`,
      email: `testador${n}+carrier@appload.co.mz`,
      type: 'carrier',
      phoneNumber: carrierPhone,
      gender,
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
      const [{ id: userId }] = await db
        .insert(user)
        .values({
          id: u.id,
          name: u.name,
          email: u.email,
          emailVerified: true,
          type: u.type,
          role: 'user',
          status: 'active',
          phoneNumber: u.phoneNumber,
          phoneNumberVerified: true,
          gender: u.gender,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: user.email,
          set: {
            name: u.name,
            emailVerified: true,
            type: u.type,
            role: 'user',
            status: 'active',
            phoneNumber: u.phoneNumber,
            phoneNumberVerified: true,
            gender: u.gender,
            updatedAt: now,
          },
        })
        .returning({ id: user.id });

      await db
        .insert(account)
        .values({
          id: generateRandomString(32),
          accountId: userId,
          providerId: 'credential',
          userId: userId,
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
