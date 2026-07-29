import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import imgUrl from "../../assets/images/img-login.png"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const usuario = await login(email, senha);
      navigate(usuario.role === "ADMIN" ? "/admin/dashboard" : "/motorista/dashboard");
    } catch (err) {
      setErro("Email ou senha invalidos!");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#001f18] flex items-center justify-center">
      {/* img fundo */}
      <img
        src={imgUrl}
        alt="Imagem de fundo"
        className="absolute top-0 bottom-0 w-full h-full object-cover object-bottom z-0"
      />
      <div className=" flex gap-2.5 bg-[#f8f8ff] p-2.5 rounded-xl z-10 shadow">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-5 py-7.5 flex flex-col gap-8 w-90">
          <div className="flex flex-col gap-3 items-center ">
            <h3 className="text-2xl text-emerald-950 font-bold">Login</h3>
            <p className="text-sm text-emerald-950/70 text-center">Bem-vindo novamente <br />Faca login com as suas credenciais.</p>
          </div>

          <div>
            {erro && (
              <div className="bg-red-50 text-red-800 text-sm border border-red-600 rounded-lg px-4 py-3 mb-2">
                {erro}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teu@email.com"
              className="mb-2"
            />

            <Input
              label="Senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
              className="mb-2"
            />

            <Button type="submit" loading={carregando} className="w-full mt-2">
              {carregando ? "A entrar..." : "Entrar"}
            </Button>

            <div className="text-center">
              <p className="mt-5 text-sm text-emerald-950">
                Esqueceu a senha? <a href="#" className="font-medium hover:underline">Recuperar.</a>
              </p>
            </div>
          </div>
        </form>
      </div>






      {/* Painel de marca - so desktop */}
      {/* <div className={`hidden md:flex lg:w-1/2 bg-[#003328] relative overflow-hidden flex-col justify-between p-12`}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 70%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <span className="font-display text-2xl font-bold text-white relative">
          SGTP Chapa
        </span>

        <div className="relative">
          <div className="inline-block bg-violeta rounded-2xl px-6 py-5 mb-6">
            <p className="text-xs font-bold text-white/80 tracking-widest mb-1">
              META DE HOJE
            </p>
            <p className="font-display text-3xl font-bold text-white">2.500 MT</p>
          </div>
          <h2 className="font-display text-3xl font-bold text-white leading-tight mb-3">
            Gestao de transporte,<br />sem confusao no fim do dia.
          </h2>
          <p className="text-white/70 text-sm max-w-sm">
            Controla receitas, gastos e o desempenho de cada carro e motorista, tudo num so lugar.
          </p>
        </div>

        <span className="text-white/40 text-xs relative">
          Sistema de Gestao de Transporte Privado
        </span>
      </div> */}

      {/* Formulario */}
      {/* <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#f9ffe3] lg:bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <span className="font-display text-xl font-bold text-verde-mata lg:hidden block mb-6">
              SGTP Chapa
            </span>
            <h1 className="font-display text-2xl font-bold text-verde-mata mb-1">
              Entrar
            </h1>
            <p className="text-sm text-text-muted">
              Usa as credenciais fornecidas pelo administrador.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {erro && (
              <div className="bg-red-50 text-red-600 text-sm border border-red-600 rounded-lg px-4 py-3">
                {erro}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teu@email.com"
            />

            <Input
              label="Senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
            />

            <Button variant={"perigo"} type="submit" loading={carregando} className="w-full mt-2">
              {carregando ? "A entrar..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div> */}
    </div>
  );
}
