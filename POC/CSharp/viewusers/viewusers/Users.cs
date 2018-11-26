using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;

namespace ViewUsers
{
  // build user template 
  public class Users
  {
    [BsonId]
    public string id { get; set; }

    [BsonDateTimeOptions(Representation = BsonType.Document)]
    public DateTime createdAt { get; set; }

    [BsonElement]
    public object services { get; set; }

    [BsonElement]
    public string username { get; set; }

    [BsonElement]
    public object[] emails { get; set; }

    [BsonElement]
    public string slug { get; set; }

    [BsonDateTimeOptions(Representation = BsonType.Document)]
    public DateTime updateAt { get; set; }

    [BsonElement]
    public object MyProfile { get; set; }

    [BsonElement]
    public string[] teams { get; set; }

    [BsonElement]
    public object roles { get; set; }

    [BsonElement]
    public object profile { get; set; }
  }
}
