import type { ColumnBuilderBaseConfig } from "../../column-builder.cjs";
import type { ColumnBaseConfig } from "../../column.cjs";
import { entityKind } from "../../entity.cjs";
import type { SQL } from "../../sql/sql.cjs";
import type { AnySQLiteTable } from "../table.cjs";
import type { Equal } from "../../utils.cjs";
import { SQLiteColumn, SQLiteColumnBuilder } from "./common.cjs";
export type ConvertCustomConfig<TName extends string, T extends Partial<CustomTypeValues>> = {
    name: TName;
    dataType: 'custom';
    columnType: 'SQLiteCustomColumn';
    data: T['data'];
    driverParam: T['driverData'];
    enumValues: undefined;
} & (T['notNull'] extends true ? {
    notNull: true;
} : {}) & (T['default'] extends true ? {
    hasDefault: true;
} : {});
export interface SQLiteCustomColumnInnerConfig {
    customTypeValues: CustomTypeValues;
}
export declare class SQLiteCustomColumnBuilder<T extends ColumnBuilderBaseConfig<'custom', 'SQLiteCustomColumn'>> extends SQLiteColumnBuilder<T, {
    fieldConfig: CustomTypeValues['config'];
    customTypeParams: CustomTypeParams<any>;
}, {
    sqliteColumnBuilderBrand: 'SQLiteCustomColumnBuilderBrand';
}> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], fieldConfig: CustomTypeValues['config'], customTypeParams: CustomTypeParams<any>);
}
export declare class SQLiteCustomColumn<T extends ColumnBaseConfig<'custom', 'SQLiteCustomColumn'>> extends SQLiteColumn<T> {
    static readonly [entityKind]: string;
    private sqlName;
    private mapTo?;
    private mapFrom?;
    constructor(table: AnySQLiteTable<{
        name: T['tableName'];
    }>, config: SQLiteCustomColumnBuilder<T>['config']);
    getSQLType(): string;
    mapFromDriverValue(value: T['driverParam']): T['data'];
    mapToDriverValue(value: T['data']): T['driverParam'];
}
export type CustomTypeValues = {
    /**
     * Required type for custom column, that will infer proper type model
     *
     * Examples:
     *
     * If you want your column to be `string` type after selecting/or on inserting - use `data: string`. Like `text`, `varchar`
     *
     * If you want your column to be `number` type after selecting/or on inserting - use `data: number`. Like `integer`
     */
    data: unknown;
    /**
     * Type helper, that represents what type database driver is accepting for specific database data type
     */
    driverData?: unknown;
    /**
     * What config type should be used for {@link CustomTypeParams} `dataType` generation
     */
    config?: unknown;
    /**
     * Whether the config argument should be required or not
     * @default false
     */
    configRequired?: boolean;
    /**
     * If your custom data type should be notNull by default you can use `notNull: true`
     *
     * @example
     * const customSerial = customType<{ data: number, notNull: true, default: true }>({
     * 	  dataType() {
     * 	    return 'serial';
     *    },
     * });
     */
    notNull?: boolean;
    /**
     * If your custom data type has default you can use `default: true`
     *
     * @example
     * const customSerial = customType<{ data: number, notNull: true, default: true }>({
     * 	  dataType() {
     * 	    return 'serial';
     *    },
     * });
     */
    default?: boolean;
};
export interface CustomTypeParams<T extends CustomTypeValues> {
    /**
     * Database data type string representation, that is used for migrations
     * @example
     * ```
     * `jsonb`, `text`
     * ```
     *
     * If database data type needs additional params you can use them from `config` param
     * @example
     * ```
     * `varchar(256)`, `numeric(2,3)`
     * ```
     *
     * To make `config` be of specific type please use config generic in {@link CustomTypeValues}
     *
     * @example
     * Usage example
     * ```
     *   dataType() {
     *     return 'boolean';
     *   },
     * ```
     * Or
     * ```
     *   dataType(config) {
     * 	   return typeof config.length !== 'undefined' ? `varchar(${config.length})` : `varchar`;
     * 	 }
     * ```
     */
    dataType: (config: T['config'] | (Equal<T['configRequired'], true> extends true ? never : undefined)) => string;
    /**
     * Optional mapping function, between user input and driver
     * @example
     * For example, when using jsonb we need to map JS/TS object to string before writing to database
     * ```
     * toDriver(value: TData): string {
     * 	 return JSON.stringify(value);
     * }
     * ```
     */
    toDriver?: (value: T['data']) => T['driverData'] | SQL;
    /**
     * Optional mapping function, that is responsible for data mapping from database to JS/TS code
     * @example
     * For example, when using timestamp we need to map string Date representation to JS Date
     * ```
     * fromDriver(value: string): Date {
     * 	return new Date(value);
     * },
     * ```
     */
    fromDriver?: (value: T['driverData']) => T['data'];
}
/**
 * Custom sqlite database data type generator
 */
export declare function customType<T extends CustomTypeValues = CustomTypeValues>(customTypeParams: CustomTypeParams<T>): Equal<T['configRequired'], true> extends true ? <TName extends string>(dbName: TName, fieldConfig: T['config']) => SQLiteCustomColumnBuilder<ConvertCustomConfig<TName, T>> : <TName extends string>(dbName: TName, fieldConfig?: T['config']) => SQLiteCustomColumnBuilder<ConvertCustomConfig<TName, T>>;
