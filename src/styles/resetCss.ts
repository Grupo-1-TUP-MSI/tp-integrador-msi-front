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

  .disabled-row {
    opacity: 0.3;
    pointer-events: none;
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

  .success-animation {
    margin: 50px auto;
  }

  .checkmark {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: var(--primary-color);
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px var(--primary-color);
    animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
    position: relative;
    top: 5px;
    right: 5px;
    margin: 0 auto;
  }
  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: var(--primary-color);
    fill: #fff;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }

  .ant-list-item-meta-description {
    color: var(--text-main-color) !important;
  }

  .ant-card-bordered {
    border: 1px solid var(--shadow-color);
  }

  .ant-card-head {
    border-bottom: 1px solid var(--shadow-color);
  }
  .ant-table table {
    font-size: 14px !important;
  }
  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes scale {
    0%,
    100% {
      transform: none;
    }

    50% {
      transform: scale3d(1.1, 1.1, 1);
    }
  }

  @keyframes fill {
    100% {
      box-shadow: inset 0px 0px 0px 30px var(--primary-color);
    }
  }
`;
