/** @jsx jsx */
import { jsx } from "theme-ui"
import React from "react"
import { Link } from "gatsby"
import LaunchDemoIcon from "react-icons/lib/md/launch"
import GithubIcon from "react-icons/lib/go/mark-github"
import MdStar from "react-icons/lib/md/star"
import styles, { showcaseList, showcaseItem } from "../shared/styles"
import ThumbnailLink from "../shared/thumbnail"
import EmptyGridItems from "../shared/empty-grid-items"
import V2Icon from "../../assets/icons/v2icon.svg"
import { get } from "lodash-es"

const StartersList = ({ urlState, starters, count, sortRecent }) => {
  if (!starters.length) {
    // empty state!
    const emptyStateReason =
      urlState.s !== ``
        ? urlState.s // if theres a search term
        : urlState.d && !Array.isArray(urlState.d)
        ? urlState.d // if theres a single dependency
        : `matching` // if no search term or single dependency
    return (
      <div
        css={{
          display: `grid`,
          height: `80%`,
          alignItems: `center`,
          justifyContent: `center`,
          textAlign: `center`,
        }}
      >
        <h1>
          No {`${emptyStateReason}`} starters found!
          <div sx={{ color: `gatsby` }}>
            <small>
              Why not write one and
              {` `}
              <Link to="/contributing/submit-to-starter-library/">
                submit it
              </Link>
              ? Or learn more
              {` `}
              <Link to="/docs/starters">about starters</Link>.
            </small>
          </div>
        </h1>
      </div>
    )
  }
  if (count) {
    starters = starters.sort(sortingFunction(sortRecent)).slice(0, count)
    return (
      <div sx={showcaseList}>
        {starters.map(({ node: starter }) => {
          const {
            description,
            gatsbyMajorVersion,
            name,
            githubFullName,
            lastUpdated,
            owner,
            slug,
            stars,
          } = starter.fields.starterShowcase
          const { url: demoUrl } = starter

          return (
            starter.fields && ( // have to filter out null fields from bad data
              <div
                key={starter.id}
                sx={{
                  ...showcaseItem,
                  ...styles.withTitleHover,
                }}
              >
                <ThumbnailLink
                  slug={`/starters${slug}`}
                  image={starter.childScreenshot}
                  title={`${owner}/${name}`}
                />
                <div css={{ ...styles.meta }}>
                  <div
                    css={{ display: `flex`, justifyContent: `space-between` }}
                  >
                    <span sx={{ color: `text.header` }}>{owner} /</span>
                    <span css={{ display: `flex` }}>
                      {gatsbyMajorVersion[0][1] === `2` && (
                        <img
                          src={V2Icon}
                          alt="Gatsby v2"
                          sx={{
                            mb: 0,
                            mr: 2,
                          }}
                        />
                      )}
                      <div
                        xs={{
                          alignItems: `center`,
                          display: `inline-flex`,
                          fontSize: 0,
                        }}
                      >
                        <MdStar /> {stars}
                      </div>
                    </span>
                  </div>
                  <div>
                    <Link to={`/starters${slug}`}>
                      <h5 sx={{ m: 0, fontSize: 2 }}>
                        <strong className="title">{name}</strong>
                      </h5>
                    </Link>
                  </div>
                  <div
                    sx={{
                      textOverflow: `ellipsis`,
                      overflow: `hidden`,
                      whiteSpace: `nowrap`,
                      marginBottom: 1,
                    }}
                  >
                    {description || `No description`}
                  </div>
                  <div
                    css={{ display: `flex`, justifyContent: `space-between` }}
                  >
                    <div css={{ display: `inline-block` }}>
                      Updated {new Date(lastUpdated).toLocaleDateString()}
                    </div>
                    <span>
                      <a
                        href={`https://github.com/${githubFullName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        css={{
                          ...styles.shortcutIcon,
                          svg: { verticalAlign: `text-top !important` },
                        }}
                      >
                        <GithubIcon />
                      </a>
                      {` `}
                      <a
                        href={demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        css={{
                          ...styles.shortcutIcon,
                          svg: { verticalAlign: `text-top !important` },
                        }}
                      >
                        <LaunchDemoIcon />
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            )
          )
        })}
        {starters.length && <EmptyGridItems styles={showcaseItem} />}
      </div>
    )
  }
  return null
}

export default StartersList

function sortingFunction() {
  return function({ node: nodeA }, { node: nodeB }) {
    const metricA = get(nodeA, `fields.starterShowcase.stars`, 0)
    const metricB = get(nodeB, `fields.starterShowcase.stars`, 0)
    return metricB - metricA
  }
}
