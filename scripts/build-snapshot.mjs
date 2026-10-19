import { mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectRoot, verifyHosting } from './verify.mjs';

/** Copy the verified snapshot unchanged; the recovered assets are already compiled. */
export async function build({ root = projectRoot } = {}) {
  const { files } = await verifyHosting({ root });
  const staging = await mkdtemp(path.join(root, '.dist-staging-'));
  try {
    for (const file of files) {
      const output = path.join(staging, file.relative);
      await mkdir(path.dirname(output), { recursive: true });
      await writeFile(output, file.content, { flag: 'wx' });
    }
    await rm(path.join(root, 'dist'), { recursive: true, force: true });
    await rename(staging, path.join(root, 'dist'));
    return { count: files.length, destination: path.join(root, 'dist') };
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await build();
    console.log(`Built dist/ from ${result.count} verified files without changing recovered sources.`);
  } catch (error) {
    console.error(`Build failed: ${error.message}`);
    process.exitCode = 1;
  }
}
