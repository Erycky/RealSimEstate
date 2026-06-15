// src/components/react/CardImovel.jsx
import { useState } from 'react';

export default function CardImovel({ imovel }) {
  const fotos = imovel.imagens_imovel && imovel.imagens_imovel.length > 0
    ? imovel.imagens_imovel.map(img => img.url_storage)
    : ['/fallback-imovel.jpg'];

  const [fotoAtivaIndex, setFotoAtivaIndex] = useState(0);
  
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const MIN_SWIPE_DISTANCE = 50;

  const fotoAnterior = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFotoAtivaIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  };

  const proximaFoto = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFotoAtivaIndex((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

    if (isLeftSwipe || isRightSwipe) {
      e.preventDefault();
      e.stopPropagation();

      if (isLeftSwipe) {
        proximaFoto();
      } else if (isRightSwipe) {
        fotoAnterior();
      }
    }
  };

  const estilos = {
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column'
    },
    containerFoto: {
      position: 'relative',
      width: '100%',
      height: '320px',
      overflow: 'hidden',
      backgroundColor: '#f3f4f6',
      touchAction: 'pan-y'
    },
    trilhoImagens: {
      display: 'flex',
      width: `${fotos.length * 100}%`,
      height: '100%',
      transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
      transform: `translateX(-${(fotoAtivaIndex * 100) / fotos.length}%)`
    },
    wrapperImagem: {
      width: `${100 / fotos.length}%`,
      height: '100%'
    },
    imagem: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      userSelect: 'none'
    },
    setaLateral: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(0, 0, 0, 0.45)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5,
      userSelect: 'none',
      transition: 'background-color 0.2s ease'
    },
    containerBolinhas: {
      position: 'absolute',
      bottom: '12px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '6px',
      zIndex: 5,
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      padding: '5px 10px',
      borderRadius: '12px',
      alignItems: 'center',
      maxWidth: '85%',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    bolinha: (isAtiva) => ({
      width: isAtiva ? '8px' : '6px',
      height: isAtiva ? '8px' : '6px',
      borderRadius: '50%',
      backgroundColor: isAtiva ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
      transition: 'all 0.25s ease',
      cursor: 'pointer'
    }),
    badgeTag: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      backgroundColor: '#ffffff',
      color: 'var(--sim-green-start, #006437)',
      padding: '4px 12px',
      borderRadius: '4px',
      fontWeight: 'bold',
      fontSize: '12px',
      zIndex: 4,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    conteudoInfo: {
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    },
    blocoTextos: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      flex: 1
    },
    titulo: {
      fontSize: '20px',
      fontWeight: 'bold',
      margin: 0,
      color: 'var(--sim-text-dark, #1f2937)'
    },
    preco: {
      color: 'var(--sim-green-start, #006437)',
      fontWeight: 'bold',
      fontSize: '18px',
      margin: '4px 0 8px 0'
    },
    iconesSpecs: {
      display: 'flex',
      gap: '16px',
      color: '#6b7280',
      fontSize: '13px'
    },
    btnAcao: {
      background: 'var(--sim-green-gradient, #006437)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      width: '44px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, opacity 0.2s ease',
      marginLeft: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  };

  return (
    <div className="card-imovel" style={estilos.card}>
      <div 
        style={estilos.containerFoto}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <span style={estilos.badgeTag}>
          {imovel.tipo === 'venda' ? 'Venda' : 'Aluguel'}
        </span>

        {fotos.length > 1 && (
          <>
            <button type="button" onClick={fotoAnterior} style={{ ...estilos.setaLateral, left: '8px' }} title="Foto anterior">
              <svg style={{ width: '20px', height: '20px', color: '#ffffff', transform: 'rotate(90deg)' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button type="button" onClick={proximaFoto} style={{ ...estilos.setaLateral, right: '8px' }} title="Próxima foto">
              <svg style={{ width: '20px', height: '20px', color: '#ffffff', transform: 'rotate(-90deg)' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </>
        )}

        <div style={estilos.trilhoImagens}>
          {fotos.map((url, index) => (
            <div key={index} style={estilos.wrapperImagem}>
              <img 
                src={url} 
                alt={`${imovel.titulo} - Foto ${index + 1}`}
                style={estilos.imagem}
                loading={index === 0 ? "eager" : "lazy"} 
                draggable="false"
              />
            </div>
          ))}
        </div>

        {fotos.length > 1 && (
          <div style={estilos.containerBolinhas}>
            {fotos.map((_, index) => (
              <div
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFotoAtivaIndex(index);
                }}
                style={estilos.bolinha(index === fotoAtivaIndex)}
              />
            ))}
          </div>
        )}
      </div>
      <div style={estilos.conteudoInfo}>
        <div style={estilos.blocoTextos}>
          <h3 style={estilos.titulo}>
            {imovel.titulo}
          </h3>
          <p style={estilos.preco}>
            {imovel.tipo === 'aluguel' ? `R$ ${imovel.preco}/mês` : `R$ ${imovel.preco}`}
          </p>
          <div style={estilos.iconesSpecs}>
            <span>{imovel.quartos} Q</span>
            <span>{imovel.banheiros} B</span>
            <span>{imovel.garagens || 0} V</span>
          </div>
        </div>
        <button 
          type="button" 
          style={estilos.btnAcao}
          onClick={(e) => {
            window.location.href = `/imovel/${imovel.id}`;
          }}
          title="Ver detalhes do imóvel"
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg style={{ width: '22px', height: '22px', color: '#ffffff', transform: 'rotate(-90deg)' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

      </div>

    </div>
  );
}