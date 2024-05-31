"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var unique_constraint_exports = {};
__export(unique_constraint_exports, {
  UniqueConstraint: () => UniqueConstraint,
  UniqueConstraintBuilder: () => UniqueConstraintBuilder,
  UniqueOnConstraintBuilder: () => UniqueOnConstraintBuilder,
  unique: () => unique,
  uniqueKeyName: () => uniqueKeyName
});
module.exports = __toCommonJS(unique_constraint_exports);
var import_entity = require("../entity.cjs");
var import_table = require("./table.cjs");
function unique(name) {
  return new UniqueOnConstraintBuilder(name);
}
function uniqueKeyName(table, columns) {
  return `${table[import_table.MySqlTable.Symbol.Name]}_${columns.join("_")}_unique`;
}
class UniqueConstraintBuilder {
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  static [import_entity.entityKind] = "MySqlUniqueConstraintBuilder";
  /** @internal */
  columns;
  /** @internal */
  build(table) {
    return new UniqueConstraint(table, this.columns, this.name);
  }
}
class UniqueOnConstraintBuilder {
  static [import_entity.entityKind] = "MySqlUniqueOnConstraintBuilder";
  /** @internal */
  name;
  constructor(name) {
    this.name = name;
  }
  on(...columns) {
    return new UniqueConstraintBuilder(columns, this.name);
  }
}
class UniqueConstraint {
  constructor(table, columns, name) {
    this.table = table;
    this.columns = columns;
    this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
  }
  static [import_entity.entityKind] = "MySqlUniqueConstraint";
  columns;
  name;
  nullsNotDistinct = false;
  getName() {
    return this.name;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UniqueConstraint,
  UniqueConstraintBuilder,
  UniqueOnConstraintBuilder,
  unique,
  uniqueKeyName
});
//# sourceMappingURL=unique-constraint.cjs.map