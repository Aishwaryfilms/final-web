import { execSync } from "node:child_process";
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptFilePath = fileURLToPath(import.meta.url);
const scriptDir = dirname(scriptFilePath);
const projectDir = resolve(scriptDir, "..");
const workspaceRoot = resolve(projectDir, "..");

const sourceTemplatePath = join(projectDir, "index.source.html");
const projectIndexPath = join(projectDir, "index.html");
const project404Path = join(projectDir, "404.html");
const projectAssetsDir = join(projectDir, "assets");

const distDir = join(projectDir, "dist");
const distIndexPath = join(distDir, "index.html");
const dist404Path = join(distDir, "404.html");
const distAssetsDir = join(distDir, "assets");

const rootIndexPath = join(workspaceRoot, "index.html");
const root404Path = join(workspaceRoot, "404.html");
const rootAssetsDir = join(workspaceRoot, "assets");

// Only sync into the parent workspace when this package is in the expected folder.
const shouldSyncWorkspaceRoot =
  basename(projectDir) === "you-frontend" &&
  resolve(workspaceRoot, "you-frontend") === projectDir;

function copyFile(sourcePath, destinationPath) {
  mkdirSync(dirname(destinationPath), { recursive: true });
  copyFileSync(sourcePath, destinationPath);
}

function copyDirectory(sourcePath, destinationPath) {
  rmSync(destinationPath, { recursive: true, force: true });
  mkdirSync(destinationPath, { recursive: true });
  cpSync(sourcePath, destinationPath, { recursive: true });
}

if (!existsSync(sourceTemplatePath)) {
  throw new Error(
    `Missing source template: ${sourceTemplatePath}. Cannot run safe publish.`
  );
}

const sourceTemplate = readFileSync(sourceTemplatePath, "utf8");
const previousIndexHtml = existsSync(projectIndexPath)
  ? readFileSync(projectIndexPath, "utf8")
  : null;

let publishSucceeded = false;

// Force build input to the real source entry before running Vite build.
writeFileSync(projectIndexPath, sourceTemplate, "utf8");

try {
  execSync("npm run build:dist", {
    cwd: projectDir,
    stdio: "inherit",
    env: process.env,
  });

  if (!existsSync(distIndexPath) || !existsSync(dist404Path) || !existsSync(distAssetsDir)) {
    throw new Error("Build succeeded but expected files are missing in dist/.");
  }

  // Keep direct file launch working in this folder.
  copyFile(distIndexPath, projectIndexPath);
  copyFile(dist404Path, project404Path);
  copyDirectory(distAssetsDir, projectAssetsDir);

  // Keep direct file launch working at workspace root.
  if (shouldSyncWorkspaceRoot) {
    copyFile(distIndexPath, rootIndexPath);
    copyFile(dist404Path, root404Path);
    copyDirectory(distAssetsDir, rootAssetsDir);
  }

  publishSucceeded = true;
  console.log("Static publish completed from source build.");
} finally {
  // If anything failed, restore the previous launcher file to avoid leaving source mode behind.
  if (!publishSucceeded) {
    if (previousIndexHtml === null) {
      rmSync(projectIndexPath, { force: true });
    } else {
      writeFileSync(projectIndexPath, previousIndexHtml, "utf8");
    }
  }
}
