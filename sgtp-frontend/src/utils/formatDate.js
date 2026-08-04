const meses = [
  "Jan.",
  "Fev.",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Ago.",
  "Set.",
  "Out.",
  "Nov.",
  "Dez.",
];

export default function formatarData(data) {
  // pegar data completa: 12-08-2026T12:12:49 = 12/08/2026
  const criadoEm = new Date(data);

  // formatar dia
  const dia =
    criadoEm.getDate() > 10 ? criadoEm.getDate() : `0${criadoEm.getDate()}`;
  // formatar mes
  const mes = meses[criadoEm.getMonth()];
  // formatar ano
  const ano = criadoEm.getFullYear();

  // Organizar e exibir a data completa
  const dataFormatada = `${dia} de ${mes} de ${ano}`;
  return dataFormatada;
}
