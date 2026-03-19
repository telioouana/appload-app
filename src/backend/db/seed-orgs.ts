import 'dotenv/config';

import { eq } from 'drizzle-orm';
import { generateRandomString } from 'better-auth/crypto';

import { db } from '.';
import { user, organization, member, session } from './schema';

const COUNT = 10;

async function main() {
    console.log('🌱 Seeding organizations for test users...');

    const now = new Date();

    for (let n = 1; n <= COUNT; n++) {
        for (const type of ['shipper', 'carrier'] as const) {
            const email = `testador${n}+${type}@appload.co.mz`;

            const [testUser] = await db
                .select({ id: user.id, name: user.name })
                .from(user)
                .where(eq(user.email, email))
                .limit(1);

            if (!testUser) {
                console.warn(`  ⚠ User not found: ${email} — run db:seed:users first`);
                continue;
            }

            const orgId = generateRandomString(32);
            const orgName = `${testUser.name} ${type === 'shipper' ? 'Logistics' : 'Transport'}`;
            const slug = `testador-${n}-${type}`;

            await db
                .insert(organization)
                .values({
                    id: orgId,
                    name: orgName,
                    slug,
                    createdAt: now,
                    type,
                    status: 'active',
                    subscriptionPlan: 'free',
                    nuit: 100000000 + (n * 2) + (type === 'carrier' ? 1 : 0),
                    email,
                    phoneNumber: `+2588${String(n).padStart(7, '0')}`,
                    billingAddress: `Av. Test ${n}, Maputo`,
                    physicalAddress: `Av. Test ${n}, Maputo`,
                })
                .onConflictDoNothing();

            await db
                .insert(member)
                .values({
                    id: generateRandomString(32),
                    organizationId: orgId,
                    userId: testUser.id,
                    role: 'owner',
                    createdAt: now,
                })
                .onConflictDoNothing();

            // Patch any existing sessions so already-logged-in users get the org immediately
            await db
                .update(session)
                .set({ activeOrganizationId: orgId })
                .where(eq(session.userId, testUser.id));

            console.log(`  ✓ ${type.padEnd(7)} | ${orgName} → ${email}`);
        }
    }

    console.log(`\n✅ Done! Seeded ${COUNT * 2} organizations.`);
    process.exit(0);
}

main().catch((err) => {
    console.error('❌ Org seed failed:', err);
    process.exit(1);
});
