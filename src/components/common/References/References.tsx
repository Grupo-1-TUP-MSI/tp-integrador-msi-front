import React from 'react';
import * as S from './References.styles';
import { GithubOutlined } from '@ant-design/icons';

const GithubIcon = S.withStyles(GithubOutlined);

export const References: React.FC = () => {
  return (
    <S.ReferencesWrapper>
      <S.Text>
        Based on{' '}
        <a href="https://ant.design/" target="_blank" rel="noreferrer">
          Ant-design.
        </a>
      </S.Text>
      <S.Icons>
        {/* TODO: agregar link al repositorio */}
        <a href="https://github.com/" target="_blank" rel="noreferrer">
          <GithubIcon />
        </a>
      </S.Icons>
    </S.ReferencesWrapper>
  );
};
