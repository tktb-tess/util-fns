import { fromBase64 } from './base64';

interface EncodeTable {
  readonly 6: readonly string[];
  readonly 14: readonly string[];
}

interface DecodeTable {
  readonly 6: Readonly<Record<string, number>>;
  readonly 14: Readonly<Record<string, number>>;
}

let tables: readonly [EncodeTable, DecodeTable] | undefined;

function decodeBase64(base64: string) {
  const bin = fromBase64(base64, { alphabet: 'base64url' });
  const ranges = new Uint16Array(bin.buffer);

  return [...Array(ranges.length / 2)].flatMap((_, i) => {
    const start = ranges.at(2 * i);
    const end = ranges.at(2 * i + 1);
    if (start == null || end == null) {
      throw TypeError('unexpected');
    }
    const r = [...Array(end - start + 1)].map((_, i) => start + i);
    return [...String.fromCharCode(...r)];
  });
}

function genTable() {
  const ranges6Bit = 'uk75Tg';
  const ranges14Bit: string =
    'ak6ETq9OuU6KTz5RUlFkUWlRalF6UYFRi1GVUaJRqlHHUd9R7FH0UU9SmlLOUvhSDVMUUydTN1M8U0BTWVNbU3dTgVOYU7VTvlPHU9NT4lNgVNZW81YeV5lX6lj6WAFZC1kUWR5ZJllLWXJZpVlPW2pbf1u-W_dbB1wOXBtcIVwsXDdcRlxtXIFc2l0IXnFen17zXvde_V4JXwpfIF9PX1RfYF9kX3JffF_CXxlgB2IRYjViPmJKYqpiLmUxZTNlPGWGZYtllmWXZaNlqmW4Zbll32XiZeRlaGbvZvdmB2cRZydnwWcfazFrYWtua3hrgmuya7NrymvQa9Nr12vaa99rDmwibDNsXm1qcNJwKXIycjVyPXI-ckRyRnJKclhycXKrcuFyg3PMc9t03XTldOd0F3UZdR51IHUndVN1inWMdZF1sXV1dnd2fHaSdq12r3a-dtZ27XYxd9p33Hfhd-N38ncueDl5PHm3ebl5vXnceXN6g3rKesx6-Ho6e3J8gnz3fBJ9nn5Cf1B_d3-Jf5d_vH--fwCABYALgCOAMoA3gH6AgYCIgIqA4oHkgemB9IH7gQWCC4IUghqCHIIegjSCbYJwgnGCc4J3gjaDTIZOhmqGhYY_iEGIS4hOiGKIZoh9iYGJiomMicCJ04n_iQKKn4s4jEWMR4xUjFeMd4x5jJyMnowcjWWNb415jbKNtI2qjqyOyY7LjmWPnI-vj7GPtI_Cj5CQkpBIkUqRxZHHkcuRzZHQkdORhJR4lX-VgZXnlR6WtZa3lriWupbnlumWUJdSl12XX5dhl2OXaJdql8qXzJfll-6X8pf0lwCYAph0mKmYzZjcmN2Y4ZhimZeZmJmamauZrZlrmqma15rZmt6a4JokmyabLpsvmzGbMps7mz2bWZtbm3uc5ZwennWefp5_nqSepZ66nruewp7DnsyezZ7QntGe-J75nvye_Z4Nnw6fEp8Tnx-fIJ86nzufSZ9Kn0-fUp9-n42fmJ-cn56foJ-vn7Kfs5-8n8Wfz5_vnw';

  const e6bit = decodeBase64(ranges6Bit);
  const e14bit = decodeBase64(ranges14Bit);

  const eta: EncodeTable = {
    6: e6bit,
    14: e14bit,
  };

  const d6bit = Object.fromEntries(e6bit.map((s, i) => [s, i] as const));
  const d14bit = Object.fromEntries(e14bit.map((s, i) => [s, i] as const));
  Object.setPrototypeOf(d6bit, null);
  Object.setPrototypeOf(d14bit, null);

  const dta: DecodeTable = {
    6: d6bit,
    14: d14bit,
  };
  Object.setPrototypeOf(dta, null);

  return [eta, dta] as const;
}

export function getETable() {
  tables ??= genTable();
  return tables[0];
}

export function getDTable() {
  tables ??= genTable();
  return tables[1];
}
