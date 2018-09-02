import config from './Config.js'

import Debug from 'debug'
import assert from 'assert'
const debug = Debug('testistic-repository')

var k2client = require('kafka-client')

function create (kafkaUrl) {
  assert.ok(kafkaUrl, 'kafka connect url needs to be defined but is:' + kafkaUrl)
  debug('Connecting to kafka on', kafkaUrl)
  var client = k2client(kafkaUrl)
  return {
    // close: function () {
    //   client.close()
    // },
    produceProject: async function (project) {
      var topicProjects = config.topic_projects
      debug(topicProjects)
      var produced = await client.produceTopicKeyValue(project.name, project, topicProjects)
      return produced
    },
    getProjects: async function () {
      var topicProjects = config.topic_projects
      debug('Getting from topic:', topicProjects)
      var projects = await client.selectAll('client', topicProjects)
      return projects
    },
    produceTestRun: async function (testrun) {
      var topicTestRuns = config.topic_testruns
      debug(topicTestRuns)
      var produced = await client.produceTopicKeyValue(testrun.epic, testrun, topicTestRuns)
      return produced
    },
    getTopics: async function () {
      var testruns = await client.getTopics()
      return testruns
    },
    getTestRuns: async function () {
      var topicTestRuns = config.topic_testruns
      debug('Getting from topic:', topicTestRuns)
      var testruns = await client.batchConsume('client', topicTestRuns, 10/* batch size */)
      return testruns
    }
  }
}

export default {
  create
}