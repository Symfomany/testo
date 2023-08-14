const fs = require('fs');
const csv = require('csv-parser');
const { v4: uuidv4 } = require('uuid');

const inputCSVFile = './fermage.csv'; // Chemin vers votre fichier CSV
const outputJSONLFile = './datas.jsonl'; // Chemin du fichier de sortie JSONL

const writeStream = fs.createWriteStream(outputJSONLFile);

fs.createReadStream(inputCSVFile)
  .pipe(csv({delimiter: ';'}))
  .on('data', (row) => {
    // Écrire chaque ligne en tant qu'objet JSON sur une nouvelle ligne
    console.log("row", row);
    row.id  = uuidv4()
    writeStream.write(JSON.stringify(row) + '\n');
  })
  .on('end', () => {
    console.log(`CSV converti en JSONL et sauvegardé dans ${outputJSONLFile}`);
  });