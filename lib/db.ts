import { PrismaClient } from "@prisma/client";

// 1. THE GLOBAL OBJECT HOOK
// In Node.js, there is a variable called 'global' that lives forever 
// (as long as the server is running).
// We are telling TypeScript: "Trust me, I am going to attach a property 
// called 'prisma' to the global object."
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. THE SINGLETON LOGIC
// This uses the "OR" operator (||).
// logic: "Use the existing connection OR create a new one."
export const prisma =
  globalForPrisma.prisma || // A. If we saved one in global before, USE IT.
  new PrismaClient({        // B. If not, create a NEW connection.
    log: ["query", "error", "warn"], // (Optional) Print SQL queries to console for debugging.
  });

// 3. SAVING FOR NEXT TIME
// We check if we are in "Development" mode (not Production).
if (process.env.NODE_ENV !== "production") {
  // We save the connection we just made into the global variable.
  // Next time this file runs (on Hot Reload), Step 2(A) will find this!
  globalForPrisma.prisma = prisma;
}
//

// ### Summary of Concepts

// 1.  **`global`**:
//     * This is a special variable in Node.js that is accessible everywhere.
//     * Next.js clears almost everything when it reloads, but it **does not** clear the `global` variable. That is why we hide the database connection inside it.

// 2.  **`new PrismaClient()`**:
//     * This is the heavy operation. It opens the "Phone Line" to your database URL. You want to do this as rarely as possible.

// 3.  **`process.env.NODE_ENV !== "production"`**:
//     * **Locally:** We need this hack because of Hot Reloading.
//     * **In Production (Vercel):** The app doesn't "Hot Reload." It starts once and stays running. So in production, we strictly use `new PrismaClient()` properly without needing the global variable.

// ### Why `log: ["query"]`?
// You noticed this line:
// log: ["query", "error", "warn"],