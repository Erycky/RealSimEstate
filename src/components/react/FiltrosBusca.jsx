// src/components/react/FiltrosBusca.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function FiltrosBusca() {
  const [buscaTexto, setBuscaTexto] = useState('');
  const [tipo, setTipo] = useState('Comprar'); 
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

  // Estilos CSS Fixos para garantir o seu design sem depender do Tailwind
  const estilos = {
    container: { width: '100%', maxWidth: '900px', margin: '0 auto', marginTop: '-40px', padding: '0 16px', fontFamily: 'sans-serif' },
    barraBusca: { display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6', height: '72px', overflow: 'hidden', position: 'relative', zIndex: 20 },
    btnSeta: { height: '100%', px: '24px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' },
    inputBusca: { flexGrow: 1, height: '100%', border: 'none', padding: '0 8px', fontSize: '18px', color: '#0B521E', outline: 'none' },
    btnEnviar: { height: '100%', padding: '0 32px', backgroundColor: '#0B521E', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTopRightRadius: '32px', borderBottomRightRadius: '32px' },
    
    painelFiltros: { backgroundColor: '#EBEBEB', borderRadius: '0 0 24px 24px', padding: '32px 24px 24px 24px', marginTop: '-20px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    linhaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'flex-start' },
    colunaFiltro: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '16px', fontWeight: 'bold', color: '#0B521E' },
    grupoBotoes: { display: 'flex', gap: '8px' },
    
    // O segredo do seu design: verde escuro total ou 25% de opacidade
    btnFiltroAtivo: { flex: 1, padding: '10px 0', backgroundColor: '#0B521E', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' },
    btnFiltroInativo: { flex: 1, padding: '10px 0', backgroundColor: '#0B521E', color: '#ffffff', opacity: 0.25, border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' },
    
    faixaPreco: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingTop: '16px', borderTop: '1px solid #d1d5db' },
    inputsPrecoContainer: { display: 'flex', gap: '16px', maxWidth: '400px', width: '100%' },
    inputPreco: { width: '50%', backgroundColor: '#ffffff', border: 'none', borderRadius: '12px', padding: '10px 16px', fontSize: '14px', color: '#0B521E', outline: 'none', textAlign: 'center', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }
  };

  const buscarImoveis = async (pagina = 1) => {
    setCarregando(true);
    const de = (pagina - 1) * ITENS_POR_PAGINA;
    const ate = de + ITENS_POR_PAGINA - 1;

    let query = supabase.from('imoveis').select('*', { count: 'exact' });

    if (tipo) query = query.eq('tipo', tipo.toLowerCase());
    if (quartos) query = query.gte('quartos', quartos);
    if (banheiros) query = query.gte('banheiros', banheiros);
    if (garagem) query = query.gte('garagens', garagem);
    if (precoMin) query = query.gte('preco', parseFloat(precoMin));
    if (precoMax) query = query.lte('preco', parseFloat(precoMax));
    if (buscaTexto) query = query.ilike('titulo', `%${buscaTexto}%`);

    query = query.order('id', { ascending: true }).range(de, ate);
    const { data, count, error } = await query;

    if (!error && data) {
      setImoveis(data);
      setTotalPaginas(Math.ceil(count / ITENS_POR_PAGINA));
    }
    setCarregando(false);
  };

  useEffect(() => {
    buscarImoveis(paginaAtual);
  }, [tipo, paginaAtual]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    buscarImoveis(1);
  };

  return (
    <div style={estilos.container}>
      
      {/* BARRA DE BUSCA PRINCIPAL */}
      <form onSubmit={handleBuscar} style={estilos.barraBusca}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={estilos.btnSeta}
        >
          <svg style={{ width: '28px', height: '28px', color: '#0B521E', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <input
          type="text"
          value={buscaTexto}
          onChange={(e) => setBuscaTexto(e.target.value)}
          placeholder="Busque por casas, apartamentos, studios..."
          style={estilos.inputBusca}
        />

        <button type="submit" style={estilos.btnEnviar}>
          <svg style={{ width: '28px', height: '28px', color: '#ffffff' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>

      {/* PAINEL EXPANSÍVEL CINZA (Baseado no seu island filtros.png) */}
      {isOpen && (
        <div style={estilos.painelFiltros}>
          <div style={estilos.linhaGrid}>
            
            {/* Tipo */}
            <div style={estilos.colunaFiltro}>
              <span style={estilos.label}>Tipo:</span>
              <div style={estilos.grupoBotoes}>
                {['Comprar', 'Alugar'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setTipo(t); setPaginaAtual(1); }}
                    style={tipo === t ? estilos.btnFiltroAtivo : estilos.btnFiltroInativo}
                  >
                    {t}
                  </button>
                ))}
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
                    onClick={() => setQuartos(quartos === num ? null : num)}
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
                    onClick={() => setBanheiros(banheiros === num ? null : num)}
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
                    onClick={() => setGaragem(garagem === num ? null : num)}
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
                placeholder="Valor minimo"
                value={precoMin}
                onChange={(e) => setPrecoMin(e.target.value)}
                style={estilos.inputPreco}
              />
              <input
                type="number"
                placeholder="Valor maximo"
                value={precoMax}
                onChange={(e) => setPrecoMax(e.target.value)}
                style={estilos.inputPreco}
              />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}