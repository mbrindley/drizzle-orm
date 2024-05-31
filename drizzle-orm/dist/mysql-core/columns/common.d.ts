import { ColumnBuilder } from "../../column-builder.js";
import type { ColumnBuilderBase, ColumnBuilderBaseConfig, ColumnBuilderExtraConfig, ColumnBuilderRuntimeConfig, ColumnDataType, HasDefault } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { Column } from "../../column.js";
import { entityKind } from "../../entity.js";
import type { UpdateDeleteAction } from "../foreign-keys.js";
import type { MySqlTable } from "../table.js";
import type { Update } from "../../utils.js";
export interface ReferenceConfig {
    ref: () => MySqlColumn;
    actions: {
        onUpdate?: UpdateDeleteAction;
        onDelete?: UpdateDeleteAction;
    };
}
export interface MySqlColumnBuilderBase<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TTypeConfig extends object = object> extends ColumnBuilderBase<T, TTypeConfig & {
    dialect: 'mysql';
}> {
}
export declare abstract class MySqlColumnBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string> & {
    data: any;
}, TRuntimeConfig extends object = object, TTypeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends ColumnBuilder<T, TRuntimeConfig, TTypeConfig & {
    dialect: 'mysql';
}, TExtraConfig> implements MySqlColumnBuilderBase<T, TTypeConfig> {
    static readonly [entityKind]: string;
    private foreignKeyConfigs;
    references(ref: ReferenceConfig['ref'], actions?: ReferenceConfig['actions']): this;
    unique(name?: string): this;
}
export declare abstract class MySqlColumn<T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends Column<T, TRuntimeConfig, {
    dialect: 'mysql';
}> {
    readonly table: MySqlTable;
    static readonly [entityKind]: string;
    constructor(table: MySqlTable, config: ColumnBuilderRuntimeConfig<T['data'], TRuntimeConfig>);
}
export type AnyMySqlColumn<TPartial extends Partial<ColumnBaseConfig<ColumnDataType, string>> = {}> = MySqlColumn<Required<Update<ColumnBaseConfig<ColumnDataType, string>, TPartial>>>;
export interface MySqlColumnWithAutoIncrementConfig {
    autoIncrement: boolean;
}
export declare abstract class MySqlColumnBuilderWithAutoIncrement<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> extends MySqlColumnBuilder<T, TRuntimeConfig & MySqlColumnWithAutoIncrementConfig, TExtraConfig> {
    static readonly [entityKind]: string;
    constructor(name: NonNullable<T['name']>, dataType: T['dataType'], columnType: T['columnType']);
    autoincrement(): HasDefault<this>;
}
export declare abstract class MySqlColumnWithAutoIncrement<T extends ColumnBaseConfig<ColumnDataType, string> = ColumnBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object> extends MySqlColumn<T, MySqlColumnWithAutoIncrementConfig & TRuntimeConfig> {
    static readonly [entityKind]: string;
    readonly autoIncrement: boolean;
}
