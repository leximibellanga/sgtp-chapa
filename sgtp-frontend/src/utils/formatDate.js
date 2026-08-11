const meses = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const diaSemanaString = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function formatarDate(data) {
  // pegar data completa: 12-08-2026T12:12:49 = 12/08/2026
  const criadoEm = new Date(data);

  // formatar dia da semana: [dom, seg, ter, qua, qui, sex, sab]
  const diaSemana = criadoEm.getDay();
  // formatar dia
  const dia =
    criadoEm.getDate() >= 10 ? criadoEm.getDate() : `0${criadoEm.getDate()}`;
  // formatar mes
  const mes = meses[criadoEm.getMonth()];
  // formatar ano
  const ano = criadoEm.getFullYear();

  // Organizar e exibir a data completa
  const dataFormatada = `${diaSemanaString[diaSemana]}, ${dia} ${mes} / ${ano}`;
  return dataFormatada;
}


