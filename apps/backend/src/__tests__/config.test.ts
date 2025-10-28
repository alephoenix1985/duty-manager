describe("DB Config", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should use default values when environment variables are not set", () => {
    delete process.env.DB_USER;
    delete process.env.DB_HOST;
    delete process.env.DB_NAME;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_PORT;

    const { dbConfig } = require("../../src/config");

    expect(dbConfig).toEqual({
      user: "postgres",
      host: "localhost",
      database: "duties",
      password: "postgres",
      port: 5433,
    });
  });

  it("should use environment variables when they are set", () => {
    process.env.DB_USER = "test_user";
    process.env.DB_HOST = "test_host";
    process.env.DB_NAME = "test_db";
    process.env.DB_PASSWORD = "test_password";
    process.env.DB_PORT = "9999";

    const { dbConfig } = require("../../src/config");

    expect(dbConfig).toEqual({
      user: "test_user",
      host: "test_host",
      database: "test_db",
      password: "test_password",
      port: 9999,
    });
  });
});
