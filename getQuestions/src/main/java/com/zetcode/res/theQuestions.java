package com.zetcode.res;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

@Path("questions")
public class theQuestions {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getQuestions() {

        // connects to the Mongo database & loads the question data
        MongoClient mongoClient = new MongoClient( "localhost" , 3001 );
        MongoDatabase database = mongoClient.getDatabase("meteor");
        MongoCollection<Document> collection = database.getCollection("questions");
        MongoCursor<Document> cursor = collection.find().iterator();

        String returnMe = "";
        try {
            while (cursor.hasNext()) {
                Document holder = cursor.next(); 
                // converts the Mongo documents into JSON
                String jsonOut = cursor.next().toJson();

                // Some optional outputs:
                    // Integer category =  (Integer)holder.get("Category");  
                    // String Text =  (String)holder.get("Text");
                    // String leftText =  (String)holder.get("LeftText");
                    // String sumOfAnswers =  (String)holder.get("SumOfAnswers");

                    returnMe += jsonOut+"\n\n";

                }
            } finally {
                cursor.close();
            }
        // if no data to display...
        if (returnMe == ""){returnMe = "No data found";}

        return returnMe;
    }
}