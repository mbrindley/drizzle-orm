import { entityKind } from "../../../entity.js";
import { PgColumn, PgColumnBuilder } from "../common.js";
class PgBinaryVectorBuilder extends PgColumnBuilder {
  static [entityKind] = "PgBinaryVectorBuilder";
  constructor(name, config) {
    super(name, "string", "PgBinaryVector");
    this.config.dimensions = config.dimensions;
  }
  /** @internal */
  build(table) {
    return new PgBinaryVector(
      table,
      this.config
    );
  }
}
class PgBinaryVector extends PgColumn {
  static [entityKind] = "PgBinaryVector";
  dimensions = this.config.dimensions;
  getSQLType() {
    return `bit(${this.dimensions})`;
  }
}
function bit(name, config) {
  return new PgBinaryVectorBuilder(name, config);
}
export {
  PgBinaryVector,
  PgBinaryVectorBuilder,
  bit
};
//# sourceMappingURL=bit.js.map