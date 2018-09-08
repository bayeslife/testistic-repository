import config from './Config.js'

import Debug from 'debug'
import assert from 'assert'
const debug = Debug('testistic-repository')

var { kafkaclient } = require('kafka-client')

function getTestRunTopic () {
 return config.topic_testruns
} 
function getProjectTopic () {
  return config.topic_projects
}
function getProjectTestRunTopicFromTestRun (testrun) {
  return config.topic_projectTestruns + testrun.project
}
function getProjectTestRunTopicFromProject (project) {
  return config.topic_projectTestruns + project
}

function schema () {
  return {
    getTestRunTopic,
    getProjectTopic,
    getProjectTestRunTopicFromTestRun,
    getProjectTestRunTopicFromProject
  }
}
function create (options) {
   var kafkaUrl = options ? options.kafkaUrl : config.kafkaUrl
  assert.ok(kafkaUrl, 'kafka connect url needs to be defined but is:' + kafkaUrl)
  debug('Connecting to kafka on', kafkaUrl)
  var client = kafkaclient(kafkaUrl)
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
      var topicProjects = getProjectTopic()
      debug(topicProjects)
      var produced = await client.produceTopicKeyValue(project.name, project, topicProjects)
      return produced
    },
    getProjects: async function () {
      var topic = getProjectTopic()
      debug(`Getting from topic ${topic}`)
      var projects = await client.selectAll('client', topic)
      return projects
    },

    produceTestRun: async function (testrun) {
      var topic = getTestRunTopic()
      debug(`Producing ProjectTestRun onto topic ${topic}`)
      var produced = await client.produceTopicKeyValue(testrun.epic, testrun, topic)
      return produced
    },
    getTestRuns: async function () {
      var topic = getTestRunTopic()
      debug(`Getting from topic ${topic}`)
      var testruns = await client.batchConsume('client', topic, 10/* batch size */)
      return testruns
    },

    produceProjectTestRun: async function (testrun) {
      var topic = getProjectTestRunTopicFromTestRun(testrun)
      debug(`Producing ProjectTestRun onto topic ${topic}`)
      var produced = await client.produceTopicKeyValue(testrun.epic, testrun, topic)
      return produced
    },
    getProjectTestRuns: async function (project) {
      var topic = getProjectTestRunTopicFromProject(project)
      debug(`Getting from topic ${topic}`)
      var testruns = await client.batchConsume('client', topic, 100/* batch size */)
      return testruns
    },

    createConsumer: async function (group, topic, handler) {
      debug(`Creating Consumer for ${topic}`)
      var subscriber = await client.createSubscriberGroup(group, topic, handler)
      debug(`Created Consumer for ${topic}`)
      return subscriber
    }
  }
}

export default {
  schema,
  create
}
