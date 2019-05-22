import * as gitlabClient from '../src/gitlab/client'

import {expect} from 'chai'
import {fetchLatestPipelines} from '../src/gitlab/pipelines'
import sinon from 'sinon'

const gitlab = {
  url: 'https://gitlab.com',
  'access-token': 'some gitlab client'
}

const responsePipelines = [
  {
    id: 17172603,
    ref: 'feature/best-feature',
    status: 'success'
  },
  {
    id: 17172603,
    ref: 'master',
    status: 'success'
  },
  {
    id: 17172603,
    ref: 'woho',
    status: 'success'
  }
]

sinon.stub(gitlabClient, 'gitlabRequest').callsFake((uri, options) => {
  if (uri.includes('jobs')) {
    return {data: []}
  }

  if (options.ref === 'master') {
    return {data: []}
  }

  return {data: responsePipelines}
})

describe('projects', () => {
  it('Should find latest pipeline with inclusive filtering', async () => {
    const config = {...gitlab, projects: {includeBranches: 'feature.*'}}
    const pipelines = await fetchLatestPipelines(5385889, config)
    expect(pipelines).to.deep.equal([responsePipelines[0]])
  })

  it('Should find latest pipeline with exclusive filtering', async () => {
    const config = {...gitlab, projects: {excludeBranches: 'master'}}
    const pipelines = await fetchLatestPipelines(5385889, config)
    expect(pipelines).to.deep.equal([responsePipelines[0]])
  })
})
