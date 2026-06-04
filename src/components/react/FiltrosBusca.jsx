// src/components/react/FiltrosBusca.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import CardImovel from './CardImovel'; // Importando o card que criamos!

export default function FiltrosBusca() {
  // 1. Estados dos Filtros
  const [buscaTexto, setBuscaTexto] = useState('');
  const [tipo, setTipo] = useState('Comprar'); // 'Comprar' ou 'Alugar'
  const [quartos, setQuartos] = useState(null);
  const [banheiros, setBanheiros] = useState(null);
  const [garagem, setGaragem] = useState(null);
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');

  // 2. Estados de Paginação e Dados
  const [imoveis, setImoveis] = useState([]); // Armazena os 8 imóveis da página atual
  const [isOpen, setIsOpen] = useState(false); 
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [carregando, setCarregando] = useState(false);

  const ITENS_POR_PAGINA = 8;

  // 3. Função que faz a Query escalável no Supabase
  const buscarImoveis = async (pagina = 1) => {
    setCarregando(true);
    
    // Calcula os índices do range do Postgres (Abordagem 2)
    const de = (pagina - 1) * ITENS_POR_PAGINA;
    const ate = de + ITENS_POR_PAGINA - 1;

    let query = supabase
      .from('imoveis')
      .select('*', { count: 'exact' });

    // Filtros dinâmicos no banco
    if (tipo) query = query.eq('tipo', tipo.toLowerCase());
    if (quartos) query = query.gte('quartos', quartos);
    if (banheiros) query = query.gte('banheiros', banheiros);
    if (garagem) query = query.gte('garagens', garagem);
    if (precoMin) query = query.gte('preco', parseFloat(precoMin));
    if (precoMax) query = query.lte('preco', parseFloat(precoMax));
    
    if (buscaTexto) {
      query = query.ilike('titulo', `%${buscaTexto}%`);
    }

    // Ordena por ID ou data de criação para manter a paginação consistente
    query = query.order('id', { ascending: true }).range(de, ate);

    const { data, count, error } = await query;

    if (!error && data) {
      setImoveis(data); // Atualiza os imóveis da tela com os novos 8 resultados
      setTotalPaginas(Math.ceil(count / ITENS_POR_PAGINA));
    } else {
      console.error('Erro ao buscar imóveis:', error);
    }
    setCarregando(false);
  };

  // Dispara a busca automática ao trocar de página ou mudar Venda/Aluguel
  useEffect(() => {
    buscarImoveis(paginaAtual);
  }, [tipo, paginaAtual]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1); // Sempre reseta para a página 1 ao submeter uma nova busca
    buscarImoveis(1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      
      {/* CONTAINER DA BARRA DE BUSCA (Centralizado e controlado) */}
      <div className="max-w-4xl mx-auto mb-12">
        <form onSubmit={handleBuscar} className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-16 relative z-20">
          
          {/* Seta para expandir filtros */}
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

        {/* PAINEL DE FILTROS EXPANSÍVEL */}
        <div className={`bg-gray-100/90 backdrop-blur-sm rounded-b-2xl shadow-inner border-x border-b border-gray-200 p-6 space-y-6 transition-all duration-300 origin-top ${isOpen ? 'max-h-[500px] opacity-100 mt-[-8px] pt-8' : 'max-h-0 opacity-0 pointer-events-none hidden'}`}>
          
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

          {/* Faixa de Preço */}
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
      </div>

      {/* 4. A GRADE DE CARDS (4 colunas na linha) */}
      {carregando ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#005c23]"></div>
        </div>
      ) : imoveis.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl font-medium">Nenhum imóvel encontrado com esses filtros.</p>
          <p className="text-sm mt-1">Tente ajustar seus critérios de busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 row-gap-8 animate-fadeIn">
          {imoveis.map((imovel) => (
            <CardImovel key={imovel.id} imovel={imovel} />
          ))}
        </div>
      )}

      {/* 5. COMPONENTE DE PAGINAÇÃO */}
      {totalPaginas > 1 && !carregando && (
        <div className="flex justify-center items-center gap-2 mt-12 pb-8">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => setPaginaAtual(pg)}
              className={`w-10 h-10 rounded-xl font-bold text-sm border transition-all duration-200 ${paginaAtual === pg ? 'bg-[#005c23] text-white border-[#005c23] shadow-md scale-105' : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'}`}
            >
              {pg}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}