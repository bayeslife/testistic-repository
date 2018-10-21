import Repository from '../src/index.js'

import { assert } from 'chai'

describe('Given a Repository and a test run', function () {
  var repository
  var testrun = {
    project: 'X',
    epic: 'Y'
  }
  before(() => {
    repository = Repository.create()
  })
  describe('When information about the schema is requested', function () {
    it('Then location for all testruns is "testistic.testruns.all.all"', async function () {
      assert.equal('testistic.testruns.all.all', Repository.schema().getTestRunTopic())
    })
    it('Then location for projects testruns is "testistic.testruns.X.all"', async function () {
      assert.equal('testistic.testruns.X.all', Repository.schema().getProjectTestRunTopicFromTestRun(testrun))
    })
    it('Then location for epics testruns is "testistic.testruns.X.Y"', async function () {
      assert.equal('testistic.testruns.X.Y', Repository.schema().getEpicTestRunTopicFromTestRun(testrun))
    })

    it('Then location for all statistics is "testistic.statistics.all.all"', async function () {
      assert.equal('testistic.statistics.all.all', Repository.schema().getStatisticsAll())
    })
    it('Then location for project statistics is "testistic.statistics.X.all"', async function () {
      assert.equal('testistic.statistics.X.all', Repository.schema().getStatisticsProject(testrun))
    })
    it('Then location for epic statistics is "testistic.statistics.X.Y"', async function () {
      assert.equal('testistic.statistics.X.Y', Repository.schema().getStatisticsEpic(testrun))
    })
  })
})
