import { QueryInterface, DataTypes } from "sequelize";

const migration = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const query1 = queryInterface.addColumn(
        "table",
        "column",
        { type: DataTypes.STRING },
        { transaction },
      );

      await Promise.all([query1]);
    });
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const query1 = queryInterface.removeColumn("table", "column", { transaction });
      await Promise.all([query1]);
    });
  },
};

export default migration;
