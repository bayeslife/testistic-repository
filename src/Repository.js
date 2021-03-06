import config from './Config.js'

import Debug from 'debug'
import assert from 'assert'
const debug = Debug('testistic-repository')

var { kafkaclient } = require('kafka-client')

function getStatisticsAll () {
  return config.topic_statistics_all
}

function getStatisticsProject (testrun) {
  return config.topic_statistic_project + testrun.project + '.all'
}

function getStatisticsEpic (testrun) {
  return config.topic_statistic_epic + testrun.project + '.' + testrun.epic
}

function getTestRunTopic () {
 return config.topic_testruns
}

function getProjectTopic () {
  return config.topic_projects
}

function getProjectTestRunTopicFromTestRun (testrun) {
  return config.topic_projectTestruns + testrun.project + '.all'
}

function getEpicTestRunTopicFromTestRun (testrun) {
  return config.topic_projectTestruns + testrun.project + '.' + testrun.epic
}

function getProjectTestRunTopicFromProject (project) {
  return config.topic_projectTestruns + project + '.all'
}

function schema () {
  return {
    getStatisticsAll,
    getStatisticsProject,
    getStatisticsEpic,

    getTestRunTopic,
    getProjectTopic,
    getProjectTestRunTopicFromTestRun,
    getEpicTestRunTopicFromTestRun,

    getProjectTestRunTopicFromProject
  }
}
function create (options) {
   var kafkaUrl = options ? options.kafkaUrl : config.kafkaUrl
  debug(`KafkaUrl: ${kafkaUrl}`)
  assert.ok(kafkaUrl, 'kafka connect url needs to be defined by KAFKASERVICE environment but is:' + kafkaUrl)
  debug('Connecting to kafka on', kafkaUrl)
  var client = kafkaclient(kafkaUrl)
  var rep = {
    // close: function () {
    //   client.close()
    // },
    setup: async function () {
      await this.createTopic(getTestRunTopic())
      await this.createTopic(getProjectTopic())
    },

    produce: async function (entityType, entity) {
      var topic = entityType
      assert(entityType, 'EntityType needs to be defined')
      assert(entity, 'Entity needs to be defined')
      var produced = await client.produceTopicKeyValue('0', entity, topic)
      return entity
    },

    get: async function (entityType, numberToRetrieve = 100, offset = 0) {
      var topic = entityType
      assert(entityType, 'EntityType needs to be provided')
      assert(numberToRetrieve, 'EntityType needs to be provided')
      var entities = await client.batchConsume('client', topic, numberToRetrieve, offset)
      return entities
    },

    getLatest: async function (entityType) {
      var topic = entityType
      assert(entityType, 'EntityType needs to be provided')
      var entities = await client.batchConsume('client', topic, 1)
      return entities ? entities[0] : null
    },

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
      var projects = await client.selectAll(topic)
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
  rep.setup()
  return rep
}

export default {
  schema,
  create
}
