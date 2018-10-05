#  Testisic Repository

Storage of Testistic Model into kafka queues

There are topics for different information entities (here)[./src/Config.js]

The repository supports
- creating and reading topics
- producing and getting Projects,TestRuns,ProjectTestRun
- create a Consumer

## Configuration

The kafka endpoint (host and port) can be provided
- directly to the Repository constructor
- through the KAFKASERVICE environment variable
- or otherwise a default

## Thoughts
The UI needs to query for a batch of test results for each Epic.  
The query group can be the userid for the user who is doing the querying.


## Release Notes

[notes](./RELEASE.md)
