import { useState } from 'react';

export default function FormularioCorretor() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      const response = await fetch('/api/criar-corretor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, password: senha })
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.error || 'Erro desconhecido');
      }

      setMensagem({ tipo: 'sucesso', texto: 'Novo corretor ativado e cadastrado no sistema!' });
      setNome('');
      setEmail('');
      setSenha('');
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCadastro} className="form-crud">
      <h3>Cadastrar Novo Corretor</h3>
      <p style={{ fontSize: '13px', color: '#666', marginTop: '-10px', marginBottom: '10px' }}>
        O usuário será criado no sistema com a role padrão de acesso restrito a imóveis.
      </p>

      {mensagem.texto && (
        <div className={`alerta ${mensagem.tipo}`}>{mensagem.texto}</div>
      )}

      <div className="form-group">
        <label>Nome Completo do Corretor</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Ex: João Silva" />
      </div>

      <div className="form-group">
        <label>E-mail de Acesso</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="joao@realsimestate.com" />
      </div>

      <div className="form-group">
        <label>Senha Provisória</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6} placeholder="Mínimo 6 caracteres" />
      </div>

      <button type="submit" disabled={loading} className="btn-enviar">
        {loading ? 'Processando Cadastro...' : 'Ativar Conta do Corretor'}
      </button>
    </form>
  );
}