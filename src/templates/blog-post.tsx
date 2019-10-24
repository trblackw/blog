import React from "react"
import { Link, graphql } from "gatsby"
import Bio from "components/bio"
import Layout from "components/layout"
import SEO from "components/seo"
import { rhythm, scale } from "utils/typography"
import styled from "styled-components"

interface Props {
  data: { [key: string]: any }
  pageContext: {
    previous: { [key: string]: any }
    next: { [key: string]: any }
    markDownRemark: { [key: string]: any }
  }
  location: Location
}

const BlogPostTemplate: React.FC<Props> = ({
  data,
  pageContext,
  location,
}): JSX.Element => {
  const siteTitle: string = data.site.siteMetadata.title
  const { previous, next } = pageContext
  const { markdownRemark: post } = data
  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article>
        <header>
          <PostTitle>{post.frontmatter.title}</PostTitle>
          <PostDate>{post.frontmatter.date}</PostDate>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <Divider />
        <footer>
          <Bio />
        </footer>
      </article>

      <nav>
        <Ul>
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </Ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`
const PostTitle = styled.h1`
  margin: ${rhythm(1)} 0 0 0;
  color: #eee;
`
const PostDate = styled.p`
  scale: ${scale(-1 / 5)};
  display: block;
  margin-bottom: ${rhythm(1)};
  color: #aaa;
`
const Divider = styled.hr`
  margin-bottom: ${rhythm(1)};
`

const Ul = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  color: #eee;
`
