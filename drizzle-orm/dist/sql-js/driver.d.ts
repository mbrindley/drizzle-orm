import type { Database } from 'sql.js';
import { BaseSQLiteDatabase } from "../sqlite-core/db.js";
import type { DrizzleConfig } from "../utils.js";
export type SQLJsDatabase<TSchema extends Record<string, unknown> = Record<string, never>> = BaseSQLiteDatabase<'sync', void, TSchema>;
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>>(client: Database, config?: DrizzleConfig<TSchema>): SQLJsDatabase<TSchema>;
