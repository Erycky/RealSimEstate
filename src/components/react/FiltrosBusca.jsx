// src/components/react/FiltrosBusca.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import CardImovel from './CardImovel'; 

export default function FiltrosBusca() {
  // 1. Mudamos aqui: o painel agora começa FECHADO (false) por padrão 🚀
  const [isOpen, setIsOpen] = useState(false); 
  
  const [buscaTexto, setBuscaTexto] = useState('');
  const [tipo, setTipo] = useState(null); 
  const [quartos, setQuartos] = useState(null);
  const [banheiros, setBanheiros] = useState(null);
  const [garagem, setGaragem] = useState(null);
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');

  const [imoveis, setImoveis] = useState([]); 
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(false);

  const ITENS_POR_PAGINA = 8;

  // 📱 ESTADO PARA DETECTAR SE É CELULAR (MOBILE)
  const [isCelular, setIsCelular] = useState(false);

  useEffect(() => {
    const checarLargura = () => {
      setIsCelular(window.innerWidth < 768);
    };
    
    checarLargura();

    window.addEventListener('resize', checarLargura);
    return () => window.removeEventListener('resize', checarLargura);
  }, []);

  // 🎨 ESTILOS ADAPTATIVOS BASEADOS NO `isCelular`
  const estilos = {
    container: { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 16px', fontFamily: 'sans-serif' },
    wrapperBarra: { maxWidth: '900px', margin: '0 auto', marginTop: isCelular ? '-24px' : '-40px' },
    
    barraBusca: { 
      display: 'flex', 
      flexDirection: isCelular ? 'column' : 'row', 
      alignItems: 'center', 
      backgroundColor: '#ffffff', 
      borderRadius: '8px', 
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', 
      border: '1px solid #f3f4f6', 
      height: isCelular ? 'auto' : '72px', 
      padding: isCelular ? '12px' : '0',
      gap: isCelular ? '12px' : '0',
      overflow: 'hidden', 
      position: 'relative', 
      zIndex: 20 
    },
    btnSeta: { 
      height: isCelular ? '44px' : '100%', 
      width: isCelular ? '100%' : 'auto',
      padding: '0 24px', 
      background: isCelular ? '#f9fafb' : 'none', 
      borderRadius: isCelular ? '6px' : '0',
      border: 'none', 
      cursor: 'pointer', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '8px' // Espaço maroto entre a seta e o texto "Filtros"
    },
    inputBusca: { 
      width: '100%',
      flexGrow: 1, 
      height: isCelular ? '48px' : '100%', 
      border: isCelular ? '1px solid #e5e7eb' : 'none', 
      borderRadius: isCelular ? '6px' : '0',
      padding: isCelular ? '0 12px' : '0 8px', 
      fontSize: '17px', 
      color: 'var(--sim-green-start)', 
      outline: 'none' 
    },
    btnEnviar: { 
      height: isCelular ? '48px' : '100%', 
      width: isCelular ? '100%' : 'auto',
      padding: '0 24px', 
      background: 'var(--sim-green-gradient)', 
      border: 'none', 
      cursor: 'pointer', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      borderRadius: isCelular ? '6px' : '0 8px 8px 0'
    },
    
    painelFiltros: { 
      backgroundColor: 'var(--sim-bg)', 
      borderRadius: '0 0 8px 8px', 
      padding: isCelular ? '24px 16px 20px 16px' : '32px 24px 24px 24px', 
      marginTop: '-20px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
    },
    linhaGrid: { 
      display: 'grid', 
      gridTemplateColumns: isCelular ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(180px, 1fr))', 
      gap: '16px', 
      alignItems: 'flex-start' 
    },
    colunaFiltro: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: isCelular ? '14px' : '16px', fontWeight: 'bold', color: 'var(--sim-green-start)' },
    
    grupoBotoes: { display: 'flex', gap: isCelular ? '4px' : '8px', flexWrap: 'wrap' },
    btnFiltroAtivo: { flex: '1 1 auto', minWidth: isCelular ? '45px' : '60px', padding: '10px 4px', background: 'var(--sim-green-gradient)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: isCelular ? '12px' : '14px', cursor: 'pointer', transition: 'all 0.2s', opacity: 1 },
    btnFiltroInativo: { flex: '1 1 auto', minWidth: isCelular ? '45px' : '60px', padding: '10px 4px', background: 'var(--sim-green-gradient)', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: isCelular ? '12px' : '14px', cursor: 'pointer', transition: 'all 0.2s', opacity: 0.25 },
    
    faixaPreco: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingTop: '16px', borderTop: '1px solid #d1d5db' },
    inputsPrecoContainer: { display: 'flex', gap: isCelular ? '12px' : '16px', maxWidth: '400px', width: '100%' },
    inputPreco: { width: '50%', backgroundColor: '#ffffff', border: isCelular ? '1px solid #e5e7eb' : 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', color: 'var(--sim-green-start)', outline: 'none', textAlign: 'center', boxShadow: isCelular ? 'none' : 'inset 0 2px 4px rgba(0,0,0,0.05)' },
    
    vitrineHeader: { marginTop: isCelular ? '40px' : '64px', marginBottom: '32px', textAlign: isCelular ? 'center' : 'left' },
    gridResultados: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: isCelular ? '20px' : '32px' },
    paginacaoContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px', paddingBottom: '40px' },
    btnPagina: { padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }
  };

  const buscarImoveis = async (pagina = 1) => {
    setCarregando(true);
    const de = (pagina - 1) * ITENS_POR_PAGINA;
    const ate = de + ITENS_POR_PAGINA - 1;

    let query = supabase.from('imoveis').select(`
      id, titulo, descricao, tipo, preco, quartos, banheiros, garagens, status, localizacao,
      imagens_imovel ( url_storage )
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
      const imoveisTratados = data.map((imovel) => ({
        ...imovel,
        imagem_url: imovel.imagens_imovel?.[0]?.url_storage || "/fallback-imovel.jpg",
      }));
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
          
          {/* Botão de Filtros: Setinha do Figma + Texto descritivo se for mobile 📱 */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            style={estilos.btnSeta}
          >
            <svg style={{ width: '24px', height: '24px', color: 'var(--sim-green-start)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            {isCelular && <span style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--sim-green-start)' }}>Filtros Avançados</span>}
          </button>

          {/* Input de Texto */}
          <input
            type="text"
            value={buscaTexto}
            onChange={(e) => {
              setBuscaTexto(e.target.value);
              if (!isOpen && e.target.value.length > 0) {
                setIsOpen(true);
              }
            }}
            placeholder="Busque por casas, bairros..."
            style={estilos.inputBusca}
          />

          {/* Botão de Envio adaptativo: Texto "Buscar" no Mobile ou Seta no Desktop 🚀 */}
          <button type="submit" style={estilos.btnEnviar}>
            {isCelular ? (
              <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.5px' }}>Buscar</span>
            ) : (
              <svg style={{ width: '28px', height: '28px', color: '#ffffff' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
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
                  {['Todos', 'Comprar', 'Alugar'].map((t) => {
                    const isAtivo = (t === 'Todos' && tipo === null) || tipo === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { 
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