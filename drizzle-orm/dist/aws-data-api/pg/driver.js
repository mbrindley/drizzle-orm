import { entityKind, is } from "../../entity.js";
import { DefaultLogger } from "../../logger.js";
import { PgDatabase } from "../../pg-core/db.js";
import { PgDialect } from "../../pg-core/dialect.js";
import { PgArray } from "../../pg-core/index.js";
import {
  createTableRelationsHelpers,
  extractTablesRelationalConfig
} from "../../relations.js";
import { Param, sql } from "../../sql/sql.js";
import { Table } from "../../table.js";
import { AwsDataApiSession } from "./session.js";
class AwsDataApiPgDatabase extends PgDatabase {
  static [entityKind] = "AwsDataApiPgDatabase";
  execute(query) {
    return super.execute(query);
  }
}
class AwsPgDialect extends PgDialect {
  static [entityKind] = "AwsPgDialect";
  escapeParam(num) {
    return `:${num + 1}`;
  }
  buildInsertQuery({ table, values, onConflict, returning }) {
    const columns = table[Table.Symbol.Columns];
    for (const value of values) {
      for (const fieldName of Object.keys(columns)) {
        const colValue = value[fieldName];
        if (is(colValue, Param) && colValue.value !== void 0 && is(colValue.encoder, PgArray) && Array.isArray(colValue.value)) {
          value[fieldName] = sql`cast(${colValue} as ${sql.raw(colValue.encoder.getSQLType())})`;
        }
      }
    }
    return super.buildInsertQuery({ table, values, onConflict, returning });
  }
  buildUpdateSet(table, set) {
    const columns = table[Table.Symbol.Columns];
    for (const [colName, colValue] of Object.entries(set)) {
      const currentColumn = columns[colName];
      if (currentColumn && is(colValue, Param) && colValue.value !== void 0 && is(colValue.encoder, PgArray) && Array.isArray(colValue.value)) {
        set[colName] = sql`cast(${colValue} as ${sql.raw(colValue.encoder.getSQLType())})`;
      }
    }
    return super.buildUpdateSet(table, set);
  }
}
function construct(client, config) {
  const dialect = new AwsPgDialect({ casing: config.casing });
  let logger;
  if (config.logger === true) {
    logger = new DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  let schema;
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config.schema,
      createTableRelationsHelpers
    );
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new AwsDataApiSession(client, dialect, schema, { ...config, logger }, void 0);
  const db = new AwsDataApiPgDatabase(dialect, session, schema);
  db.$client = client;
  return db;
}
function drizzle(client, config) {
  return construct(client, config);
}
((drizzle2) => {
  function mock(config) {
    return construct({}, config);
  }
  drizzle2.mock = mock;
})(drizzle || (drizzle = {}));
export {
  AwsDataApiPgDatabase,
  AwsPgDialect,
  drizzle
};
//# sourceMappingURL=driver.js.map