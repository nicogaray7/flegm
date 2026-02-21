import { formatDurationHMS } from "@/lib/format-duration";

describe("formatDurationHMS", () => {
  it("formats under 1 minute as M:SS with no leading zero on minutes", () => {
    expect(formatDurationHMS(0)).toBe("0:00");
    expect(formatDurationHMS(45)).toBe("0:45");
    expect(formatDurationHMS(59)).toBe("0:59");
  });

  it("formats minutes and seconds without leading zeros on minutes", () => {
    expect(formatDurationHMS(60)).toBe("1:00");
    expect(formatDurationHMS(90)).toBe("1:30");
    expect(formatDurationHMS(365)).toBe("6:05");
  });

  it("formats 1 hour or more as H:MM:SS with no leading zero on hours", () => {
    expect(formatDurationHMS(3600)).toBe("1:00:00");
    expect(formatDurationHMS(3661)).toBe("1:01:01");
    expect(formatDurationHMS(7325)).toBe("2:02:05");
  });

  it("floors fractional seconds", () => {
    expect(formatDurationHMS(45.9)).toBe("0:45");
  });
});
