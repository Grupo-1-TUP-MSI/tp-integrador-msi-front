import { css } from 'styled-components';

export const resetCss = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  *:focus {
    border: 1px dashed var(--secondary-color) !important;
  }
  ::-webkit-scrollbar {
    width: 1rem;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: var(--scroll-color);
    border-radius: 1.25rem;
    border: 0.375rem solid transparent;
    background-clip: content-box;
  }

  body {
    font-weight: 500;
  }

  img {
    display: block;
  }

  .deleted-row {
    filter: sepia(100%) saturate(300%) brightness(200%) hue-rotate(200deg);
    opacity: 0.8;
  }

  .no-stock-row {
    background-color: #f8d11133;
    opacity: 0.8;
  }

  .tipoComprobante {
    font-size: 3rem;
    width: 80px;
    height: 80px;
    border: 1px solid var(--primary-color);
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 50%;
    background-color: white;
    color: #000;
  }

  .detalle {
    /* aplicar borde a toda la tabla */
    border: 1px solid #000;
  }

  .tabla-detalle {
    width: 100%;
    border-collapse: collapse;
  }

  b {
    margin: 0 0.5rem;
  }
`;
