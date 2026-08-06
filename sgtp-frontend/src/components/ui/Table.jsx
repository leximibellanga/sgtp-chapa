import { FileX, Inbox } from "lucide-react";

const Table = ({ children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  );
};

const TableHead = ({ children }) => {
  return (
    <thead className="bg-emerald-950/5 border border-emerald-950/20">
      <tr className="text-left text-emerald-950/65">{children}</tr>
    </thead>
  );
};

const TableBody = ({ children }) => {
  return <tbody className="border border-emerald-950/20">{children}</tbody>;
};

const TableRow = ({ children, onClick }) => {
  return (
    <tr onClick={onClick} className={`border-b border-emerald-950/20 `}>
      {children}
    </tr>
  );
};

const TableTh = ({ titulo, className }) => {
  return <th className={`py-3 px-3 font-semibold ${className}`}>{titulo}</th>;
};

const TableTd = ({ text, className, children }) => {
  return (
    <td className={`${className} text-nowrap py-3 px-3 text-emerald-950/80`}>
      {children}
      {text}
    </td>
  );
};

const TableTdEmpty = ({ colSpan, textEmpty = "Nenhum registo encontrado" }) => {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="py-10 text-center text-emerald-950/60 text-sm"
      >
        <div className="flex flex-col items-center gap-5">
          <Inbox size={32} />
          {textEmpty}
        </div>
      </td>
    </tr>
  );
};

export {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableTh,
  TableTd,
  TableTdEmpty,
};
