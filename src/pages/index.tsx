import React from "react"
import { Link, graphql } from "gatsby"
import Bio from "components/bio"
import Layout from "components/layout"
import SEO from "components/seo"
import { rhythm } from "utils/typography"
import styled from "styled-components"

const BlogIndex: React.FC = ({ data, location }: any): JSX.Element => (
  <Layout location={location} title={data.site.siteMetadata.title}>
    <SEO title="Blog" />
    <Bio />
    {data.allMarkdownRemark.edges.map(
      ({ node }: any): JSX.Element => (
        <article key={node.fields.slug}>
          <header>
            <BlogPreview>
              <BlogLink to={node.fields.slug}>
                {node.frontmatter.title || node.fields.slug}
              </BlogLink>
            </BlogPreview>
            <BlogDate>{node.frontmatter.date}</BlogDate>
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
            date(formatString: "MMMM DD, YYYY")
            title
            description
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
  box-shadow: none!important;
  color: #19cfff!important;
  &:hover {
    color: #1197ba!important;
  }
`

const BlogDate = styled.small`
  color: #aaa;
`
