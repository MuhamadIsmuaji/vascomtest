import { Pool, PoolClient } from "pg";

class Database {
  private static pool = new Pool({
    connectionString: process.env.POSTGRES_URI,
    ssl: false,
  });

  private static clients: PoolClient[] = [];

  public static async getClient(): Promise<PoolClient> {
    const client = await this.pool.connect();
    this.clients.push(client);

    return client;
  }

  public static async release(): Promise<void> {
    await Promise.all(this.clients.map((client) => client.release()));
    await this.pool.end();
  }
}

export default Database;
