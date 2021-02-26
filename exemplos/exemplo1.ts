// function enviarEmail(para, id, assunto, texto) {
//   console.log(para, id, assunto, texto);
// }

// class EnviarEmailParaUsuario {
//   send() {
//     enviarEmail('drigosantos@gmail.com', 9899, 'Olá!', 'Tudo bem?');
//   }
// }

interface DdosDeEnvioDeEmail {
  para: string;
  id: string;
  assunto: string;
  texto: string
}

function enviarEmail({ para, id, assunto, texto }: DdosDeEnvioDeEmail) {
  console.log(para, id, assunto, texto);
}

class EnviarEmailParaUsuario {
  send() {
    enviarEmail({
      para: 'drigosantos@gmail.com', 
      id: '9899', 
      assunto: 'Olá!', 
      texto: 'Tudo bem?'});
  }
}