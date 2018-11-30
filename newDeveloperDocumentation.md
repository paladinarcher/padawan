# <p align="center">**HELP! WHAT DO I DO**:<p>

1. Instructions for downloading and installing padawan can be found at the bottom of the github page:</br>
#### <p align="center">***https://github.com/paladinarcher/padawan***</p>
- - - - - - - - - - - -
### HOW DOES METEOR WORK?
1. There are files that are used for the client side, the server side, and both.
2. The folder `padawan\imports\api` contains code for the server.
3. The folder `padawan\imports\startup` contains code for the client, server and both. Code for when the server first boots up is also in this folder.
4. The folder `padawan\imports\ui` contains code for the client. This is where the HTML will be, and the CSS will be in a folder called stylesheets.
5. Meteor uses javascript on both the client side, and the server side. If you have any questions about using meteor, you can search for solutions in the meteor documentation at this website:
#### <p align="center">***https://docs.meteor.com/api/methods.html***</p>
- - - - - - - - - - - -
### HOW TO COMMUNICATE WITH THE SERVER?
1. In a `padawan\imports\ui` .js file, if you want to call a function on the server, you can use Meteor.call. The variables a, b, and c below describe the parameters for a `Meteor.call`:</br>
> let a = 'server_side_method' This identifies what code will be run on the server;</br>
>  let b = any arguments you want to pass to the server side method will go here seperated by commas;</br>
>  let c = a function that will execute once the server method has completed and returned to the client;</br>
> Meteor.call(a, b, c);</br>
2. For the function c above, the function's first parameter will contain any error messages sent back from the server method, and the second parameter will hold the return value from the server method. These varibales can be called inside the c function.</br>
3. Be sure that Meteor is imported at the top of the .js file: `import { Meteor } from 'meteor/meteor';`
- - - - - - - - - - - -
### HOW TO COMMUNICATE WITH THE DATABASE?
1. On the server if you need to make queries of a MongoDB collection, you can do it using methods like .find() .findOne() .find().count(). The code below will find a user object with the username "admin", and store it in myUser.
> myUser = Meteor.users.findOne({username: "admin"});
2. In the code below, the find method will find all of the users, and the fetch method will convert all of the users into an array.
> let usrList = Meteor.users.find().fetch();
3. To create a new LearnShareSession object on the server you can use new and save. here is an example:
> let ls = new LearnShareSession({</br>
> &nbsp;&nbsp;&nbsp;&nbsp;title: lsTitle,</br>
> &nbsp;&nbsp;&nbsp;&nbsp;notes: lsNote</br>
> });</br>
> ls.save();</br>
4. Most objects have an \_id attribute that can be used to querry the database. To get the above `ls` object from the databse and store it in the variable `findLs` you can use the following code. notice with \_id there is no need to use curly brackets {}.
> let findLs = LearnShareSession.findOne(ls.\_id);
- - - - - - - - - - - -
### HOW DO THE HTML AND JAVASCRIPT FILES INTERACT?
1. On the client side, Blaze Spacebars in the HTML are used to call the javascript in the corresponding .js file. You can usually Zecognize spacebars because they have double brackets {{}}. For more information on Blaze Spacebars, go to this website:</br>
#### <p align="center">***http://blazejs.org/api/spacebars.html***</p></br>
2. In the Spacebar below, the `totalAnswers` helper method is called in the corresponding .js file. `question.TimesAnswered.LeftSum` and `question.TimesAnswered.RightSum` are parameters that the Spacebar passes to the `totalAnswers` method.</br>
> \{\{totalAnswers question.TimesAnswered.LeftSum question.TimesAnswered.RightSum\}\}</br>
## <p align="center">**POINTERS:**</p></br>
1. If you are using an IDE like atom or notepad++, you can search for keywords through all the files using the keyboard shortcut `ctrl+shift+f`.
2. If you want to know what file a class is being called from, you can usually find it by searching all the files for `const [class_name]`. An example would be `const Question`.
3. The file `padawan\imports\startup\server\fixtures.js` contains sample data. If you want to reset the sample data in your database, do a word search for the line `const delPrevious = 0;` If you find it, you can change the 0 to a 1, save the file, let meteor finish running, then switch the number back to 0 so the sample data doesn't keep resetting.</br>
4. You can use a program like MongoDB Compass to see what is in the database, set the admin email verification status to true, and manually delete items in the Mongo database.</br>
##### <p align="center">**https://www.mongodb.com/download-center?jmp=hero#compass**</p></br>
5. Here are steps to change the [MongoDB Compass](https://docs.mongodb.com/compass/master/install/) admin verification to true.</br>
   * Hostname: localhost
   * Port: 3001
   * Click `CONNECT`
   * Under `My Cluster` choose `meteor > users > emails > 0: Object`
   * Change `verified: false` to `verified: true`
6. vimium is a browser add on you can use to navigate web browsers quickly:
###### <p align="center">**https://vimium.github.io/**</p></br>
