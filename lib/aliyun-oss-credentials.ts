export interface OSSCredentials {
  region: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: string;
  bucket: string;
  front: string;
}

type UnknownRecord = Record<string, unknown>;

const NESTED_CREDENTIAL_KEYS = [
  "credentials",
  "credential",
  "Credentials",
  "Credential",
  "sts",
  "STS",
  "data",
  "result",
] as const;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function collectCredentialContainers(value: unknown): UnknownRecord[] {
  const root = asRecord(value);
  if (!root) return [];

  const containers: UnknownRecord[] = [];
  const queue: Array<{ record: UnknownRecord; depth: number }> = [
    { record: root, depth: 0 },
  ];
  const seen = new Set<UnknownRecord>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || seen.has(current.record)) continue;

    seen.add(current.record);
    containers.push(current.record);

    if (current.depth >= 3) continue;

    for (const key of NESTED_CREDENTIAL_KEYS) {
      const nested = asRecord(current.record[key]);
      if (nested) {
        queue.push({ record: nested, depth: current.depth + 1 });
      }
    }
  }

  return containers;
}

function pickString(containers: UnknownRecord[], keys: string[]): string {
  for (const container of containers) {
    for (const key of keys) {
      const value = container[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  return "";
}

export function normalizeOSSCredentials(value: unknown): OSSCredentials {
  const containers = collectCredentialContainers(value);

  return {
    region: pickString(containers, ["region", "Region"]),
    endpoint: pickString(containers, ["endpoint", "Endpoint"]),
    accessKeyId: pickString(containers, [
      "accessKeyId",
      "AccessKeyId",
      "access_key_id",
    ]),
    secretAccessKey: pickString(containers, [
      "secretAccessKey",
      "accessKeySecret",
      "AccessKeySecret",
      "secret_access_key",
      "access_key_secret",
    ]),
    sessionToken: pickString(containers, [
      "sessionToken",
      "stsToken",
      "securityToken",
      "SecurityToken",
      "session_token",
      "sts_token",
      "security_token",
    ]),
    expiration: pickString(containers, [
      "expiration",
      "Expiration",
      "expireAt",
      "expiresAt",
    ]),
    bucket: pickString(containers, [
      "bucket",
      "Bucket",
      "bucketName",
      "BucketName",
    ]),
    front: pickString(containers, [
      "front",
      "frontUrl",
      "publicUrl",
      "cdnUrl",
      "domain",
    ]),
  };
}
