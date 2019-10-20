import React, { ReactNode } from "react"
import { Link } from "gatsby"
import { rhythm, scale } from "utils/typography"
import styled from "styled-components"
import { ArrowBackIos } from "styled-icons/material/ArrowBackIos"
import NavDropdown from "./mobile_nav"

interface Props {
  readonly location: { pathname: string }
  readonly title: string
  readonly children: ReactNode
}
const Layout: React.FC<Props> = ({
  location,
  title,
  children,
}): JSX.Element => {
  //@ts-ignore
  const rootPath = `${__PATH_PREFIX__}/`
  let header: JSX.Element

  if (location.pathname === rootPath) {
    header = (
      <>
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1),
            marginTop: 0,
          }}
        >
          <HeaderLink to={`/`}>{title}</HeaderLink>
        </h1>
          <NavDropdown />

        <Nav>
          <li>
            <NavLink to="#">About me 🕵🏻‍</NavLink>
          </li>
          <li>
            <NavLink to="#">Custom Hooks 🧪</NavLink>
          </li>
          <li>
            <NavLink to="#">Contact 📬</NavLink>
          </li>
          <li>
            <NavLink to="/activity">Activity 👨🏻‍💻</NavLink>
          </li>
        </Nav>
      </>
    )
  } else {
    header = (
      <SubHeader>
        <HeaderLink to={`/`}>
          <ArrowBackIos
            size={30}
            title="Arrow back"
            fontWeight={300}
            color="blue"
          />
        </HeaderLink>
      </SubHeader>
    )
  }
  return (
    <Container>
      <header>{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer>
    </Container>
  )
}

export default Layout

const SubHeader = styled.h1`
  font-family: Merriweather Sans, sans-serif;
  margin-top: 0;
  color: #19cfff;
`

const HeaderLink = styled(Link)`
  box-shadow: none;
  text-decoration: none;
  color: inherit;
  box-shadow: none;
`
const Container = styled.div`
  margin: 0 auto;
  max-width: ${rhythm(24)};
  padding: ${rhythm(1.5)} ${rhythm(3 / 4)};
`
const Nav = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-left: auto;
  list-style: none;
  li {
    margin: 0 20px;
  }
  li:first-child {
    margin-left: unset;
  }

  @media only screen and (max-width: 768px) {
    display: none;
  }
`

const NavLink = styled(Link)`
  font-weight: bold;
  text-decoration: none;
  box-shadow: none;
`
