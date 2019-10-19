import React from "react"
import { graphql } from "gatsby"
import Layout from "components/layout"
import SEO from "components/seo"

const NotFoundPage: React.FC = ({ data, location }: any): JSX.Element => (
  <Layout location={location} title={data.site.siteMetadata.title}>
    <SEO title="404: Not Found" />
    <h1>Not Found</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Layout>
)

export default NotFoundPage

export const pageQuery: void = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
