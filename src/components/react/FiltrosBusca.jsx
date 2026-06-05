// src/components/react/FiltrosBusca.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import CardImovel from './CardImovel'; 

export default function FiltrosBusca() {
  const [buscaTexto, setBuscaTexto] = useState('');
  const [tipo, setTipo] = useState('null'); 
  const [quartos, setQuartos] = useState(null);
  const [banheiros, setBanheiros] = useState(null);
  const [garagem, setGaragem] = useState(null);
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');

  const [imoveis, setImoveis] = useState([]); 
  const [isOpen, setIsOpen] = useState(true); 
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(false);

  const ITENS_POR_PAGINA = 8;

  const estilos = {
    container: { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 16px', fontFamily: 'sans-serif' },
    wrapperBarra: { maxWidth: '900px', margin: '0 auto', marginTop: '-40px' },
    barraBusca: { display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6', height: '72px', overflow: 'hidden', position: 'relative', zIndex: 20 },
    btnSeta: { height: '100%', padding: '0 24px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    inputBusca: { flexGrow: 1, height: '100%', border: 'none', padding: '0 8px', fontSize: '18px', color: 'var(--sim-green-start)', outline: 'none' },
    btnEnviar: { height: '100%', padding: '0 24px', background: 'var(--sim-green-gradient)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTopRightRadius: '8px', borderBottomRightRadius: '8px'},
    painelFiltros: { backgroundColor: 'var(--sim-bg)', borderRadius: '0 0 8px 8px', padding: '32px 24px 24px 24px', marginTop: '-20px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    linhaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'flex-start' },
    colunaFiltro: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '16px', fontWeight: 'bold', color: 'var(--sim-green-start)' },
    grupoBotoes: { display: 'flex', gap: '8px' },
    btnFiltroAtivo: { flex: 1, padding: '10px 0', background: 'var(--sim-green-gradient)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', opacity: 1 },
    btnFiltroInativo: { flex: 1, padding: '10px 0', background: 'var(--sim-green-gradient)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', opacity: 0.25 },
    faixaPreco: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingTop: '16px', borderTop: '1px solid #d1d5db' },
    inputsPrecoContainer: { display: 'flex', gap: '16px', maxWidth: '400px', width: '100%' },
    inputPreco: { width: '50%', backgroundColor: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', color: 'var(--sim-green-start)', outline: 'none', textAlign: 'center', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' },
    
    // Alinhado com o grid de 32px do seu CSS original do Astro
    vitrineHeader: { marginTop: '64px', marginBottom: '32px' },
    gridResultados: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' },
    paginacaoContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px', paddingBottom: '40px' },
    btnPagina: { padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }
  };

  const buscarImoveis = async (pagina = 1) => {
    setCarregando(true);
    const de = (pagina - 1) * ITENS_POR_PAGINA;
    const ate = de + ITENS_POR_PAGINA - 1;

    // Buscando os campos e injetando a relação com imagens_imovel
    let query = supabase.from('imoveis').select(`
      id,
      titulo,
      descricao,
      tipo,
      preco,
      quartos,
      banheiros,
      garagens,
      status,
      localizacao,
      imagens_imovel (
        url_storage
      )
    `, { count: 'exact' });

    if (tipo) {
      const tipoBanco = tipo === 'Comprar' ? 'venda' : 'aluguel';
      query = query.eq('tipo', tipoBanco);
    }

    if (quartos) query = query.gte('quartos', quartos);
    if (banheiros) query = query.gte('banheiros', banheiros);
    if (garagem) query = query.gte('garagens', garagem);

    if (precoMin) query = query.gte('preco', parseFloat(precoMin));
    if (precoMax) query = query.lte('preco', parseFloat(precoMax));

    if (buscaTexto) {
      query = query.or(`titulo.ilike.%${buscaTexto}%,localizacao.ilike.%${buscaTexto}%,descricao.ilike.%${buscaTexto}%`);
    }

    query = query.order('id', { ascending: false }).range(de, ate);
    const { data, count, error } = await query;

    if (!error && data) {
      // Exatamente o mesmo tratamento de imagem que você construiu no Astro
      const imoveisTratados = data.map((imovel) => {
        const primeiraImagem = imovel.imagens_imovel?.[0]?.url_storage || "/fallback-imovel.jpg";
        return {
          ...imovel,
          imagem_url: primeiraImagem,
        };
      });

      setImoveis(imoveisTratados);
      setTotalPaginas(Math.max(1, Math.ceil(count / ITENS_POR_PAGINA)));
    } else if (error) {
      console.error("Erro ao buscar imóveis:", error.message);
    }
    setCarregando(false);
  };

  useEffect(() => {
    buscarImoveis(paginaAtual);
  }, [tipo, quartos, banheiros, garagem, precoMin, precoMax, paginaAtual]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    buscarImoveis(1);
  };

  return (
    <div style={estilos.container}>
      
      <div style={estilos.wrapperBarra}>
        {/* BARRA DE BUSCA PRINCIPAL */}
        <form onSubmit={handleBuscar} style={estilos.barraBusca}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            style={estilos.btnSeta}
          >
            <svg style={{ width: '28px', height: '28px', color: 'var(--sim-green-start)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <input
            type="text"
            value={buscaTexto}
            onChange={(e) => setBuscaTexto(e.target.value)}
            placeholder="Busque por casas, apartamentos, bairros..."
            style={estilos.inputBusca}
          />

          <button type="submit" style={estilos.btnEnviar}>
            <svg style={{ width: '28px', height: '28px', color: '#ffffff' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

        {/* PAINEL EXPANSÍVEL */}
        {isOpen && (
          <div style={estilos.painelFiltros}>
            <div style={estilos.linhaGrid}>
              
              {/* Tipo */}
              <div style={estilos.colunaFiltro}>
  <span style={estilos.label}>Tipo:</span>
  <div style={estilos.grupoBotoes}>
    {/* Incluímos o 'Todos' no array para gerar o botão */}
    {['Todos', 'Comprar', 'Alugar'].map((t) => {
      // Lógica para definir se o botão está ativo ou não
      const isAtivo = (t === 'Todos' && tipo === null) || tipo === t;

      return (
        <button
          key={t}
          type="button"
          onClick={() => { 
            // Se clicar em 'Todos', reseta o estado para null, senão define o tipo
            setTipo(t === 'Todos' ? null : t); 
            setPaginaAtual(1); 
          }}
          style={isAtivo ? estilos.btnFiltroAtivo : estilos.btnFiltroInativo}
        >
          {t}
        </button>
      );
    })}
  </div>
</div>

              {/* Quartos */}
              <div style={estilos.colunaFiltro}>
                <span style={estilos.label}>Quartos:</span>
                <div style={estilos.grupoBotoes}>
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => { setQuartos(quartos === num ? null : num); setPaginaAtual(1); }}
                      style={quartos === num ? estilos.btnFiltroAtivo : estilos.btnFiltroInativo}
                    >
                      +{num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Banheiros */}
              <div style={estilos.colunaFiltro}>
                <span style={estilos.label}>Banheiros:</span>
                <div style={estilos.grupoBotoes}>
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => { setBanheiros(banheiros === num ? null : num); setPaginaAtual(1); }}
                      style={banheiros === num ? estilos.btnFiltroAtivo : estilos.btnFiltroInativo}
                    >
                      +{num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Garagem */}
              <div style={estilos.colunaFiltro}>
                <span style={estilos.label}>Garagem:</span>
                <div style={estilos.grupoBotoes}>
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => { setGaragem(garagem === num ? null : num); setPaginaAtual(1); }}
                      style={garagem === num ? estilos.btnFiltroAtivo : estilos.btnFiltroInativo}
                    >
                      +{num}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Faixa de Preço */}
            <div style={estilos.faixaPreco}>
              <span style={estilos.label}>Faixa de preço:</span>
              <div style={estilos.inputsPrecoContainer}>
                <input
                  type="number"
                  placeholder="Valor mínimo"
                  value={precoMin}
                  onChange={(e) => { setPrecoMin(e.target.value); setPaginaAtual(1); }}
                  style={estilos.inputPreco}
                />
                <input
                  type="number"
                  placeholder="Valor máximo"
                  value={precoMax}
                  onChange={(e) => { setPrecoMax(e.target.value); setPaginaAtual(1); }}
                  style={estilos.inputPreco}
                />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* VITRINE DINÂMICA UNIFICADA */}
      <div style={estilos.vitrineHeader}>
        <h2>Imóveis em Destaque</h2>
        <p>Confira as ofertas exclusivas selecionadas para você</p>
      </div>

      {carregando ? (
        <p style={{textAlign: 'center', padding: '40px 0', color: 'var(--sim-green-start)', fontWeight: 'bold'}}>Buscando imóveis...</p>
      ) : imoveis.length === 0 ? (
        <p style={{textAlign: 'center', padding: '40px 0', color: '#6b7280'}}>Nenhum imóvel encontrado para os filtros selecionados.</p>
      ) : (
        <>
          <div style={estilos.gridResultados}>
            {imoveis.map((imovel) => (
              <CardImovel key={imovel.id} imovel={imovel} />
            ))}
          </div>

          {/* BARRA DE PAGINAÇÃO */}
          {totalPaginas > 1 && (
            <div style={estilos.paginacaoContainer}>
              <button 
                disabled={paginaAtual === 1} 
                onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                style={estilos.btnPagina}
              >
                Anterior
              </button>
              <span style={{fontWeight: 'bold', color: 'var(--sim-text-dark)'}}>Página {paginaAtual} de {totalPaginas}</span>
              <button 
                disabled={paginaAtual === totalPaginas} 
                onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                style={estilos.btnPagina}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
}