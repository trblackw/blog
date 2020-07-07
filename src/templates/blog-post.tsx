import React from "react"
import { Link, graphql } from "gatsby"
import Bio from "components/bio"
import Layout from "components/layout"
import SEO from "components/seo"
import { rhythm, scale } from "utils/typography"
import styled from "styled-components"
import { formatReadingTime, scrollPageTo } from "utils"
import useViewport from "hooks/useViewport"
import format from "date-fns/format"

interface Props {
  data: { [key: string]: any }
  pageContext: {
    previous: { [key: string]: any }
    next: { [key: string]: any }
    markDownRemark: { [key: string]: any }
  }
  location: Location
}

const BlogPostTemplate: React.FC<Props> = ({ data, pageContext, location }): JSX.Element => {
  const siteTitle: string = data.site.siteMetadata.title
  const { previous, next } = pageContext
  const { markdownRemark: post } = data
  const [{ width: windowWidth }] = useViewport()
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={post.frontmatter.title} description={post.frontmatter.description || post.excerpt} />
      <article>
        <header>
          <PostTitle>{post.frontmatter.title}</PostTitle>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <PostDate>{format(new Date(post.frontmatter.date), "MMMM do, yyyy")}</PostDate>
            <ReadTime marginTop={windowWidth > 415 ? "5px" : undefined}>
              {formatReadingTime(post.fields.readingTime.text)}
            </ReadTime>
          </div>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <ScrollToTop onClick={() => scrollPageTo("top")}>Back to beginning 👆🏻</ScrollToTop>
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
        date
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
`
const PostTitle = styled.h1`
  margin: ${rhythm(1)} 0 0 0;
  color: #eee;
  font-family: MonoLisa, monospace !important;
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
const ReadTime = styled.small<{ marginTop?: string }>`
  margin-left: 5px;
  ${({ marginTop }) => marginTop && `margin-top: ${marginTop}`}
`
const ScrollToTop = styled.button`
  background-color: transparent;
  color: #c7f0db;
  font-weight: 600;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 13px;
`
