import type { ColumnBuilderBaseConfig } from "../../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../../column.cjs";
import { entityKind } from "../../../entity.cjs";
import { PgColumn, PgColumnBuilder } from "../common.cjs";
export type PgVectorBuilderInitial<TName extends string> = PgVectorBuilder<{
    name: TName;
    dataType: 'array';
    columnType: 'PgVector';
    data: number[];
    driverParam: string;
    enumValues: undefined;
}>;
export declare class PgVectorBuilder<T extends ColumnBuilderBaseConfig<'array', 'PgVector'>> extends PgColumnBuilder<T, {
    dimensions: number | undefined;
}> {
    static readonly [entityKind]: string;
    constructor(name: string, config: PgVectorConfig);
}
export declare class PgVector<T extends ColumnBaseConfig<'array', 'PgVector'>> extends PgColumn<T, {
    dimensions: number | undefined;
}> {
    static readonly [entityKind]: string;
    readonly dimensions: number | undefined;
    getSQLType(): string;
    mapToDriverValue(value: unknown): unknown;
    mapFromDriverValue(value: string): unknown;
}
export interface PgVectorConfig {
    dimensions: number;
}
export declare function vector<TName extends string>(name: TName, config: PgVectorConfig): PgVectorBuilderInitial<TName>;
