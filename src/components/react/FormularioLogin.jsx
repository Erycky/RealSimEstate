import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function FormularioLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message);
      setLoading(false);
    } else {
      // Login feito com sucesso! Redireciona direto para a tela de cadastro
      window.location.href = '/admin/novo';
    }
  };

  return (
    <div className="login-box">
      <h3>Acesso ao Painel</h3>
      <p>Identifique-se para gerenciar os imóveis</p>

      {erro && <div className="alerta erro">{erro}</div>}

      <form onSubmit={handleLogin} className="form-crud">
        <div className="form-group">
          <label>E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="corretor@realimestate.com" />
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required placeholder="••••••••" />
        </div>

        <button type="submit" disabled={loading} className="btn-enviar">
          {loading ? 'Autenticando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}