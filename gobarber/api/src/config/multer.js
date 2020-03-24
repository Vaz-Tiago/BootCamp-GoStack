import multer from 'multer';

// Gerar caracteres aleatórios para nome de arquivo
import crypto from 'crypto';

// extname para pegar a extensão do arquivo e resolve para definir o caminho
import { extname, resolve } from 'path';

export default {
  // Definições do multer
  // storage é o tipo de armazenamento
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // Define uma função para renomear o arquivo antes de ser armazenado:
    // (infoRequisição, infoArquivo, callback)
    filename: (req, file, cb) => {
      // randomBytes para gerar nome do arquivo unico.
      // Quantidade de bytes e callback
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        // null pq nao deu erro nenhum,
        // converte a resposta para uma string hexadecimal e concatena
        // com a extensão do arquivo original
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
