Info 343 Final Project
======================

TODO
----
+ Work on mockups
+ Complete data extraction

Data Format
-----------
Format of JSON files located in data dir.

```javascript
[   // Array of all classes
    {   // One class
        "name":"Information School INFO 200 A", // Name of class
        "instructor":"Michael Eisenberg",   // Name of instructor
        "quarter":"AU12",   // Quarter info
        "The course as a whole:":[  // Name of question
            "64%",  // % of responders who said Excellent
            "26%",  // Very Good
            "9%",   // Good
            "1%",   // Fair
            "0%",   // Poor
            "0%",   // Very Poor
            "4.71"  // Median rating
      ]
    }
]
```

Ideas
-----
Pitch your ideas here:

1. Interactive scheduler for classes. The current schedule finder doesn't show all possible schedules if there are more than 10, and people have to open up multiple pages to find registration codes to change the classes they want to view. Create a website that will allow the users to do this on the same page and easily change what classes they want to see. 

2. Pet matcher: For people looking to adopt a dog and to people breeding dogs and want to make sure the 
owner is sane enough to have a dog and won't just throw it outside. Probably focus more on matching personalities.
It'll be like a pet social network but not as annoying :)

3. A daily code challenge. Basically make an account, everyday there's a different code challenge (i guess somehow
integrate a compiler? not sure yet) and if the pereson is stumped they can press a button to go to a discussion board
with other people to see their thought process.

4. A pinterest like website but for food. It'll be like a food porn website. It'll have recipes, pictures and howto 
videos. Just a site for food-lovers or people hungry. 

5. A website for a fashion designer. Basically being able to put down information of what kind of style the person likes
to wear and the weather. And then it'll find them an outfit. (this might be hard but it's fun to think about) 

6. Website for people that aren't techy enough and don't know what they want to get (computer wise, tablet wise).
So we all have that friend or know that person that wants to get a laptop but they always get the crappiest one
because they don't know technology. This website will have the different brands of technology in one place and
it'll be categorized by people's rates/reviews. Because not everyone wants to get all technical into hardrive. 
It'll focus on the usability of the technology and basically how long it lasts etc etc. 

7. On the topic of using the school API, how about something that takes those UW course evaluations and give it a pretty visualization. Best prof for selected course, easiest grader...etc. Graphcs, charts, search, compare. (Also, they get deleted every quarter, so storage would be nice too.)

8. Coupon website! With better categorical ordering (since the other ones suck lol) and actually have a search bar! 

AND BAM.

more to come... soon..


Roles
-----
+ Jessalyn Cheng - I volunteer to be PM! :D MY LIFE LONG DREAM AWAITS ME.
+ Chip Fukuhara - I volunteer to be on the development side. (compsci major!)
+ Patrick Chiang - I want to develop too.
+ Wesley G Wolanski - Design

Opinions on Pitches
-------------------

--------Schedule Finder---------
+ Chip: The tough part about this would be using the school's API to get the information on the classes
+ Patrick: Not as hard as screen grabbing + parsing. https://wiki.cac.washington.edu/display/SWS/Using+Public+Resources I've worked with it quite a bit.

-----------Pet Matcher-----------
+ Patrick: Social networks are overdone.

------Daily Code Challenge-------
+ Chip: Have we thought about where the code challenges are going to come from? It also sounds a bit similar to Practice-It
+ Patrick: Sounds like codingbat, CodeAcademy, or one of those challenges where you can make money from. There's a website online where companies post problem specs, people code solutions, and they pick the best code solution and pay them. Forgot what it's called. Totally do-able, but will be a hassle to integrate compiler.

----------Food Website-----------
+ Patrick: Food? Really?
+ I think enough recipe websites exist that other options would be more interesting.

--------Fashion Website----------

------Tech Product Website-------
+ Patrick: This already exists, I think. Otherwise a great idea.
+ Chip: I like this as an option if we can make it different or better than other ones.

----------UW course Evaluation-----------
+ Jessalyn: My friend did something like this for info320 and went under fire. It's totally doable though, since everything is public (Despite the privacy issues lulz). How exactly would we order by best prof or what not. Some of the results can be unreliable.
+ Chip: What type of technology are you thinking we'd use for the vis? With the ones I know it would be pretty tough to get this done in a few weeks.
+ Patrick: Download everything with script, store in text file or db, then create visualizations. Similar to your idea.
+ Jessalyn: Patrick got dis! Shall we do this one?
+ Chip: I'd be on board with this one. I was talking about the actual visualization part though. I've worked with d3.js and canvas(a while ago) but it's a lot of work to make visualizations in my experience.
