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
    getTopics: async function () {
      var result = await client.getTopics()
      return result
    },
    createTopic: async function (topic) {
      debug(`Create topic ${topic}`)
      var result = await client.createTopic(topic)
      return result
    },

    produceProject: async function (project) {
      var topicProjects = config.topic_projects
      debug(topicProjects)
      var produced = await client.produceTopicKeyValue(project.name, project, topicProjects)
      return produced
    },
    getProjects: async function () {
      var topic = config.topic_projects
      debug(`Getting from topic ${topic}`)
      var projects = await client.selectAll('client', topic)
      return projects
    },

    produceTestRun: async function (testrun) {
      var topic = config.topic_testruns
      debug(`Producing ProjectTestRun onto topic ${topic}`)
      var produced = await client.produceTopicKeyValue(testrun.epic, testrun, topic)
      return produced
    },
    getTestRuns: async function () {
      var topic = config.topic_testruns
      debug(`Getting from topic ${topic}`)
      var testruns = await client.batchConsume('client', topic, 10/* batch size */)
      return testruns
    },

    produceProjectTestRun: async function (testrun) {
      var topic = config.topic_projectTestruns + testrun.project
      debug(`Producing ProjectTestRun onto topic ${topic}`)
      var produced = await client.produceTopicKeyValue(testrun.epic, testrun, topic)
      return produced
    },
    getProjectTestRuns: async function (project) {
      var topic = config.topic_projectTestruns + project
      debug(`Getting from topic ${topic}`)
      var testruns = await client.batchConsume('client', topic, 100/* batch size */)
      return testruns
    },

    createConsumer: async function (group, topic, handler) {
      debug(`Creating Consumer for ${topic}`)
      var subscriber = await client.createSubscriber(group, topic, handler)
      return subscriber
    }
  }
}

export default {
  create
}
