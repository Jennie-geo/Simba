/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('transactions', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    reference: {
      type: 'text',
      unique: true,
    },
    sender: {
      type: 'VARCHAR(15)',
    },
    amount: {
      type: 'bigint',
    },
    receiver: {
      type: 'VARCHAR(15)',
    },
    description: {
      type: 'text',
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('transactions');
};
