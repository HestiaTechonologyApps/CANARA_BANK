import { Client } from "basic-ftp";
import path from "node:path";

const host = process.env.SMARTERASP_HOST;
const user = process.env.SMARTERASP_USER;
const password = process.env.SMARTERASP_PASSWORD;
const remoteDir = process.env.SMARTERASP_REMOTE_DIR || "/";
const localDir = process.env.DEPLOY_LOCAL_DIR || "dist";

if (!host || !user || !password) {
  console.error(
    "Missing FTP credentials. Set SMARTERASP_HOST, SMARTERASP_USER, SMARTERASP_PASSWORD env vars before running."
  );
  process.exit(1);
}

const client = new Client();
client.ftp.verbose = false;

try {
  await client.access({
    host,
    user,
    password,
    secure: true,
    secureOptions: { rejectUnauthorized: true },
  });
  console.log(`Connected to ${host}. Uploading ${path.resolve(localDir)} -> ${remoteDir}`);
  await client.ensureDir(remoteDir);
  if (process.env.CLEAN_DEPLOY === "true") {
    console.log("CLEAN_DEPLOY=true: removing existing files in remote dir first.");
    await client.clearWorkingDir();
  }
  await client.uploadFromDir(localDir);
  console.log("Deploy complete.");
} catch (err) {
  console.error("Deploy failed:", err.message);
  process.exitCode = 1;
} finally {
  client.close();
}
