import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import app from "../../main";
import { DB } from "mongoloquent";

const TEST_EMAIL = "testuser@example.com";
const TEST_PASSWORD = "testpass123";


describe("Auth API integration", () => {
  beforeAll(async () => {
    // Clean and seed test user
    await DB.collection("users").insert({
      email: TEST_EMAIL,
      password: await Bun.password.hash(TEST_PASSWORD),
      role: 'admin'
    });
  });

  afterAll(async () => {
    await DB.collection("users").where('email', TEST_EMAIL).delete();
  });

  it("POST /auth/login should return accessToken for valid credentials", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(200);
    const data = await res.json() as { accessToken: string };
    expect(data).toHaveProperty("accessToken");
    expect(typeof data.accessToken).toBe("string");
  });

  it("POST /auth/login should return 401 for wrong password", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: TEST_EMAIL, password: "wrongpass" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toHaveProperty("message", "Invalid email or password");
  });

  it("POST /auth/login should return 401 for non-existent user", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "nouser@example.com", password: "irrelevant" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toHaveProperty("message", "Invalid email or password");
  });

  it("POST /auth/login should return 400 for missing fields", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(400);
    const data = await res.json() as { message: string, errors: Record<string, string> };
    expect(data).toHaveProperty("message", "Validation failed");
    expect(data).toHaveProperty("errors");
    expect(data.errors).toHaveProperty("email", "Email must be a valid email");
    expect(data.errors).toHaveProperty("password", "Password is required");
  });

  it("POST /auth/login should return 400 for invalid email format", async () => {
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "notanemail", password: "short" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(400);
    const data = await res.json() as { message: string, errors: Record<string, string> };
    expect(data).toHaveProperty("message", "Validation failed");
    expect(data).toHaveProperty("errors");
    expect(data.errors).toHaveProperty("email", "Email must be a valid email");
    expect(data.errors).toHaveProperty("password", "Password must be at least 6 characters long");
  });
});
