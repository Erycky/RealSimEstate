// src/components/react/CardImovel.jsx
export default function CardImovel({ imovel }) {
  
  const formatarPreco = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(valor);
  };

  return (
    <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-shadow duration-300">
      
      {/* Imagem e Tag */}
      <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
        <img 
          src={imovel.imagem_url || '/placeholder-imovel.jpg'} 
          alt={imovel.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-4 right-4 bg-white text-[#005c23] font-bold text-sm px-4 py-1.5 rounded-xl shadow-sm capitalize">
          {imovel.tipo}
        </span>
      </div>

      {/* Textos, Preço e Ícones */}
      <div className="p-5 flex items-center justify-between gap-2">
        <div className="flex-grow min-w-0">
          <h3 className="font-bold text-xl text-gray-800 truncate leading-snug">
            {imovel.titulo}
          </h3>
          
          <p className="text-2xl font-bold text-[#005c23] mt-0.5 tracking-tight">
            {formatarPreco(imovel.preco)}
            {imovel.tipo === 'alugar' && <span className="text-xs font-medium text-gray-500"> /mês</span>}
          </p>

          {/* Dados Técnicos (Quartos, Banheiros, Garagem) */}
          <div className="flex items-center gap-4 mt-3 text-gray-700 font-semibold text-lg">
            <div className="flex items-center gap-1.5">
              <span>{imovel.quartos}</span>
              <svg className="w-5 h-5 text-[#005c23]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>

            <div className="flex items-center gap-1.5">
              <span>{imovel.banheiros}</span>
              <svg className="w-5 h-5 text-[#005c23]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h16" />
              </svg>
            </div>

            <div className="flex items-center gap-1.5">
              <span>{imovel.garagens || 0}</span>
              <svg className="w-5 h-5 text-[#005c23]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 16v3a2 2 0 01-2 2H7a2 2 0 01-2-2v-3m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v7m14 0a3 3 0 01-3 3H8a3 3 0 01-3-3M6 10h.01M18 10h.01" />
              </svg>
            </div>
          </div>
        </div>

        {/* Seta para ver detalhes */}
        <a 
          href={`/imovel/${imovel.id}`}
          className="w-14 h-14 bg-[#005c23] hover:bg-[#00461a] text-white flex items-center justify-center rounded-2xl transition-colors shadow-md flex-shrink-0"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>

      </div>
    </div>
  );
}