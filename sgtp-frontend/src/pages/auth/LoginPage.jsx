import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import imgUrl from "../../assets/images/img-login.png";

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
      navigate(
        usuario.role === "ADMIN" ? "/admin/dashboard" : "/motorista/dashboard",
      );
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
        <form
          onSubmit={handleSubmit}
          className="px-5 py-7.5 flex flex-col gap-8 w-90"
        >
          <div className="flex flex-col gap-3 items-center ">
            <h3 className="text-2xl text-emerald-950 font-bold">Login</h3>
            <p className="text-sm text-emerald-950/70 text-center">
              Bem-vindo novamente <br />
              Faca login com as suas credenciais.
            </p>
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
                Esqueceu a senha?{" "}
                <a href="#" className="font-medium hover:underline">
                  Recuperar.
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
