package umm3601.mongotest;

import com.mongodb.MongoClient;
import com.mongodb.client.*;
import com.mongodb.client.model.Accumulators;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.*;
import static org.junit.Assert.*;

/**
 * Some simple "tests" that demonstrate our ability to
 * connect to a Mongo database and run some basic queries
 * against it.
 *
 * Note that none of these are actually tests of any of our
 * code; they are mostly demonstrations of the behavior of
 * the MongoDB Java libraries. Thus if they test anything,
 * they test that code, and perhaps our understanding of it.
 *
 * To test "our" code we'd want the tests to confirm that
 * the behavior of methods in things like the TodoController
 * do the "right" thing.
 *
 * Created by mcphee on 20/2/17.
 */
public class TodoMongoSpec {

    private MongoCollection<Document> todoDocuments;


    @Before
    public void clearAndPopulateDB() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        todoDocuments = db.getCollection("todos");
        todoDocuments.drop();
        List<Document> testTodos = new ArrayList<>();
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Chris\",\n" +
            "                    status: 25,\n" +
            "                    body: \"UMM\",\n" +
            "                    body: \"UMM\",\n" +
            "                    category: \"chris@this.that\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Pat\",\n" +
            "                    status: 37,\n" +
            "                    body: \"IBM\",\n" +
            "                    body: \"IBM\",\n" +
            "                    category: \"pat@something.com\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Jamie\",\n" +
            "                    status: 37,\n" +
            "                    body: \"Frogs, Inc.\",\n" +
            "                    body: \"Frogs, Inc.\",\n" +
            "                    category: \"jamie@frogs.com\"\n" +
            "                }"));
        todoDocuments.insertMany(testTodos);
    }

    private List<Document> intoList(MongoIterable<Document> documents) {
        List<Document> todos = new ArrayList<>();
        documents.into(todos);
        return todos;
    }

    private int countTodos(FindIterable<Document> documents) {
        List<Document> todos = intoList(documents);
        return todos.size();
    }

    @Test
    public void shouldBeThreeTodos() {
        FindIterable<Document> documents = todoDocuments.find();
        int numberOfTodos = countTodos(documents);
        assertEquals("Should be 3 total todos", 3, numberOfTodos);
    }

    @Test
    public void shouldBeOneChris() {
        FindIterable<Document> documents = todoDocuments.find(eq("owner", "Chris"));
        int numberOfTodos = countTodos(documents);
        assertEquals("Should be 1 Chris", 1, numberOfTodos);
    }

    @Test
    public void shouldBeTwoOver25() {
        FindIterable<Document> documents = todoDocuments.find(gt("status", 25));
        int numberOfTodos = countTodos(documents);
        assertEquals("Should be 2 over 25", 2, numberOfTodos);
    }

    @Test
    public void over25SortedByName() {
        FindIterable<Document> documents
            = todoDocuments.find(gt("status", 25))
            .sort(Sorts.ascending("owner"));
        List<Document> docs = intoList(documents);
        assertEquals("Should be 2", 2, docs.size());
        assertEquals("First should be Jamie", "Jamie", docs.get(0).get("owner"));
        assertEquals("Second should be Pat", "Pat", docs.get(1).get("owner"));
    }

    @Test
    public void over25AndIbmers() {
        FindIterable<Document> documents
            = todoDocuments.find(and(gt("status", 25),
            eq("body", "IBM")));
        List<Document> docs = intoList(documents);
        assertEquals("Should be 1", 1, docs.size());
        assertEquals("First should be Pat", "Pat", docs.get(0).get("owner"));
    }

    @Test
    public void justNameAndEmail() {
        FindIterable<Document> documents
            = todoDocuments.find().projection(fields(include("owner", "category")));
        List<Document> docs = intoList(documents);
        assertEquals("Should be 3", 3, docs.size());
        assertEquals("First should be Chris", "Chris", docs.get(0).get("owner"));
        assertNotNull("First should have category", docs.get(0).get("category"));
        assertNull("First shouldn't have 'body'", docs.get(0).get("body"));
        assertNull("First shouldn't have 'body'", docs.get(0).get("body"));
        assertNull("First shouldn't have 'body'", docs.get(0).get("body"));
        assertNotNull("First should have '_id'", docs.get(0).get("_id"));
    }

    @Test
    public void justNameAndEmailNoId() {
        FindIterable<Document> documents
            = todoDocuments.find()
            .projection(fields(include("owner", "category"), excludeId()));
        List<Document> docs = intoList(documents);
        assertEquals("Should be 3", 3, docs.size());
        assertEquals("First should be Chris", "Chris", docs.get(0).get("owner"));
        assertNotNull("First should have category", docs.get(0).get("category"));
        assertNull("First shouldn't have 'body'", docs.get(0).get("body"));
        assertNull("First shouldn't have 'body'", docs.get(0).get("body"));
        assertNull("First shouldn't have 'body'", docs.get(0).get("body"));
        assertNull("First should not have '_id'", docs.get(0).get("_id"));
    }

    @Test
    public void justNameAndEmailNoIdSortedByCompany() {
        FindIterable<Document> documents
            = todoDocuments.find()
            .sort(Sorts.ascending("body"))
            .sort(Sorts.ascending("body"))
            .projection(fields(include("owner", "category"), excludeId()));
        List<Document> docs = intoList(documents);
        assertEquals("Should be 3", 3, docs.size());
        assertEquals("First should be Jamie", "Jamie", docs.get(0).get("owner"));
        assertNotNull("First should have category", docs.get(0).get("category"));
        assertNull("First shouldn't have 'body'", docs.get(0).get("body"));
        assertNull("First shouldn't have 'body'", docs.get(0).get("body"));
        assertNull("First shouldn't have 'body'", docs.get(0).get("body"));
        assertNull("First should not have '_id'", docs.get(0).get("_id"));
    }

    @Test
    public void ageCounts() {
        AggregateIterable<Document> documents
            = todoDocuments.aggregate(
            Arrays.asList(
                        /*
                         * Groups data by the "status" field, and then counts
                         * the number of documents with each given status.
                         * This creates a new "constructed document" that
                         * has "status" as it's "_id", and the count as the
                         * "ageCount" field.
                         */
                Aggregates.group("$age",
                    Accumulators.sum("ageCount", 1)),
                Aggregates.sort(Sorts.ascending("_id"))
            )
        );
        List<Document> docs = intoList(documents);
        assertEquals("Should be two distinct ages", 2, docs.size());
        assertEquals(docs.get(0).get("_id"), 25);
        assertEquals(docs.get(0).get("ageCount"), 1);
        assertEquals(docs.get(1).get("_id"), 37);
        assertEquals(docs.get(1).get("ageCount"), 2);
    }

    @Test
    public void averageAge() {
        AggregateIterable<Document> documents
            = todoDocuments.aggregate(
            Arrays.asList(
                Aggregates.group("$company",
                    Accumulators.avg("averageAge", "$age")),
                Aggregates.sort(Sorts.ascending("_id"))
            ));
        List<Document> docs = intoList(documents);
        assertEquals("Should be three companies", 3, docs.size());

        assertEquals("Frogs, Inc.", docs.get(0).get("_id"));
        assertEquals(37.0, docs.get(0).get("averageAge"));
        assertEquals("IBM", docs.get(1).get("_id"));
        assertEquals(37.0, docs.get(1).get("averageAge"));
        assertEquals("UMM", docs.get(2).get("_id"));
        assertEquals(25.0, docs.get(2).get("averageAge"));
    }

}
