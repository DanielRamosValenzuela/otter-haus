#!/usr/bin/env node
// Prints an ADMIN_PASSWORD_HASH value ("salt:hash") for .env.local.
// Usage: npm run hash-password -- "una-contraseña-segura"
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error('Uso: npm run hash-password -- "una-contraseña-segura"');
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");

console.log(`${salt}:${hash}`);
