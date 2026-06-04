// src/components/react/FiltrosBusca.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function FiltrosBusca({ onImoveisCarregados }) {
  // 1. Estados dos Filtros
  const [buscaTexto, setBuscaTexto] = useState('');
  const [tipo, setTipo] = useState('Comprar'); // 'Comprar' ou 'Alugar'
  const [quartos, setQuartos] = useState(null);
  const [banheiros, setBanheiros] = useState(null);
  const [garagem, setGaragem] = useState(null);
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');

  // 2. Estados de Paginação e Controle da Interface
  const [isOpen, setIsOpen] = useState(false); // Controla a expansão dos filtros
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(false);

  const ITENS_POR_PAGINA = 8;

  // 3. Função que faz a Query escalável no Supabase
  const buscarImoveis = async (pagina = 1) => {
    setCarregando(true);
    
    // Define o range do Postgres (Abordagem 2)
    const de = (pagina - 1) * ITENS_POR_PAGINA;
    const ate = de + ITENS_POR_PAGINA - 1;

    // Inicia a query na tabela
    let query = supabase
      .from('imoveis')
      .select('*', { count: 'exact' }); // Pede o count exato para sabermos o total de páginas

    // Aplica os filtros dinamicamente se o usuário selecionou algo
    if (tipo) query = query.eq('tipo', tipo.toLowerCase());
    if (quartos) query = query.gte('quartos', quartos);
    if (banheiros) query = query.gte('banheiros', banheiros);
    if (garagem) query = query.gte('garagens', garagem);
    if (precoMin) query = query.gte('preco', parseFloat(precoMin));
    if (precoMax) query = query.lte('preco', parseFloat(precoMax));
    
    if (buscaTexto) {
      // Busca parcial no título (case-insensitive)
      query = query.ilike('titulo', `%${buscaTexto}%`);
    }

    // Aplica a paginação direto no banco de dados
    query = query.range(de, ate);

    const { data, count, error } = await query;

    if (!error && data) {
      onImoveisCarregados(data); // Envia os 8 imóveis de volta para a página principal
      setTotalPaginas(Math.ceil(count / ITENS_POR_PAGINA));
    } else {
      console.error('Erro ao buscar imóveis:', error);
    }
    setCarregando(false);
  };

  // Dispara a busca sempre que o tipo de negócio ou a página mudar
  useEffect(() => {
    buscarImoveis(paginaAtual);
  }, [tipo, paginaAtual]);

  // Função para quando o usuário clica na seta verde de buscar ou dá Enter
  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1); // Reseta para a primeira página ao buscar
    buscarImoveis(1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 my-8">
      {/* BARRA PRINCIPAL */}
      <form onSubmit={handleBuscar} className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-16 relative z-20">
        
        {/* Seta para expandir filtros (Esquerda) */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-full px-5 text-gray-500 hover:text-[#005c23] transition-colors flex items-center justify-center border-r border-gray-100"
        >
          <svg 
            className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Input de Texto */}
        <input
          type="text"
          value={buscaTexto}
          onChange={(e) => setBuscaTexto(e.target.value)}
          placeholder="Busque por casas, apartamentos, studios..."
          className="flex-grow h-full px-5 text-gray-700 placeholder-gray-400 focus:outline-none text-base md:text-lg"
        />

        {/* Botão de Enviar (Seta Direita Verde) */}
        <button
          type="submit"
          className="h-full px-6 bg-[#005c23] hover:bg-[#00461a] text-white transition-colors flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>

      {/* PAINEL DE FILTROS EXPANSÍVEL (Abaixo da barra) */}
      <div className={`bg-gray-100/90 backdrop-blur-sm rounded-b-2xl shadow-inner border-x border-b border-gray-200 p-6 space-y-6 transition-all duration-300 origin-top ${isOpen ? 'max-h-[500px] opacity-100 mt-[-8px] pt-8' : 'max-h-0 opacity-0 pointer-events-none hidden'}`}>
        
        {/* Grid de Seleções Rápidas (Chips) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          
          {/* Tipo */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#005c23]">Tipo:</span>
            <div className="flex gap-2">
              {['Comprar', 'Alugar'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTipo(t); setPaginaAtual(1); }}
                  className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors ${tipo === t ? 'bg-[#005c23] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Quartos */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#005c23]">Quartos:</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuartos(quartos === num ? null : num)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${quartos === num ? 'bg-[#005c23] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                >
                  +{num}
                </button>
              ))}
            </div>
          </div>

          {/* Banheiros */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#005c23]">Banheiros:</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setBanheiros(banheiros === num ? null : num)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${banheiros === num ? 'bg-[#005c23] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                >
                  +{num}
                </button>
              ))}
            </div>
          </div>

          {/* Garagem */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#005c23]">Garagem:</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setGaragem(garagem === num ? null : num)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${garagem === num ? 'bg-[#005c23] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                >
                  +{num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Seção de Faixa de Preço */}
        <div className="flex flex-col items-center gap-2 pt-2 border-t border-gray-200/60">
          <span className="text-sm font-semibold text-[#005c23]">Faixa de preço:</span>
          <div className="flex gap-4 max-w-md w-full">
            <input
              type="number"
              placeholder="Valor mínimo"
              value={precoMin}
              onChange={(e) => setPrecoMin(e.target.value)}
              className="w-1/2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#005c23]"
            />
            <input
              type="number"
              placeholder="Valor máximo"
              value={precoMax}
              onChange={(e) => setPrecoMax(e.target.value)}
              className="w-1/2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#005c23]"
            />
          </div>
        </div>
      </div>

      {/* COMPONENTE DE PAGINAÇÃO (Rederiza abaixo dos filtros se houver mais de 1 página) */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => setPaginaAtual(pg)}
              disabled={carregando}
              className={`w-9 h-9 rounded-lg font-medium text-sm transition-colors ${paginaAtual === pg ? 'bg-[#005c23] text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              {pg}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}