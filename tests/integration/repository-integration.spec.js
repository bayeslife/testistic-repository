import Repository from '../../src/index.js'
import Testistic from 'testistic-model'
import uuid from 'uuid/v1'

import { assert } from 'chai'

var debug = require('debug')('kafka-client')

const kafkahost = process.env.KAFKA_HOST + ':9092' || '192.168.56.10:9092'

var topic = `topic-delete-${uuid()}`
var group = `group-${uuid()}`

describe('Given a Repository', function () {
  describe('When the respository is connected', function () {
    var repository = Repository.create(kafkahost)
    // after(function () {
    //   repository.close()
    // })
    describe('When create topic', function () {
      it('Then topics are returned', async function () {
        debug(`Creating topic ${topic}`)
        var result = await repository.createTopic(topic)
        assert(result)
      })
    })

    describe('When getTopics', function () {
      it('Then topics are returned', async function () {
        var topics = await repository.getTopics()
        debug('Topics', topics)
        assert(topics)
      })
    })

    describe('When produce a testrun', function () {
      var testrun = Testistic.TestRun.createFromTemplate()
      it('Then a testrun is produced', async function () {
        var produced = await repository.produceTestRun(testrun)
        debug('Produce', produced)
        assert(produced)
      })
      it('Then getting testruns returns the testrun', async function () {
        var testruns = await repository.getTestRuns(testrun.epic)
        debug('testruns', testruns.length)
        assert(testruns)
      })
    })

    describe('When produce a project testrun', function () {
      var testrun = Testistic.TestRun.createFromTemplate()
      it('Then a testrun is produced', async function () {
        var produced = await repository.produceProjectTestRun(testrun)
        debug('Produce', produced)
        assert(produced)
      })
      it('Then getting projectTestruns returns the project testrun', async function () {
        var testruns = await repository.getProjectTestRuns(testrun.project)
        debug('testruns', testruns.length)
        assert(testruns)
      })
    })

    describe('When create a consumer', function () {
      it('Then a consumer is returned', async function () {
        var consumer = await repository.createConsumer(group, topic, (message) => console.log(message))
        assert(consumer)
        consumer.close()
      })
    })
  })
})
