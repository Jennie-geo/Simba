/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('accounts', {
    userId: {
      type: 'serial',
      primarykey: true,
    },
    account_no: {
      type: 'VARCHAR(15)',
      unique: true,
    },
    balance: {
      type: 'bigint',
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('accounts');
};
