import React, { memo } from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components';

interface Props {
   type?: 'blank' | 'balls' | 'bars' | 'bubbles' | 'cubes' | 'cylon' | 'spin' | 'spinningBubbles' | 'spokes' | undefined;
   height?: string;
   width?: string;
   color?: string;
}

const Loading: React.FC<Props> = ({ type = 'bubbles', color = '#1197ba', height = '10%', width = '10%' }) => (
   <Container>
      <ReactLoading type={type} color={color} height={height} width={width} />
   </Container>
);

export default memo(Loading);

const Container = styled.div`
   margin: 0 auto;
   text-align: center;
   background-color: transparent;
   display: flex;
   justify-content: center;
   padding-top: 4em;
   align-items: flex-start;
`;
