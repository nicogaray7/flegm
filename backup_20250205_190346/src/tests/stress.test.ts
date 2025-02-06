import autocannon from 'autocannon';
import { app } from '../server';
import mongoose from 'mongoose';
import { Server } from 'http';
import { describe, it, beforeAll, afterAll, expect } from '@jest/globals';

let server: Server;
const PORT = 4000;

describe('Stress Tests', () => {
  beforeAll(async () => {
    server = app.listen(PORT);
  });

  afterAll(async () => {
    server.close();
    await mongoose.connection.close();
  });

  const runStressTest = (url: string, connections: number, duration: number) => {
    return new Promise((resolve) => {
      autocannon({
        url,
        connections,
        duration,
        pipelining: 1,
        workers: 4,
        headers: {
          'Content-Type': 'application/json'
        }
      }, (err, results) => {
        if (err) {
          console.error('Stress test error:', err);
        }
        resolve(results);
      });
    });
  };

  it('should handle health check endpoint under load', async () => {
    const results: any = await runStressTest(
      `http://localhost:${PORT}/health`,
      100,  // connections
      10    // seconds
    );

    expect(results.errors).toBe(0);
    expect(results.timeouts).toBe(0);
    expect(results.non2xx).toBe(0);
    expect(results.latency.p99).toBeLessThan(1000); // 99th percentile latency < 1s
  }, 15000);

  it('should handle authentication endpoints under load', async () => {
    const payload = JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    });

    const results: any = await runStressTest(
      `http://localhost:${PORT}/auth/login`,
      50,   // connections
      10    // seconds
    );

    expect(results.errors).toBe(0);
    expect(results.timeouts).toBe(0);
    expect(results.latency.p95).toBeLessThan(2000); // 95th percentile latency < 2s
  }, 15000);

  it('should handle concurrent database operations', async () => {
    const payload = JSON.stringify({
      username: 'stresstest',
      email: 'stress@test.com',
      password: 'password123'
    });

    const results: any = await runStressTest(
      `http://localhost:${PORT}/auth/register`,
      30,   // connections
      10    // seconds
    );

    expect(results.errors).toBe(0);
    expect(results.timeouts).toBe(0);
    expect(results.latency.p95).toBeLessThan(3000); // 95th percentile latency < 3s
  }, 15000);
}); 