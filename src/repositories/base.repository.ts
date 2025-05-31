import { Pool } from 'pg';

export interface BaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface BaseMongoRepository<T> extends BaseRepository<T> {
  findByQuery(query: any): Promise<T[]>;
  findOneByQuery(query: any): Promise<T | null>;
  updateByQuery(query: any, data: Partial<T>): Promise<T | null>;
  deleteByQuery(query: any): Promise<boolean>;
}

export abstract class BasePgRepository<T> {
  protected pool: Pool;
  protected tableName: string;

  constructor(pool: Pool, tableName: string) {
    this.pool = pool;
    this.tableName = tableName;
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findAll(): Promise<T[]> {
    const result = await this.pool.query(`SELECT * FROM ${this.tableName}`);
    return result.rows;
  }

  async create(data: Partial<T>): Promise<T> {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

    const result = await this.pool.query(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const result = await this.pool.query(
      `UPDATE ${this.tableName} 
      SET ${setClause}, updated_at = $${Object.keys(data).length + 2}
      WHERE id = $1
      RETURNING *`,
      [id, ...Object.values(data), new Date()]
    );

    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query(
      `DELETE FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rowCount > 0;
  }

  async findByCondition(condition: string, values: any[]): Promise<T[]> {
    const result = await this.pool.query(
      `SELECT * FROM ${this.tableName} WHERE ${condition}`,
      values
    );
    return result.rows;
  }

  async findOneByCondition(condition: string, values: any[]): Promise<T | null> {
    const result = await this.pool.query(
      `SELECT * FROM ${this.tableName} WHERE ${condition}`,
      values
    );
    return result.rows[0] || null;
  }

  async updateByCondition(condition: string, data: Partial<T>, values: any[]): Promise<T[]> {
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + values.length + 1}`)
      .join(', ');

    const result = await this.pool.query(
      `UPDATE ${this.tableName} 
      SET ${setClause}, updated_at = $${Object.keys(data).length + values.length + 1}
      WHERE ${condition}
      RETURNING *`,
      [...values, ...Object.values(data), new Date()]
    );

    return result.rows;
  }

  async deleteByCondition(condition: string, values: any[]): Promise<boolean> {
    const result = await this.pool.query(
      `DELETE FROM ${this.tableName} WHERE ${condition}`,
      values
    );
    return result.rowCount > 0;
  }
} 