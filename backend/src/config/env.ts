function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT) || 3000,
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:4200",

  dbHost: required("DB_HOST"),
  dbPort: Number(process.env.DB_PORT) || 3306,
  dbName: required("DB_NAME"),
  dbUser: required("DB_USER"),
  dbPassword: process.env.DB_PASSWORD ?? "",

  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "12h",

  adminEmail: required("ADMIN_EMAIL"),
  adminPassword: required("ADMIN_PASSWORD"),
};
