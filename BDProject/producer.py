import csv
import random
import time
from confluent_kafka import Producer

# Produce messages to a Kafka topic
def produce_to_kafka(broker_address, topic, data):
    configuration = {
        'bootstrap.servers': broker_address,
    }

    producer = Producer(**configuration)

    try:
        for message in data:
            # Produce message to Kafka topic
            producer.produce(topic, value=str(message))
            producer.poll(0)  # Poll to handle message delivery reports

        # Flush the producer to ensure all messages are sent
        producer.flush()

    except Exception as e:
        print(f"Error producing to Kafka: {e}")



# Kafka broker address and topic
broker_address = 'localhost:9092'
kafka_topic = 'topic'



# Counter for processing every 100th row
i = 1
# List to store data before producing to Kafka
data_array = []

# Open and read the CSV file
with open("./training.1600000.processed.noemoticon.csv", 'r', encoding='utf-8') as csv_file:
    csv_reader = csv.reader(csv_file)
    
    # Iterate through the rows in the CSV file
    for row in csv_reader:
        if i % 100 != 0:
            # Create a tweet dictionary from the CSV row
            tweet = {
                "id": row[1],
                "date": row[2],
                "user": row[4],
                "text": row[5],
                "retweets": int(random.random() * 10)
            }
            # Add tweet to the data array
            data_array.append(tweet)
        else:
            # Produce data to Kafka every 100th row
            produce_to_kafka(broker_address, kafka_topic, data_array)
            time.sleep(1)  # Pause for 1 second before processing next batch
            data_array = []  # Clear the data array for the next batch

        i += 1  # Increment counter for the next row
