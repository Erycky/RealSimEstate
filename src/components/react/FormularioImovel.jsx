import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function FormularioImovel() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  
  // Estados para os campos do imóvel
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [tipo, setTipo] = useState('venda');
  const [quartos, setQuartos] = useState(0);
  const [banheiros, setBanheiros] = useState(0);
  const [garagens, setGaragens] = useState(0);
  const [localizacao, setLocalizacao] = useState('');
  const [imagens, setImagens] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // CORRIGIDO: Agora o estado altera corretamente e não quebra o clique
    setMensagem({ tipo: '', texto: '' });

    try {
      // 1. Inserir o Imóvel na tabela 'imoveis'
      const { data: imovelInserido, error: erroImovel } = await supabase
        .from('imoveis')
        .insert([
          {
            titulo,
            descricao,
            preco: parseFloat(preco),
            tipo, 
            quartos: parseInt(quartos),
            banheiros: parseInt(banheiros),
            garagens: parseInt(garagens),
            localizacao,
            status: 'aprovado' 
          }
        ])
        .select()
        .single();

      if (erroImovel) throw erroImovel;

      const imovelId = imovelInserido.id;

      // 2. Se houver imagens selecionadas, faz o upload e vincula
      if (imagens.length > 0) {
        for (const file of imagens) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${imovelId}/${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          // Bucket corrigido para 'fotos-imoveis'
          const { error: uploadError } = await supabase.storage
            .from('fotos-imoveis')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('fotos-imoveis')
            .getPublicUrl(filePath);

          // Tabela de relacionamento 'imagens_imovel'
          const { error: erroLinkImagem } = await supabase
            .from('imagens_imovel')
            .insert([
              {
                imovel_id: imovelId,
                url_storage: publicUrl
              }
            ]);

          if (erroLinkImagem) throw erroLinkImagem;
        }
      }

      setMensagem({ tipo: 'sucesso', texto: 'Imóvel e imagens cadastrados com sucesso!' });
      
      // Limpa o formulário
      setTitulo(''); setDescricao(''); setPreco(''); setQuartos(0); setBanheiros(0); setGaragens(0); setLocalizacao(''); setImagens([]);
    } catch (error) {
      console.error(error);
      setMensagem({ tipo: 'erro', texto: `Erro ao cadastrar: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-crud">
      <h3>Cadastrar Novo Imóvel</h3>
      
      {mensagem.texto && (
        <div className={`alerta ${mensagem.tipo}`}>{mensagem.texto}</div>
      )}

      <div className="form-group">
        <label>Título do Anúncio</label>
        <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ex: Sobrado moderno no Centro" />
      </div>

      <div className="form-group">
        <label>Descrição Detalhada</label>
        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required placeholder="Descreva os diferenciais do imóvel..."></textarea>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Preço (R$)</label>
          <input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} required placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Tipo de Negócio</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </select>
        </div>
      </div>

      <div className="form-row count-row">
        <div className="form-group">
          <label>Quartos</label>
          <input type="number" value={quartos} onChange={(e) => setQuartos(e.target.value)} min="0" />
        </div>
        <div className="form-group">
          <label>Banheiros</label>
          <input type="number" value={banheiros} onChange={(e) => setBanheiros(e.target.value)} min="0" />
        </div>
        <div className="form-group">
          <label>Garagens/Vagas</label>
          <input type="number" value={garagens} onChange={(e) => setGaragens(e.target.value)} min="0" />
        </div>
      </div>

      <div className="form-group">
        <label>Localização / Bairro</label>
        <input type="text" value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} required placeholder="Ex: Universitário, Santa Cruz do Sul" />
      </div>

      <div className="form-group">
        <label>Fotos do Imóvel</label>
        <input type="file" multiple accept="image/*" onChange={(e) => setImagens(Array.from(e.target.files))} />
        <small>Você pode selecionar várias fotos de uma vez.</small>
      </div>

      <button type="submit" disabled={loading} className="btn-enviar">
        {loading ? 'Salvando no Banco...' : 'Publicar Imóvel'}
      </button>
    </form>
  );
}