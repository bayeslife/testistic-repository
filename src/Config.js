
export default {
    topic_statistics_all: 'testistic.statistics.all', // Topic which aggregrates statistics across all test runs
    topic_statistic_project: 'testistic.statistics.project.', // Topic which aggregrates statistics across project test runs
    topic_statistic_epic: 'testistic.statistics.epic.', // Topic which aggregrates statistics across epic test runs

    topic_testruns: 'testistic.testruns', // Topic where every testrun is created

    topic_projects: 'testistic.projects', // Topic where projects are created

    topic_projectTestruns: 'testistic.projecttestruns.', // Topic where project test runs are created

    topic_epics: 'testistic.epics',

    kafkaUrl: process.env.KAFKASERVICE || '192.168.56.10:9092'
}
