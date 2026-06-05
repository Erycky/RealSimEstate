// src/components/react/CardImovel.jsx
import { useState } from 'react';

export default function CardImovel({ imovel }) {
  // 1. Buscamos todas as URLs das fotos do banco
  const fotos = imovel.imagens_imovel && imovel.imagens_imovel.length > 0
    ? imovel.imagens_imovel.map(img => img.url_storage)
    : ['/fallback-imovel.jpg'];

  const [fotoAtivaIndex, setFotoAtivaIndex] = useState(0);

  const fotoAnterior = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFotoAtivaIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  };

  const proximaFoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFotoAtivaIndex((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  };

  // Estilos inline consolidados
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
      backgroundColor: '#f3f4f6'
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
      objectFit: 'cover'
    },
    setaLateral: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'rgba(0, 0, 0, 0.35)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5,
      fontSize: '20px',
      userSelect: 'none'
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
    // ESTRUTURA DE LAYOUT PARA O BOTÃO VOLTAR
    conteudoInfo: {
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end' // Alinha o botão com a base dos ícones
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
    // O BOTÃO VERDE DA SETINHA IGUAL AO FIGMA
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
      transition: 'background-color 0.2s ease',
      fontSize: '22px',
      marginLeft: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
  };

  return (
    <div className="card-imovel" style={estilos.card}>
      
      {/* SEÇÃO SUPERIOR: CARROSSEL */}
      <div style={estilos.containerFoto}>
        <span style={estilos.badgeTag}>
          {imovel.tipo === 'venda' ? 'Venda' : 'Aluguel'}
        </span>

        {fotos.length > 1 && (
          <>
            <button type="button" onClick={fotoAnterior} style={{ ...estilos.setaLateral, left: '8px' }}>‹</button>
            <button type="button" onClick={proximaFoto} style={{ ...estilos.setaLateral, right: '8px' }}>›</button>
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

      {/* SEÇÃO INFERIOR: TEXTOS + BOTÃO VERDE (CORRIGIDO) */}
      <div style={estilos.conteudoInfo}>
        
        {/* Lado Esquerdo: Informações do Imóvel */}
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

        {/* Lado Direito: Botão com a setinha que tinha sumido */}
        <button 
          type="button" 
          style={estilos.btnAcao}
          onClick={(e) => {
            // Aqui depois você joga a navegação para a página de detalhes:
            // window.location.href = `/imovel/${imovel.id}`;
            console.log('Navegar para o imóvel:', imovel.id);
          }}
          title="Ver detalhes do imóvel"
        >
          →
        </button>

      </div>

    </div>
  );
}