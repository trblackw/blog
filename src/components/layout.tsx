import React, { ReactNode, useState } from "react"
import { Link } from "gatsby"
import { rhythm, scale } from "utils/typography"
import styled from "styled-components"
import CopyToClipboard from "react-copy-to-clipboard"
import { MediumSquare } from "styled-icons/boxicons-logos/MediumSquare"
import { LinkedinSquare } from "styled-icons/boxicons-logos/LinkedinSquare"
import { GithubSquare } from "styled-icons/fa-brands/GithubSquare"
import { Envelope } from "styled-icons/boxicons-regular/Envelope"
import useViewport from "hooks/useViewport"

interface Props {
  readonly location: { pathname: string }
  readonly title: string
  readonly children: ReactNode
}
const Layout: React.FC<Props> = ({ location, title, children }): JSX.Element => {
  const [emailCopied, setEmailCopied] = useState<boolean>(false)
  const [{ width: windowWidth }] = useViewport()

  return (
    <Container>
      <header>
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1),
            marginTop: 0,
          }}
        >
          <HeaderLink to={`/`}>
            Tucker Blackwell
            {windowWidth <= 500 && emailCopied && (
              <CopiedEmailAlert className="fade-in">Email address copied!</CopiedEmailAlert>
            )}
          </HeaderLink>
          <Nav>
            <li style={{ marginTop: windowWidth <= 415 ? "5px" : "3px" }}>
              <SocialLink href="https://github.com/trblackw" target="_blank">
                <GithubSquare size={49} title="Github" fontWeight={300} color="#eee" />
              </SocialLink>
            </li>
            <li>
              <SocialLink href="https://www.linkedin.com/in/tucker-blackwell-686b82146/" target="_blank">
                <LinkedinSquare size={55} title="LinkedIn" fontWeight={300} color="#eee" />
              </SocialLink>
            </li>
            <li>
              <SocialLink href="https://levelup.gitconnected.com/@tuckerblackwell.dev" target="_blank">
                <MediumSquare size={55} title="Medium" fontWeight={300} color="#eee" />
              </SocialLink>
            </li>
            <li>
              <CopyToClipboard
                text="tuckerblackwell.dev@gmail.com"
                onCopy={() => {
                  setEmailCopied(true)
                  setTimeout(() => {
                    setEmailCopied(false)
                  }, 1500)
                }}
              >
                <SocialLink>
                  <Envelope size={55} title="Gmail" fontWeight={300} color="#eee" />
                  {windowWidth > 500 && emailCopied && (
                    <CopiedEmailAlert className="fade-in">Email copied to clipboard!</CopiedEmailAlert>
                  )}
                </SocialLink>
              </CopyToClipboard>
            </li>
          </Nav>
        </h1>
      </header>
      <main>{children}</main>
      <Footer>
        <div style={{ textAlign: "center" }}>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org" rel="noopener noreferrer">
            Gatsby
          </a>
          <span style={{ display: "block", fontSize: "13px", color: "lightgray" }}>
            Check out the{" "}
            <a target="_blank" href="https://github.com/trblackw/blog" rel="noopener noreferrer">
              source code
            </a>{" "}
            👀
          </span>
        </div>
      </Footer>
    </Container>
  )
}

export default Layout

const HeaderLink = styled(Link)`
  box-shadow: none;
  text-decoration: none;
  color: inherit;
  font-weight: 300;
`
const Container = styled.div`
  margin: 0 auto;
  max-width: ${rhythm(24)};
  padding: ${rhythm(1.5)} ${rhythm(3 / 4)};
`
const Nav = styled.ul`
  list-style: none;
  display: flex;
  margin-left: auto;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  a {
    margin: 0 30px;
  }

  a:first-child {
    margin-left: unset;
  }
`

const SocialLink = styled.a`
  font-weight: bold;
  text-decoration: none;
  box-shadow: none;
  color: #c7f0db;
  position: relative;
  &:hover {
    color: #8bbabb;
    cursor: pointer;
  }
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`

const Footer = styled.div`
  color: #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  a {
    color: #c7f0db;
    &:hover {
      color: #8bbabb;
    }
  }
`

const CopiedEmailAlert = styled.span`
  font-size: 12px !important;
  color: lightgray;
  float: right;
`

const ResumeLink = styled(Link)`
  font-size: 12px;
  font-weight: 500;
  color: #c3f4de;
  border-bottom: none;
  text-decoration: none;
`
