import React from 'react';
import styled from 'styled-components'

const AboutMe: React.FC = (): JSX.Element => {
    return (
        <Container>
            <Header>Hey there</Header>
        </Container>
    );
}

export default AboutMe;

const Container = styled.div`
    max-width: 800px;
    width: 100%;
    background: #eee;
    margin: 3em auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 20px;
`

const Header = styled.div`
    font-size: 2em;
    font-weight: bold;
`