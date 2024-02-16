ThisBuild / version := "0.1.0-SNAPSHOT"

ThisBuild / scalaVersion := "2.12.18"

lazy val root = (project in file("."))
  .settings(
    name := "BigDataProject"
  )
libraryDependencies += "org.apache.spark" %% "spark-core" % "3.1.2"
libraryDependencies += "org.apache.spark" %% "spark-sql" % "3.1.2"
libraryDependencies += "org.scalanlp" %% "breeze" % "1.1"
libraryDependencies += "org.apache.spark" %% "spark-streaming" % "3.1.2"
libraryDependencies += "org.apache.kafka" % "kafka-clients" % "3.1.2"
libraryDependencies += "org.apache.spark" %% "spark-streaming-kafka-0-10" % "3.1.2"
libraryDependencies += "org.apache.spark" %% "spark-sql-kafka-0-10" % "3.1.2"
libraryDependencies += "org.elasticsearch" %% "elasticsearch-spark-20" % "7.14.0"
libraryDependencies += "org.mongodb.spark" %% "mongo-spark-connector" % "3.0.0"