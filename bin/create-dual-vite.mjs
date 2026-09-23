#!/usr/bin/env node

import * as p from "@clack/prompts";
import { cp, mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templateRoot = path.join(packageRoot, "templates", "dual-vite");

function parseArguments(argv) {
  const result = { directory: undefined, name: undefined, base: undefined, packageManager: undefined, yes: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") return { help: true };
    if (argument === "--yes" || argument === "-y") { result.yes = true; continue; }
    if (["--name", "--base", "--package-manager"].includes(argument)) {
      const value = argv[++index];
      if (!value || value.startsWith("-")) throw new Error(`Missing value for ${argument}`);
      result[{ "--name": "name", "--base": "base", "--package-manager": "packageManager" }[argument]] = value;
      continue;
    }
    if (argument.startsWith("-")) throw new Error(`Unknown option: ${argument}`);
    if (result.directory) throw new Error("Only one project directory can be provided");
    result.directory = argument;
  }
  return result;
}

function printHelp() {
  console.log(`\nUsage: create-dual-vite [project-directory] [options]\n\nOptions:\n  --name <name>                 Project package name\n  --base <path>                 Web deployment base path\n  --package-manager <manager>   pnpm, npm, yarn, or bun\n  --yes, -y                     Use defaults without prompts\n  --help, -h                    Show this help\n`);
}

function packageName(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function normalizeBase(value) {
  const trimmed = value.trim() || "/";
  if (trimmed === "/") return "/";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}/`;
}

async function directoryIsEmpty(directory) {
  try { return (await readdir(directory)).length === 0; }
  catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return true;
    throw error;
  }
}

async function replaceTokens(directory, values) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return replaceTokens(filePath, values);
    const source = await readFile(filePath, "utf8");
    const output = Object.entries(values).reduce((text, [token, value]) => text.replaceAll(token, value), source);
    await writeFile(filePath, output);
  }));
}

function cancelIfNeeded(value) {
  if (p.isCancel(value)) { p.cancel("Creation cancelled."); process.exit(0); }
  return value;
}

function installDependencies(manager, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(manager, ["install"], { cwd, stdio: "inherit", shell: process.platform === "win32" });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${manager} install exited with code ${code}`)));
  });
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) return printHelp();
  p.intro("create-dual-vite");

  const rawName = options.name || options.directory || (options.yes ? "dual-vite-app" : cancelIfNeeded(await p.text({ message: "Project name", placeholder: "my-dual-app", validate: (value) => packageName(value) ? undefined : "Use letters or numbers in the project name." })));
  const name = packageName(rawName);
  const targetDirectory = path.resolve(process.cwd(), options.directory || name);
  const webBase = normalizeBase(options.base || (options.yes ? "/" : cancelIfNeeded(await p.text({ message: "Web deployment base path", initialValue: "/", placeholder: "/console/", validate: (value) => value.trim().startsWith("/") ? undefined : "Base path must start with /." }))));
  const manager = options.packageManager || (options.yes ? "pnpm" : cancelIfNeeded(await p.select({ message: "Package manager", initialValue: "pnpm", options: ["pnpm", "npm", "yarn", "bun"].map((value) => ({ value, label: value })) })));

  if (!(await directoryIsEmpty(targetDirectory))) {
    throw new Error(`Target directory is not empty: ${targetDirectory}`);
  }

  const progress = p.spinner();
  progress.start("Generating application");
  await mkdir(targetDirectory, { recursive: true });
  await cp(templateRoot, targetDirectory, { recursive: true });
  await replaceTokens(targetDirectory, { "__APP_NAME__": name, "__WEB_BASE__": webBase });
  await rename(path.join(targetDirectory, "_gitignore"), path.join(targetDirectory, ".gitignore"));
  progress.stop("Application generated");

  const shouldInstall = options.yes ? false : cancelIfNeeded(await p.confirm({ message: `Install dependencies with ${manager}?`, initialValue: true }));
  if (shouldInstall) {
    progress.start("Installing dependencies");
    try { await installDependencies(manager, targetDirectory); progress.stop("Dependencies installed"); }
    catch (error) { progress.stop("Dependency installation failed"); throw error; }
  }

  const relativeTarget = path.relative(process.cwd(), targetDirectory) || ".";
  p.note(`cd ${relativeTarget}\n${shouldInstall ? "" : `${manager} install\n`}${manager} dev\n\n${manager} build:web       # Browser History + ${webBase}\n${manager} build:filelocal # Hash History + relative assets`, "Next steps");
  p.outro("DualVite is ready.");
}

main().catch((error) => { p.log.error(error.message); process.exitCode = 1; });
