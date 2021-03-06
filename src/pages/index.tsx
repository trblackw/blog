import React from "react"
import { Link, graphql } from "gatsby"
import Bio from "components/bio"
import Layout from "components/layout"
import SEO from "components/seo"
import { rhythm } from "utils/typography"
import styled from "styled-components"
import { formatReadingTime } from "utils"
import format from "date-fns/format"

const BlogIndex: React.FC = ({ data, location }: any): JSX.Element => (
  <Layout location={location} title={data.site.siteMetadata.title}>
    <SEO title="Tucker Blackwell" />
    <Bio />
    {data.allMarkdownRemark.edges.map(
      ({ node }: any): JSX.Element => (
        <article key={node.fields.slug}>
          <header>
            <BlogPreview>
              <BlogLink to={node.fields.slug}>{node.frontmatter.title || node.fields.slug}</BlogLink>
            </BlogPreview>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <BlogDate>{format(new Date(node.frontmatter.date), "MMMM do, yyyy")}</BlogDate>
              <small style={{ marginLeft: "5px" }}>{formatReadingTime(node.fields.readingTime.text)}</small>
            </div>
          </header>
          <section>
            <p
              dangerouslySetInnerHTML={{
                __html: node.frontmatter.description || node.excerpt,
              }}
            />
          </section>
        </article>
      )
    )}
  </Layout>
)

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date
            title
            description
          }
          fields {
            slug
            readingTime {
              text
            }
          }
        }
      }
    }
  }
`

const BlogPreview = styled.h3`
  margin-bottom: ${rhythm(1 / 4)};
`

const BlogLink = styled(Link)`
  box-shadow: none;
  color: #c7f0db;
  &:hover {
    color: #8bbabb;
  }
`

const BlogDate = styled.small`
  color: #aaa;
`
