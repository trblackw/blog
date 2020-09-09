/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"

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
    <div>
      <BioText>
        I like to learn, build & write about things I find interesting. They often times coincide with React ⚛️. I'm
        currently working as a software engineer with a lovely team at{" "}
        <a href="https://www.revops.io/">RevOps</a>.
      </BioText>
      <Hr />
    </div>
  )
}

export default Bio

const Container = styled.div`
  padding-bottom: 0;
  border: 1px solid red;
`

const Hr = styled.hr`
  border: 1px solid #BCF2DA;
  padding-top: 1px;
  border-radius: 5px;
`

const BioText = styled.p`
  color: #eee;
  font-weight: 200;
  font-size: 14px;
  font-family: MonoLisa, monospace;
`
