import { entityKind } from "./entity.js";
import type { Column } from "./column.js";
import type { MySqlColumn } from "./mysql-core/index.js";
import type { ExtraConfigColumn, PgColumn } from "./pg-core/index.js";
import type { SQL } from "./sql/sql.js";
import type { SQLiteColumn } from "./sqlite-core/index.js";
import type { Simplify } from "./utils.js";
export type ColumnDataType = 'string' | 'number' | 'boolean' | 'array' | 'json' | 'date' | 'bigint' | 'custom' | 'buffer';
export type Dialect = 'pg' | 'mysql' | 'sqlite' | 'common';
export interface ColumnBuilderBaseConfig<TDataType extends ColumnDataType, TColumnType extends string> {
    name: string;
    dataType: TDataType;
    columnType: TColumnType;
    data: unknown;
    driverParam: unknown;
    enumValues: string[] | undefined;
}
export type MakeColumnConfig<T extends ColumnBuilderBaseConfig<ColumnDataType, string>, TTableName extends string> = {
    name: T['name'];
    tableName: TTableName;
    dataType: T['dataType'];
    columnType: T['columnType'];
    data: T extends {
        $type: infer U;
    } ? U : T['data'];
    driverParam: T['driverParam'];
    notNull: T extends {
        notNull: true;
    } ? true : false;
    hasDefault: T extends {
        hasDefault: true;
    } ? true : false;
    enumValues: T['enumValues'];
    baseColumn: T extends {
        baseBuilder: infer U extends ColumnBuilderBase;
    } ? BuildColumn<TTableName, U, 'common'> : never;
} & {};
export type ColumnBuilderTypeConfig<T extends ColumnBuilderBaseConfig<ColumnDataType, string>, TTypeConfig extends object = object> = Simplify<{
    brand: 'ColumnBuilder';
    name: T['name'];
    dataType: T['dataType'];
    columnType: T['columnType'];
    data: T['data'];
    driverParam: T['driverParam'];
    notNull: T extends {
        notNull: infer U;
    } ? U : boolean;
    hasDefault: T extends {
        hasDefault: infer U;
    } ? U : boolean;
    enumValues: T['enumValues'];
} & TTypeConfig>;
export type ColumnBuilderRuntimeConfig<TData, TRuntimeConfig extends object = object> = {
    name: string;
    notNull: boolean;
    default: TData | SQL | undefined;
    defaultFn: (() => TData | SQL) | undefined;
    onUpdateFn: (() => TData | SQL) | undefined;
    hasDefault: boolean;
    primaryKey: boolean;
    isUnique: boolean;
    uniqueName: string | undefined;
    uniqueType: string | undefined;
    dataType: string;
    columnType: string;
} & TRuntimeConfig;
export interface ColumnBuilderExtraConfig {
    primaryKeyHasDefault?: boolean;
}
export type NotNull<T extends ColumnBuilderBase> = T & {
    _: {
        notNull: true;
    };
};
export type HasDefault<T extends ColumnBuilderBase> = T & {
    _: {
        hasDefault: true;
    };
};
export type $Type<T extends ColumnBuilderBase, TType> = T & {
    _: {
        $type: TType;
    };
};
export interface ColumnBuilderBase<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TTypeConfig extends object = object> {
    _: ColumnBuilderTypeConfig<T, TTypeConfig>;
}
export declare abstract class ColumnBuilder<T extends ColumnBuilderBaseConfig<ColumnDataType, string> = ColumnBuilderBaseConfig<ColumnDataType, string>, TRuntimeConfig extends object = object, TTypeConfig extends object = object, TExtraConfig extends ColumnBuilderExtraConfig = ColumnBuilderExtraConfig> implements ColumnBuilderBase<T, TTypeConfig> {
    static readonly [entityKind]: string;
    _: ColumnBuilderTypeConfig<T, TTypeConfig>;
    protected config: ColumnBuilderRuntimeConfig<T['data'], TRuntimeConfig>;
    constructor(name: T['name'], dataType: T['dataType'], columnType: T['columnType']);
    /**
     * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
     *
     * @example
     * ```ts
     * const users = pgTable('users', {
     * 	id: integer('id').$type<UserId>().primaryKey(),
     * 	details: json('details').$type<UserDetails>().notNull(),
     * });
     * ```
     */
    $type<TType>(): $Type<this, TType>;
    /**
     * Adds a `not null` clause to the column definition.
     *
     * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
     */
    notNull(): NotNull<this>;
    /**
     * Adds a `default <value>` clause to the column definition.
     *
     * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
     *
     * If you need to set a dynamic default value, use {@link $defaultFn} instead.
     */
    default(value: (this['_'] extends {
        $type: infer U;
    } ? U : this['_']['data']) | SQL): HasDefault<this>;
    /**
     * Adds a dynamic default value to the column.
     * The function will be called when the row is inserted, and the returned value will be used as the column value.
     *
     * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
     */
    $defaultFn(fn: () => (this['_'] extends {
        $type: infer U;
    } ? U : this['_']['data']) | SQL): HasDefault<this>;
    /**
     * Alias for {@link $defaultFn}.
     */
    $default: (fn: () => SQL<unknown> | (this["_"] extends {
        $type: infer U;
    } ? U : this["_"]["data"])) => HasDefault<this>;
    /**
     * Adds a dynamic update value to the column.
     * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
     * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
     *
     * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
     */
    $onUpdateFn(fn: () => (this['_'] extends {
        $type: infer U;
    } ? U : this['_']['data']) | SQL): HasDefault<this>;
    /**
     * Alias for {@link $onUpdateFn}.
     */
    $onUpdate: (fn: () => SQL<unknown> | (this["_"] extends {
        $type: infer U;
    } ? U : this["_"]["data"])) => HasDefault<this>;
    /**
     * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
     *
     * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
     */
    primaryKey(): TExtraConfig['primaryKeyHasDefault'] extends true ? HasDefault<NotNull<this>> : NotNull<this>;
}
export type BuildColumn<TTableName extends string, TBuilder extends ColumnBuilderBase, TDialect extends Dialect> = TDialect extends 'pg' ? PgColumn<MakeColumnConfig<TBuilder['_'], TTableName>> : TDialect extends 'mysql' ? MySqlColumn<MakeColumnConfig<TBuilder['_'], TTableName>> : TDialect extends 'sqlite' ? SQLiteColumn<MakeColumnConfig<TBuilder['_'], TTableName>> : TDialect extends 'common' ? Column<MakeColumnConfig<TBuilder['_'], TTableName>> : never;
export type BuildIndexColumn<TDialect extends Dialect> = TDialect extends 'pg' ? ExtraConfigColumn : never;
export type BuildColumns<TTableName extends string, TConfigMap extends Record<string, ColumnBuilderBase>, TDialect extends Dialect> = {
    [Key in keyof TConfigMap]: BuildColumn<TTableName, TConfigMap[Key], TDialect>;
} & {};
export type BuildExtraConfigColumns<_TTableName extends string, TConfigMap extends Record<string, ColumnBuilderBase>, TDialect extends Dialect> = {
    [Key in keyof TConfigMap]: BuildIndexColumn<TDialect>;
} & {};
export type ChangeColumnTableName<TColumn extends Column, TAlias extends string, TDialect extends Dialect> = TDialect extends 'pg' ? PgColumn<MakeColumnConfig<TColumn['_'], TAlias>> : TDialect extends 'mysql' ? MySqlColumn<MakeColumnConfig<TColumn['_'], TAlias>> : TDialect extends 'sqlite' ? SQLiteColumn<MakeColumnConfig<TColumn['_'], TAlias>> : never;