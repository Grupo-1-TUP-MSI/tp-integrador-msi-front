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
    background-color: #f8d7da;
    opacity: 0.8;
  }

  .no-stock-row {
    background-color: #f8d11133;
    opacity: 0.8;
  }
`;
