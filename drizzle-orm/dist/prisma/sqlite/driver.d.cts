import { BaseSQLiteDatabase } from "../../sqlite-core/index.cjs";
import type { DrizzleConfig } from "../../utils.cjs";
export type PrismaSQLiteDatabase = BaseSQLiteDatabase<'async', []>;
export type PrismaSQLiteConfig = Omit<DrizzleConfig, 'schema'>;
export declare function drizzle(config?: PrismaSQLiteConfig): (client: any) => import("@prisma/client").PrismaClientExtends<import("@prisma/client/runtime/library").InternalArgs<{}, {}, {}, {
    $drizzle: PrismaSQLiteDatabase;
}> & import("@prisma/client/runtime/library").DefaultArgs>;
