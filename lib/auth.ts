import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  // database: drizzleAdapter(db, { provider: "pg" }), // To be configured after Drizzle setup
});
