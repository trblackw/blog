import React, { useState, useEffect, useCallback, useRef } from "react"
import styled from "styled-components"
import { Link } from "@reach/router"
import { Menu } from "styled-icons/boxicons-regular/Menu"
import { Close } from "styled-icons/evil/Close"
import useViewport from "hooks/useViewport"

const NavDropdown: React.FC = (): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [{ width: windowWidth }] = useViewport()
  // DropdownContent visibility will be determined by css:hover on desktop and by toggling of open state on mobile/tablet

  const toggleDropdown = useCallback(() => {
    setOpen(!open)
  }, [open, setOpen])

  useEffect(() => {
    // This useEffect allows the dropdown to be closed
    // when the user clicks anywhere outside of the dropdown itself
    const eventHandler = () => {
      setOpen(false)
      document.removeEventListener("click", eventHandler, false)
    }

    if (open) {
      document.addEventListener("click", eventHandler, false)
    }
  }, [open])

  return (
    <Dropdown>
      <Button onClick={toggleDropdown} id="user-icon">
        {!open ? (
          <Menu size={30} fontWeight={300} color={"black"} />
        ) : windowWidth > 768 ? (
          <Close size={30} fontWeight={500} color={"black"} />
        ) : (
          <Menu size={30} fontWeight={300} color={"black"} />
        )}
      </Button>
      <Pointer />
      <DropdownContent visible={open} id="nav-dropdown-content">
        <ContentItem>
          <ContentButton>
            <ContentLink to="#">About me 🕵🏻‍</ContentLink>
          </ContentButton>
        </ContentItem>
        <ContentItem>
          <ContentButton>
            <ContentLink to="#">Custom Hooks 🧪</ContentLink>
          </ContentButton>
        </ContentItem>
        <ContentItem>
          <ContentButton>
            <ContentLink to="#">Contact 📬</ContentLink>
          </ContentButton>
        </ContentItem>
        <ContentItem>
          <ContentButton>
            <ContentLink to="#">Activity 👨🏻‍💻</ContentLink>
          </ContentButton>
        </ContentItem>
      </DropdownContent>
    </Dropdown>
  )
}

export default NavDropdown

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  right: 0;
  border-radius: 7px;
  background-color: #f0f0f0;
  min-width: 170px;
  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.09);
  z-index: 100;

  @media only screen and (max-width: 600px) {
    display: ${({ visible }: { visible: boolean }) =>
      visible ? "block" : "none"};
    width: 40%;
  }
`

const ContentItem = styled.div`
  height: 40px;
  padding: 6px 7px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  &:hover {
    background-color: #c7c7c7;
    cursor: pointer;
  }
`

const ContentButton = styled.button.attrs({ type: "button" })`
  border: none;
  background-color: transparent;
  font-size: 1em;
  cursor: pointer;
  width: 100%;

  &:hover {
    color: ${({ theme }) => theme.secondaryBlue};
  }
`

const ContentLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-shadow: none;
`

const Button = styled.button.attrs({ type: "button" })`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.primaryWhite};
  font-size: 1.2em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  &:hover {
    cursor: pointer;
  }
`
const Pointer = styled.div`
  width: 0;
  height: 0;
  display: none;
  position: absolute;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  left: 14px;
`

const Dropdown = styled.div`
  position: absolute;
  background: transparent;
  top: 20px;
  right: 0;
  /* width: auto; */
  text-align: center;
  display: none;
  margin-left: 15px;
  &:hover ${DropdownContent} {
    display: block;
  }

  &:hover ${Pointer} {
    display: block;
  }

  @media only screen and (max-width: 768px) {
    right: 10px;
    left: initial;
    display: block;
  }
`
