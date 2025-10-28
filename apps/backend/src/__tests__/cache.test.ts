import { getFromCache, setInCache, invalidateCache } from "../../src/cache";

describe("Cache Module", () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    invalidateCache();
    jest.useFakeTimers();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    jest.useRealTimers();
  });

  it("should set and get a value from the cache", () => {
    const key = "test-key";
    const data = { value: "test-data" };
    setInCache(key, data);
    const cachedData = getFromCache(key);
    expect(cachedData).toEqual(data);
  });

  it("should return null for a non-existent key", () => {
    const cachedData = getFromCache("non-existent-key");
    expect(cachedData).toBeNull();
  });

  it("should return null for an expired key", () => {
    const key = "expired-key";
    const data = { value: "some-data" };
    const TTL = 60 * 1000;

    setInCache(key, data);

    jest.advanceTimersByTime(TTL + 1);

    const cachedData = getFromCache(key);
    expect(cachedData).toBeNull();
  });

  it("should not return an expired value, and the key should be deleted", () => {
    const key = "another-expired-key";
    const data = { value: "more-data" };
    const TTL = 60 * 1000;

    setInCache(key, data);

    jest.advanceTimersByTime(TTL + 1);
    expect(getFromCache(key)).toBeNull();

    expect(getFromCache(key)).toBeNull();
  });

  it("should invalidate a specific key", () => {
    const key1 = "key1";
    const key2 = "key2";
    const data1 = { value: "data1" };
    const data2 = { value: "data2" };

    setInCache(key1, data1);
    setInCache(key2, data2);

    invalidateCache(key1);

    expect(getFromCache(key1)).toBeNull();
    expect(getFromCache(key2)).toEqual(data2);
  });

  it("should invalidate the entire cache if no key is provided", () => {
    setInCache("key1", { value: "data1" });
    setInCache("key2", { value: "data2" });

    invalidateCache();

    expect(getFromCache("key1")).toBeNull();
    expect(getFromCache("key2")).toBeNull();
  });
});
