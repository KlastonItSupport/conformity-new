export const companiesMock = [
  {
    id: 1,
    name: "Empresa A",
    contact: "empresaA@example.com",
    usersLimit: 100,
    memoryLimit: "1",
    status: "ativo",
  },
  {
    id: 2,
    name: "Empresa B",
    contact: "empresaB@example.com",
    usersLimit: 50,
    memoryLimit: "500",
    status: "ativo",
  },
  {
    id: 3,
    name: "Empresa C",
    contact: "empresaC@example.com",
    usersLimit: 200,
    memoryLimit: "2",
    status: "inativo",
  },
  {
    id: 4,
    name: "Empresa D",
    contact: "empresaD@example.com",
    usersLimit: 150,
    memoryLimit: "1.5",
    status: "ativo",
  },
  {
    id: 5,
    name: "Empresa E",
    contact: "empresaE@example.com",
    usersLimit: 75,
    memoryLimit: "750",
    status: "ativo",
  },
  {
    id: 6,
    name: "Empresa F",
    contact: "empresaF@example.com",
    usersLimit: 300,
    memoryLimit: "3",
    status: "ativo",
  },
  {
    id: 7,
    name: "Empresa G",
    contact: "empresaG@example.com",
    usersLimit: 120,
    memoryLimit: "1.2",
    status: "inativo",
  },
  {
    id: 8,
    name: "Empresa H",
    contact: "empresaH@example.com",
    usersLimit: 250,
    memoryLimit: "2.5",
    status: "ativo",
  },
  {
    id: 9,
    name: "Empresa I",
    contact: "empresaI@example.com",
    usersLimit: 80,
    memoryLimit: "800",
    status: "ativo",
  },
  {
    id: 10,
    name: "Empresa J",
    contact: "empresaJ@example.com",
    usersLimit: 180,
    memoryLimit: "1.8",
    status: "ativo",
  },
];

export const columns = [
  { header: "Nome", access: "name" },
  { header: "Contato", access: "contact" },
  {
    header: "Limite de Usuários",
    access: "usersLimit",
    sortFunc: (a, b, key, newDirection) => {
      return (b[key] - a[key]) * (newDirection === "asc" ? 1 : -1);
    },
  },
  { header: "Limite de Espaço(MB)", access: "memoryLimit" },
  { header: "Status", access: "status" },
];