from flask import Flask, jsonify, send_file
from pymongo import MongoClient


app = Flask(__name__)

# Establish a connection to MongoDB
mongo_connection = MongoClient('mongodb://localhost:27017')

# Access the 'BigDataProject' database
my_db = mongo_connection['BigDataProject']

# Access the 'tweets' collection within the database
collection = my_db['tweets']

# Function to find and return the top 20 users based on tweet count
def find_top_users():
    # MongoDB aggregation pipeline to group by user and count tweets, sort, and limit to top 20
    query = [
        {"$group": {"_id": "$user", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 20}
    ]

    # Execute the aggregation query and store the results in a list
    users = [result for result in collection.aggregate(query)]
    return users

# Function to get user tweets distribution over time
def get_user_tweets_distribution(userName):
    # MongoDB aggregation pipeline to match the specified user, group by date, count tweets, and sort by date
    query = [
        {"$match": {"user": userName}},
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y/%m/%d",
                        "date": {
                            "$dateFromString": {
                                "dateString": "$date"
                            }
                        }
                    }
                },
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"_id": 1}}
    ]

    # Execute the aggregation query and retrieve the results
    user = list(collection.aggregate(query))
    return user


# Route to serve the main HTML page
@app.route('/')
def main():
    return send_file('./templates/index.html')


# Route to get the top users
@app.route('/top_users')
def top_users():
    users = find_top_users()
    return jsonify(users)


# Route to get tweet distribution for a specific user
@app.route('/user_tweet_distribution/<userName>')
def user_tweet_distribution(userName):
    user = get_user_tweets_distribution(userName)
    return jsonify(user)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8000)
