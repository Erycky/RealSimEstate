// src/components/react/CardImovel.jsx

export default function CardImovel({ imovel }) {
  
  const formatarPreco = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(valor);
  };

  // Objeto de estilos usando os tokens do :root
  const estilos = {
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
      border: '1px solid #f3f4f6',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    },
    containerImagem: {
      position: 'relative',
      width: '100%',
      aspectRatio: '4 / 3',
      backgroundColor: '#f3f4f6',
      overflow: 'hidden'
    },
    imagem: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease'
    },
    badgeTipo: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      backgroundColor: '#ffffff',
      color: 'var(--sim-green-start)',
      fontWeight: '700',
      fontSize: '14px',
      padding: '6px 16px',
      borderRadius: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      textTransform: 'capitalize',
      fontFamily: 'sans-serif'
    },
    corpoCard: {
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      fontFamily: 'sans-serif'
    },
    infoEsquerda: {
      flexGrow: 1,
      minWidth: 0
    },
    titulo: {
      fontWeight: '700',
      fontSize: '20px',
      color: 'var(--sim-text-dark)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: '1.2'
    },
    preco: {
      fontSize: '24px',
      fontWeight: '700',
      color: 'var(--sim-green-start)',
      marginTop: '4px',
      letterSpacing: '-0.5px'
    },
    sufixoMensal: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#6b7280'
    },
    dadosTecnicos: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginTop: '12px',
      color: 'var(--sim-text-muted)',
      fontWeight: '600',
      fontSize: '16px'
    },
    itemIcone: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    svgIcone: {
      width: '20px',
      height: '20px',
      color: 'var(--sim-green-start)'
    },
    btnDetalhes: {
      width: '56px',
      height: '56px',
      background: 'var(--sim-green-gradient)',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '16px',
      transition: 'opacity 0.2s ease',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      flexShrink: 0,
      textDecoration: 'none'
    }
  };

  return (
    <div 
      style={estilos.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.05)';
        if(e.currentTarget.querySelector('.img-card')) {
          e.currentTarget.querySelector('.img-card').style.transform = 'scale(1.04)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)';
        if(e.currentTarget.querySelector('.img-card')) {
          e.currentTarget.querySelector('.img-card').style.transform = 'scale(1)';
        }
      }}
    >
      
      {/* Imagem e Tag */}
      <div style={estilos.containerImagem}>
        <img 
          src={imovel.imagem_url || '/placeholder-imovel.jpg'} 
          alt={imovel.titulo}
          style={estilos.imagem}
          className="img-card"
          loading="lazy"
        />
        <span style={estilos.badgeTipo}>
          {imovel.tipo}
        </span>
      </div>

      {/* Textos, Preço e Ícones */}
      <div style={estilos.corpoCard}>
        <div style={estilos.infoEsquerda}>
          <h3 style={estilos.titulo} title={imovel.titulo}>
            {imovel.titulo}
          </h3>
          
          <p style={estilos.preco}>
            {formatarPreco(imovel.preco)}
            {imovel.tipo === 'alugar' && <span style={estilos.sufixoMensal}> /mês</span>}
          </p>

          {/* Dados Técnicos (Quartos, Banheiros, Garagem) */}
          <div style={estilos.dadosTecnicos}>
            <div style={estilos.itemIcone}>
              <span>{imovel.quartos}</span>
              <svg style={estilos.svgIcone} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>

            <div style={estilos.itemIcone}>
              <span>{imovel.banheiros}</span>
              <svg style={estilos.svgIcone} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h16" />
              </svg>
            </div>

            <div style={estilos.itemIcone}>
              <span>{imovel.garagens || 0}</span>
              <svg style={estilos.svgIcone} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 16v3a2 2 0 01-2 2H7a2 2 0 01-2-2v-3m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v7m14 0a3 3 0 01-3 3H8a3 3 0 01-3-3M6 10h.01M18 10h.01" />
              </svg>
            </div>
          </div>
        </div>

        {/* Seta para ver detalhes com o Gradiente correto */}
        <a 
          href={`/imovel/${imovel.id}`}
          style={estilos.btnDetalhes}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <svg style={{ width: '28px', height: '28px' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>

      </div>
    </div>
  );
}