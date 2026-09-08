// cPanel "Setup Node.js App" (Phusion Passenger) startup file.
// Registers on-the-fly TypeScript support and boots the real entry point,
// so production runs the exact same TS source as `npm run dev` — no
// separate compiled `dist/` build to keep in sync. See plan §1/§9.
import "tsx/esm";
await import("./src/server.ts");
