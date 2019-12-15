import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { rhythm } from "utils/typography"
import { convertTimeStamp } from "utils"
import { Link as LinkIcon } from "styled-icons/boxicons-regular/Link"
import { ArrowBackIos } from "styled-icons/material/ArrowBackIos"
import { Link } from "gatsby"
import Loading from "components/loading"

interface GeneralData {
  avatar_url: string
  bio: string
  company: string
  followers: number
  following: number
  html_url: string
  login: string
  public_repos: number
  updated_at: string
  created_at: string
}

interface Repo {
  id: number
  name: string
  language: string
  html_url: string
  updated_at: string
  description: string
  homepage: string
}

const Activity: React.FC = (): JSX.Element => {
  const [general, setGeneral] = useState<GeneralData | null>(null)
  const [repos, setRepos] = useState<Repo[]>([])
  const [error, setError] = useState<any>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    (async () => {
      try {
        const urls = [
          "https://api.github.com/users/trblackw",
          "https://api.github.com/users/trblackw/repos?sort=created&type=owner&per_page=100",
        ]

        const promises = await Promise.all(urls.map(url => fetch(url)))
        const [general, repos] = await Promise.all(
          promises.map(promise => promise.json())
        )
        await setGeneral(general)
        await setRepos(repos)
      } catch (error) {
        setError(error)
      }
      setLoading(false)
    })()
  }, [])

  return (
    <Container>
      <NavLink to="/">
        <ArrowBackIos
          size={30}
          title="Arrow back"
          fontWeight={300}
          color="#537ec5s"
        />
      </NavLink>
      {loading ? (
        <Loading height="15%" width="15%" />
      ) : general && !error ? (
        <>
          <Flex alignItems="flex-start">
            <Avatar src={general.avatar_url} height="220" />
            <UserInfo>
              <Username>{general.login}</Username>
              <ProfileLink href={general.html_url}>
                {general.html_url}
              </ProfileLink>
              <StatsLabel>
                Followers: <StatsContent>{general.followers}</StatsContent>
              </StatsLabel>
              <StatsLabel>
                Following: <StatsContent>{general.following}</StatsContent>
              </StatsLabel>
              <StatsLabel>
                Joined:
                <StatsContent>
                  {convertTimeStamp(general.created_at)}
                </StatsContent>
              </StatsLabel>
              <StatsLabel>
                Repos: <StatsContent>{general.public_repos}</StatsContent>
              </StatsLabel>
            </UserInfo>
          </Flex>
          <RepoDataContainer>
            {repos.map(repo => (
              <RepoInfo {...repo} key={repo.id} />
            ))}
          </RepoDataContainer>
        </>
      ) : (
        <ErrorMessage>
          Doh! Something went wrong with the network request. Mind letting me
          know? <br />
          <Email>tuckerblackwell.dev@gmail.com</Email>
        </ErrorMessage>
      )}
    </Container>
  )
}

const RepoInfo: React.FC<Repo> = ({
  name,
  html_url,
  description,
  language,
  homepage,
  updated_at,
}): JSX.Element => (
  <RepoContainer>
    <RepoTitle href={html_url}>{name}</RepoTitle>
    <RepoDesc>{description}</RepoDesc>

    <Flex>
      <RepoLang>✏️ {language}</RepoLang>
      <LastCommit>Last updated: {convertTimeStamp(updated_at)}</LastCommit>
      {homepage && (
        <RepoLiveUrl>
          <a href={homepage}>
            <LinkIcon fontWeight={300} color="#24292e" size={20} />
            Hosted url
          </a>
        </RepoLiveUrl>
      )}
    </Flex>
  </RepoContainer>
)

export default Activity

const Container = styled.div`
  margin: 0 auto;
  max-width: ${rhythm(24)};
  padding: ${rhythm(1.5)} ${rhythm(3 / 4)};
`

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: ${({ alignItems = "center" }: { alignItems?: string }) =>
    alignItems};
`

const Avatar = styled.img`
  border: 1px solid #e1e4e8;
  border-radius: 5px;
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  margin: 0 15px 10px;
  object-fit: cover;
`
const UserInfo = styled.div``
const Username = styled.h3`
  color: #537ec5;
  font-weight: bolder;
  margin-top: auto;
  margin-bottom: 0;
  font-size: 2em;
`
const ProfileLink = styled.a`
  font-size: 1em;
  margin-top: auto;
  margin-bottom: 7px;
  display: inline-block;
`

const StatsLabel = styled.span`
  font-weight: bold;
  font-size: 1.1em;
  color: #537ec5;
  display: block;
  margin: 0;
`
const StatsContent = styled.p`
  font-weight: normal;
  font-size: 1em;
  display: inline-block;
  margin: 0;
`
const RepoDataContainer = styled.div`
  padding: 1em auto;
`
const RepoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 5px;
  text-align: left;
  :not(:last-child) {
    border-bottom: 1px solid #24292e;
    padding-bottom: 10px;
  }
`
const RepoTitle = styled.a`
  color: #f39422;
  text-decoration: none;
  box-shadow: none;
  font-weight: bold;
  font-size: 1em;
  margin-bottom: 3px;
  cursor: pointer;
  &:hover {
    color: #ba6602;
  }
`
const RepoDesc = styled.p`
  color: #eee;
  font-size: 0.9em;
`
const RepoLang = styled.span`
  color: #eee;
  font-weight: 600;
  font-size: 0.7em;
`
const RepoLiveUrl = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-left: 20px;
  align-items: center;
  a {
    font-size: 0.7em;
    text-decoration: none;
    box-shadow: none;
  }
`
const LastCommit = styled.span`
  margin-left: 20px;
  font-size: 0.7em;
`
const NavLink = styled(Link)`
  font-weight: bold;
  text-decoration: none;
  box-shadow: none;
`
const Email = styled.span`
  color: #537ec5;
  font-weight: bold;
`
const ErrorMessage = styled.div`
  margin: 1em auto;
  text-align: center;
`