import Repository from '../../src/index.js'
import Testistic from 'testistic-model'
import uuid from 'uuid/v1'

import { assert } from 'chai'

var debug = require('debug')('kafka-client')

var topic = `topic-delete-${uuid()}`
var group = `group-${uuid()}`

describe('Given a Repository', function () {
  describe('When the respository is connected', function () {
    var repository = Repository.create()
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

    describe('When produce an entity', function () {
      var entity = { 'type': 'pullrequests', 'value': 'avalue5' }
      it('Then a entity is produced', async function () {
        var produced = await repository.produce(entity.type, entity)
        debug('Produce', produced)
        assert(produced)
      })
      it('Then get returns entities', async function () {
        var produced = await repository.get(entity.type, 5)
        debug(`Produced ${produced.length}`, produced)
        assert(produced)
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

    describe('When get global statistics', function () {
      it('Then a testrun is produced', async function () {
        var produced = await repository.get( Repository.schema().getStatisticsAll())
        debug('Produce', produced)
        assert(produced)
      })
    })

    describe('When create a consumer', function () {
      var consumer
      before(async function () {
        consumer = await repository.createConsumer(group, topic, (message) => console.log(message))
      })
      it('Then a consumer is returned', async function () {
        assert(consumer)
        consumer.close()
      })
    })
  })
})
