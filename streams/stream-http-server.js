import fs from 'node:fs';
import { parse } from 'csv-parse';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(`${__dirname}/fs_read.csv`)
    .pipe(parse({}));
  for await (const record of parser) { 
    if (records.length) {
        const [title, description] = record[0].split(';');
        const data = {
            title,
            description
        }

        fetch('http://localhost:3333/tasks', {
            method: "POST",
            body: JSON.stringify(data)
        })
    }
    records.push(record);
  }
  return records;
};

(async () => {
  const records = await processFile();
  console.log(records);
})();