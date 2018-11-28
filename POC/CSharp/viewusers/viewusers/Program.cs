using Nancy.Hosting.Self;
using MongoDB.Bson.Serialization;
using System;

namespace ViewUsers
{
  // main loop 
  class Program
  {
    static void Main(string[] args)
    {
       // register class map 
       BsonClassMap.RegisterClassMap<Users>(
         cm => 
         {
          cm.AutoMap();
         }
       );

      // serve w/ nancy
      var uri = "http://localhost:3002";
      Console.WriteLine("Starting Nancy on " + uri);
      Console.WriteLine("User information is at http://localhost:3002/users");

      // init nancyhost 
      var host = new NancyHost(new Uri(uri));
      host.Start(); // start hosting

      // check for mono 
      if (Type.GetType("Mono.Runtime") != null) 
      {
        Console.WriteLine("Mono Installed");
        Console.WriteLine("To Quit, press 'Q' + 'Enter', or 'Ctrl' + 'C'...");
        var userInput = Console.ReadLine();
        if ( userInput == "Q" || userInput == "q" )
        {
          Console.WriteLine("Stopping Nancy..");
          host.Stop();  // stop hosting
        }
      }
      else 
      {

        Console.WriteLine("Stopping Nancy..");
        host.Stop();  // stop hosting
      }

    }
  }

}// end namespace 