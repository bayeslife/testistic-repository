import Repository from '../src/index.js'
import Testistic from 'testistic-base'

import { assert } from 'chai'

var debug = require('debug')('kafka-client')

const kafkahost = process.env.KAFKA_HOST + ':9092' || '192.168.56.10:9092'

describe('Given a Repository', function () {
  describe('When the respository is connected', function () {
    var repository = Repository.create(kafkahost)
    // after(function () {
    //   repository.close()
    // })
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
  })
})
