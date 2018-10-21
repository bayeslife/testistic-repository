
export default {
    topic_testruns: 'testistic.testruns.all.all', // Topic where every testrun is created
    topic_statistics_all: 'testistic.statistics.all.all', // Topic which aggregrates statistics across all test runs

    topic_projectTestruns: 'testistic.testruns.', // Topic where project test runs are created
    topic_statistic_project: 'testistic.statistics.', // Topic which aggregrates statistics across project test runs

    topic_epicTestruns: 'testistic.testruns.', // Topic where epic test runs are created
    topic_statistic_epic: 'testistic.statistics.', // Topic which aggregrates statistics across epic test runs

    topic_projects: 'testistic.projects', // Topic where projects are created
    topic_epics: 'testistic.epics',

    kafkaUrl: process.env.KAFKASERVICE || '192.168.56.10:9092'
}
