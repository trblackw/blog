/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import styled from 'styled-components'
import { rhythm } from "../utils/typography"

const Bio: React.FC = (): JSX.Element => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.png/" }) {
        childImageSharp {
            fluid(maxWidth: 70, quality: 90) {
                ...GatsbyImageSharpFluid
            }
          fixed(width: 100, height: 80) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author
          social {
            twitter
          }
        }
      }
    }
  `)

  return (
    <Container>
      <p style={{ color: '#eee' }}>
        I like to learn, build & write about things I find interesting. It often times coincides with React ⚛️
      </p>
    </Container>
  )
}

export default Bio

const Container = styled.div`
  display: flex;
`
