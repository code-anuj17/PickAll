import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from project root
const projectRoot = path.join(__dirname, '..');
dotenv.config({ path: path.join(projectRoot, '.env') });

const ADMIN_EMAIL = process.env.VITE_ADMIN_EMAIL || 'logisticspickall@gmail.com';
const TEMPLATE_PATH = path.join(projectRoot, 'firestore.rules.template');
const OUTPUT_PATH = path.join(projectRoot, 'firestore.rules');

try {
  // Read template
  let rulesContent = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // Replace placeholder with actual email
  rulesContent = rulesContent.replace(/__ADMIN_EMAIL__/g, ADMIN_EMAIL);

  // Write output
  fs.writeFileSync(OUTPUT_PATH, rulesContent, 'utf8');

  console.log(`✓ Firestore rules generated successfully`);
  console.log(`  Admin email: ${ADMIN_EMAIL}`);
  console.log(`  Output: ${OUTPUT_PATH}`);
} catch (err) {
  console.error('✗ Failed to generate firestore rules:', err.message);
  process.exit(1);
}
