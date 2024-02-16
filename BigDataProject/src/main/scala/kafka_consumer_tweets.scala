import org.apache.log4j.BasicConfigurator
import org.apache.log4j.varia.NullAppender
import org.apache.spark.sql.{SparkSession, functions}
import org.apache.spark.sql.streaming.Trigger
import org.elasticsearch.hadoop.cfg.ConfigurationOptions

object kafka_consumer_tweets {

  def main(args: Array[String]): Unit = {

    val nullAppender = new NullAppender
    BasicConfigurator.configure(nullAppender)

      // Create a Spark session
      val spark = SparkSession
      .builder
      .config(ConfigurationOptions.ES_NODES, "127.0.0.1")
      .config(ConfigurationOptions.ES_PORT, "9200")
      .master("local[8]")
      .appName("StructuredNetworkTweets")
      .getOrCreate()

    import spark.implicits._

    // Set the number of shuffle partitions
    spark.conf.set("spark.sql.shuffle.partitions", 2)
    val df = spark
      .readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", "localhost:9092")
      .option("subscribe", "topic")
      .load()

    // Select and parse the value column as JSON
    val df1 = df.selectExpr("CAST(value AS STRING)")
      .select(functions.json_tuple($"value","id","date", "user", "text", "retweets"))
      .toDF("id","date", "user", "text", "retweets")

    
    // Define a function to write each batch of data to MongoDB
    val myFunction: (org.apache.spark.sql.Dataset[org.apache.spark.sql.Row], Long) => Unit = { (batchDF, batchId) =>
      batchDF.write
        .format("mongo")
        .mode("append")
        .option("uri", "mongodb://localhost:27017/BigDataProject.tweets")
        .save()
    }

    // Define a streaming query with a batch writer function and a 5-second trigger
    val query = df1.writeStream
      .outputMode("append")
      .foreachBatch(myFunction)
      .trigger(Trigger.ProcessingTime("5 seconds"))
      .start()

    query.awaitTermination()

  }}