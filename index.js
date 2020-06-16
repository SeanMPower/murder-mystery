// Readline interface setup /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

const readline = require("readline");
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

// Setting up character, room and item classes and player object ////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

let player = {
  inventory: ["A Magnifying Glass"],
  name: "",
  location: [],
  hasSpokenTo: [],
  hasMoved: false,
};

let characterFactory = (name, location) => {
  return { name, location };
};

let green = characterFactory("Mr. Green", "The Kitchen");

let mustard = characterFactory("Colonel Mustard", "The Lounge");

let scarlet = characterFactory("Miss Scarlet", "The Dining Room");

let peacock = characterFactory("Mrs. Peacock", "The Lounge");

let plum = characterFactory("Professor Plum", "The Library");

let body = characterFactory("Mr. Body", "The Kitchen");

let white = characterFactory("Mrs. White", "The Study");

let cook = characterFactory("The Cook", "The Kitchen");

let roomFactory = (name, desc, ...args) => {
  inventory = args;
  return { name, desc, inventory };
};

let kitchen = roomFactory(
  "The Kitchen",
  "\nYou see a beautiful kitchen with many appliances including a nice stove. You can see that the kitchen connects to the Dining Room, the Conservatory, the Library and the Study.",
  "Frying Pan",
  "Body",
  "Stove"
);

let study = roomFactory(
  "The Study",
  "\nYou see a beautiful mahogany-lined room with a couch upon which Mr. Green and Mrs. White currently sit. You can see that the Study is connected to the Kitchen, the Billiard room and the Library.",
  "A desk",
  "A couch",
  "A chair"
);

let diningRoom = roomFactory(
  "The Dining Room",
  "\nYou see a large Dining Room with a table and chairs, two of which contain Miss Scarlet and the cook. You can see that the Dining room is connected to the Kitchen, the Billiard room and the Lounge.",
  "Dining Table",
  "An empty chair"
);

let billiardRoom = roomFactory(
  "The Billiard Room",
  "\nYou see a rich mahogany room with a billiard table at the center. You can see that the Billiard room is connected to the Dining room and the Study.",
  "Billiard Table",
  "Billiard Balls",
  "Pool Cue"
);

let lounge = roomFactory(
  "The Lounge",
  "\nYou see a beautifully decorated room with a bar cart, a chair and a couch upon which Colonel Mustard and Mrs. Peacock sit. You can see that the Lounge is connected to the Conservatory and the Dining room.",
  "A couch",
  "A chair",
  "Bar cart"
);

let conservatory = roomFactory(
  "The Conservatory",
  "\nYou see a beautiful conservatory filled with lots of plants and flowers. There is an orange tree, a bamboo palm and a spider plant. There is also a large cabinet in the far corner. You can see that the Conservatory is connected to the Lounge and the Ballroom.",
  "Orange tree",
  "Bamboo palm",
  "Spider plant",
  "A large cabinet"
);

let ballroom = roomFactory(
  "The Ballroom",
  "\nYou see an expansive ballroom with a parquet floor and a large chandelier hanging in the center. You can see that the Ballroom is connected to the Conservatory and the Library.",
  "Chandelier",
  "Table",
  "Column"
);

let library = roomFactory(
  "The Library",
  "\nYou see a large library with many books on the shelf. The room is dark, save for the light from the crackling fireplace. Nothing much else of interests it seems. You can see that the Library is connected to the Ballroom and the Study.",
  "A bookshelf",
  "A fireplace",
  "A sofa"
);

// Item constructor ///////////////////////////////////////////////////////////////////////////////

class Item {
  constructor(name, description, takeable, action) {
    this.name = name;
    this.desc = description;
    this.takeable = takeable;
    this.action = action;
  }
}

// Player initial inventory ////////////////////////////////////////////////////////////////////////

let magnifyingGlass = new Item(
  "A Magnifying Glass",
  "\nAn ordinary magnifying glass used to look closer.",
  true,
  ""
);

// Kitchen inventory ///////////////////////////////////////////////////////////////////////////////

let fryingPan = new Item(
  "Frying Pan",
  "\nAn ordinary frying pan. Maybe you could cook up some eggs with it.",
  true,
  ""
);

let deadBody = new Item(
  "Body",
  "\nThe body of Mr. Body lies on his back, lifeless on the kitchen floor. A pool of blood surrounds his head.",
  false,
  () => {
    console.log(
      `\nYou roll over the body to find a notebook partially sticking out of Mr. Body's back pocket...`
    );
    player.hasMoved = true;
    kitchen.inventory.push("Notebook");
  }
);

let stove = new Item(
  "A Stove",
  "\nA nice gas range used for cooking.",
  false,
  () => {
    if (
      player.location === "The Kitchen" &&
      player.inventory.includes("Frying Pan")
    ) {
      console.log(
        "\nYou fry up some delicious eggs. Now back to the matter at hand!"
      );
    } else {
      console.log("\nYou do not have the required item to use this.");
    }
  }
);

let notebook = new Item(
  "A notebook",
  `\nYou open Mr. Body's notebook to find a list of various artworks that have gone missing from around the world in recent years, along with the words "Mr. Green" circled in bold! It appears as though Mr. Body was in the middle of writing an exposé that fingered Mr. Green as the prime suspect in all these missing artwork cases! I wonder if this is a clue...`,
  true,
  ""
);

// Study inventory /////////////////////////////////////////////////////////////////////////////////

let studyDesk = new Item(
  "A Desk",
  "\nA sturdy wooden desk, worn from years of use. Perfect for studying!",
  false,
  () => {
    console.log(
      "\nGrabbing a book on phytology, you sit at the desk and study up on the magical wonders of photosynthesis. 10 minutes later you know everything there is to know about plants. Back to investigating!"
    );
  }
);

let studyCouch = new Item(
  "A couch",
  "\nA nice Victorian-style couch upon which Mr. Green and Mrs. White currently sit.",
  false,
  () => {
    console.log(
      '\nWithout warning, you turn around and, interrupting their conversation, attempt to squeeze in with Mr. Green and Mrs. White on what is clearly a two-person couch. Following some initial grunts of suprise and discomfort, the room falls into an awkward silence. A moment passes and Mrs. White can bear it no longer, prompting her to comment that "perhaps the couch is not quite long enough to fit three people". Embarassed, you offer a quick apology and remove yourself from the couch. Your acquiantances eye you with a mix of confusion and suspicion before returning to their conversation.'
    );
  }
);

let studyChair = new Item(
  "A chair",
  "\nA cushy Victorian-style chair. Perhaps you could have a sit.",
  false,
  () => {
    console.log(
      "\nSitting down in the chair, you soon realize that despite it's Victorian flourishes, it is quite uncomfortable. Furthermore, Mr. Green and Mrs. White are clearly growing uncomfortable that you are just sitting there observing them from across the room. Best to get back to the mission."
    );
  }
);

// Dining Room inventory ///////////////////////////////////////////////////////////////////////////

let diningTable = new Item(
  "Dining Table",
  "\nA beautiful banquet dining table that seats 14.",
  false,
  () => {
    console.log(
      "\n'What a grand table' you murmer as you walk alongside it, running your hand across the exquisitely embroidered tablecloth that runs it's length. 'Ahem.' the cook grumbles. 'I believe you were brought here to solve a murder, not to marvel at the scenery.' You pause, raising an eyebrow. This cook really seems to be in a mood... perhaps it would be good to talk to him."
    );
  }
);

let diningChair = new Item(
  "Dining chair",
  "\nAn empty dining chair next to Miss Scarlet and the cook. Perhaps you could have a sit.",
  false,
  () => {
    console.log(
      "\nSitting down into the dining chair, you imagine a feast commencing before your eyes. What spectacular meals must have graced this banquet table? What intoxicating smells perfumed this dining room air? Visions of roasted duck and crusted country pasties consume you. Oatcake with honeycomb and flowers, tender freshwater shrimp garnished with cream and rose leaves, hazlenut bread and devilled barley pearls in acorn puree... oh, the ecstacy! OH THE ECSTA- 'What in the world are you going on about?!' Screams the cook, looking quite annoyed. You realize that at some point during your daydream you began speaking out loud. Yikes. Best leave this siren of a dining chair and get back to work..."
    );
  }
);

// Lounge inventory ////////////////////////////////////////////////////////////////////////////////

let loungeChaise = new Item(
  "Chaise lounge",
  "\nAn elegant left arm chaise lounge",
  false,
  () => {
    console.log(
      "\nLeaning back into the lounge, your mind begins to drift as eyes examine the painted ceiling of the room. It depicts a lovely scene of clouds and angels, floating along a dreamy backdrop baby blue swirls. You can almost make out little stars twinkling in the distance, suggesting even greater depth to the sky above. What secrets lie beyond the lofty heights? What mysteries live cloaked among the clouds? Hmmmm, but an even greater mystery remains waiting to be solved right here on the ground, and daylight is burning. Carpe diem!"
    );
  }
);

let loungeChair = new Item(
  "Lounge chair",
  "\nA chair. In a lounge.",
  false,
  () => {
    console.log(
      "\nYou take a seat in the chair. To your dismay, you find it to be quite uncomfortable. That chaise lounge across the room, however... that looks quite nice..."
    );
  }
);

let loungeBarCart = new Item("Bar cart", "A 3-tier bar cart", false, () => {
  console.log(
    "\nWell well well! A cart filled with nothing but the finest spirits, beers, and wines! What shall you have? A little hot toddy to take the edge off? A negroni, pour vous? You are tempted, very tempted... but with options this tasty you risk compormising your focus. You must remain sharp! Who knows when the next clue will arise? And besides, there IS still a murderer in the house with a strong motive to see you dead... yes, best keep your wits about you. Maybe you'll return to the cart AFTER this is finished."
  );
});

// Conservatory inventory //////////////////////////////////////////////////////////////////////////

let orangeTree = new Item("Orange tree", "An orange tree", false, () => {
  console.log(
    "\nLooking both ways to make sure you aren't being watched, you determine you are alone. You pluck an orange, and damn - this is one seriously fresh orange! Minutes later, and you've finished the whole thing. But where to discard the peel? As you look around for a waste bin you notice something shiny. It appears to be a key."
  );
  conservatory.inventory.push("Key");
});

let bambooPalm = new Item("Bamboo palm", "A bamboo palm", false, () => {
  console.log("\nJust a bamboo palm. Nice.");
});

let spiderPlant = new Item("Spider plant", "A spider plant", false, () => {
  console.log(
    "\nAh, the humble spider plant: known to purify air more effectively than any other household plant. Nothing particularly distinct about this one, though."
  );
});

let cabinet = new Item(
  "A large cabinet",
  "A large cabinet, it appears to be locked.",
  false,
  () => {
    console.log(
      `\nYou see a rather large cabinet. One might call it an armoire. It appears to be locked. Perhaps there is a key nearby?`
    );
  }
);

// Ballroom inventory ////////////////////////////////////////////////////////////////////////////

let chandelier = new Item("Chandelier", "A chandelier", false, () => {
  console.log(
    "\nWhat is my perfect crime? I break into Tiffany's at midnight. Do I go for the vault? No, I go for the chandelier. It's priceless. As I'm taking it down, a woman catches me. She tells me to stop. It's her father's business. She's Tiffany. I say no. We make love all night. In the morning, the cops come and I escape in one of their uniforms. I tell her to meet me in Mexico, but I go to Canada. I don't trust her. Besides, I like the cold. Thirty years later, I get a postcard. I have a son and he's the chief of police. This is where the story gets interesting. I tell Tiffany to meet me in Paris by the Trocadero. She's been waiting for me all these years. She's never taken another lover. I don't care. I don't show up. I go to Berlin. That's where I stashed the chandelier."
  );
});

let ballroomTable = new Item(
  "Ballroom table",
  "A ballroom table",
  false,
  () => {
    console.log(
      "\nJust a round table for holding drinks. Not much to see here. And who sits down at a ball anyway?"
    );
  }
);

let column = new Item("Column", "A column", false, () => {
  console.log(
    "\nA stately column. Magnifique! But not much to do with it other than stare, and I dunno, maybe wax poetic about ancient Greece?"
  );
});

// Library inventory /////////////////////////////////////////////////////////////////////////////

let libBookshelf = new Item("Bookshelf", "A bookshelf", false, () => {
  console.log(
    "\nA large and ancient bookshelf looms before you, filled with numerous volumes of books, games, and little treasures. You pick the first book that catches your eye, and... what.. no way! A signed copy of The Return of the King?! For a moment, you consider tucking this away for your personal collection... but, sigh- if someone sees you might lose your investigator's license. Ah well, you can dream. Seriously though, how did Mr. Green acquire that...?"
  );
});

let libFireplace = new Item("Fireplace", "A fireplace", false, () => {
  console.log(
    "\nYou gaze at the warm, crackling fireplace. Who knows who's been feeding the fire, but it's orange glow illuminates the book case and casts all sorts of furtive shadows across an otherwise dark room (no windows, poor design, really). Picking up a piece of wood, you add it the pile, causing the flame to briefly grow a little higher. A glimpse of hope in the dark. "
  );
});

let libSofa = new Item("Sofa", "A sofa", false, () => {
  console.log(
    "\nAha! A clubby, tufted leather Chesterfield. Though well worn from ages of use, it's a handsome sofa that strikes a bold silhouette and commands respect. Situated across from the fire, it would be a lovely place to read or take a nap... *you sit down and gaze longingly into the fire for a moment* *10 minutes pass* Hmmmm, you could easily got lost in a trance here... best to move on!"
  );
});

// Billiard Room inventory ////////////////////////////////////////////////////////////////////////

let billiardTable = new Item(
  "Billiard Table",
  "A billiard table.",
  false,
  () => {
    console.log(
      `\nYou set your eyes upon a luxuriously built billiard table with what appear to be beautifully hand-crafted leather pockets.`
    );
  }
);

let billiardBalls = new Item(
  "Billiard Balls",
  "A set of beautiful billiard balls.",
  false,
  () => {
    console.log(
      `\nYou look upon the table to find billiard balls scattered across the table as if a game in progress had been abandoned. As you count up the balls you notice that one is missing...`
    );
  }
);

let poolCue = new Item(
  "A billiard cue",
  "A nice, but unremarkable pool cue.",
  false,
  () => {
    console.log(`\nA nice, but unremarkable pool cue.`);
  }
);

// Room entry messages ////////////////////////////////////////////////////////////////////////////

const studyMessage = "\nYou have entered the Study.";

const billiardMessage = "\nYou have entered the Billiard Room.";

const conservatoryMessage = "\nYou have entered the Conservatory.";

const diningMessage = "\nYou have enetered the Dining Room.";

const libraryMessage = "\nYou have entered the Library.";

const kitchenMessage = "\nYou have entered the Kitchen.";

const ballroomMessage = "\nYou have enetered the Ballroom.";

const loungeMessage = "\nYou have entered the Lounge.";

// Dialog assignments ////////////////////////////////////////////////////////////////////////////

green.dialogueOne = `\n"We were all enjoying some good after dinner conversation when the power in the house went out and then the lights came back on we heard a scream from the kitchen. When we all rushed in we discovered Mr. Body dead on the floor. Miss Scarlet was the first one to discover the body. She's pretty broken up about it. My cook is currently in the dining room with her consoling her. Maybe you should go speak to her."`;

scarlet.dialogueOne = `\nShe lifts her head up from the table, still sobbing, to meet your eyes. Through a stream of tears she explains to you that when the lights went out she heard a thud in the kitchen and when the lights came back on she went to the kitchen to see what the commotion was about only to discover Mr. Body lying dead on the floor in a pool of his own blood. Perhaps Colonel Mustard or Mrs. Peacock have more to tell you. They can be found in the lounge.`;

cook.dialogueOne = `\n"Hello, inspector. What a horrible thing that has happened." You notice what appears to be a few drops of blood on his apron. Curious.`;

mustard.dialogueOne = `\nHello, inspector. I trust the investigation is going well? I was just in this lounge enjoying a after dinner cocktail with Mrs. Peacock here when the lights suddenly went out, isn't that right? When the came back on we heard a god-awful scream from the kitchen and rushed in to find Mr. Body on the floor.`;

peacock.dialogueOne = `\nWhat an absolutely dreadful night it has turned out to be. It was such a lovely evening up until the murder. Mr. Body, that poor soul. I never could quite get a read on him. He seemed to be pre-occupied looking around the house. I suspect he was an admirer of art. He seemed to be closely inspecting Mr. Green's artwork. Professor Plum may be able to give you more about the deceased. I saw the two of them speaking earlier in the evening. He is in the library.`;

plum.dialogueOne = `\nAh, inspector! I've been meaning to speak to you. Quite horrible, the recent events, quite horrible indeed! I've been collecting my thoughts here and trying to regain some sense of composure. The books, they always calm me down! And well, as I've been turning the last few hours over in my head, it did occur to me that I have borne witness to something that may be of interest to you. You see, earlier in the evening I was relaxing in a nook of the library, my attention captured completely by a lovely collection of English Romantic poetry. I must have been decently obscured from my position in the nook, because at one point Mr. Green and Mr. Body passed through and did not notice that I was here! They were in the midst of a dispute, and though they spoke in hushed voices I could tell from their tones that something was wrong. I could not clearly make out much of what they were saying, but I believe the argument had something to do with art. Eventually the conversation came to a close and Mr. Green left the room, after which Mr. Body pull out a notebook from his back pocket and begin writing in it furiously. Oh, I'm so embarrassed for spying, but I worried that it would stir up trouble if I revealed my presence. I certainly did not want to involve myself in whatever they were arguing about, either.\nIn any event, I suspect that the notebook Mr. Body was writing in may hold some clues as to the nature of their conversation, so it may be worth your while to see if you can find it. That's all the information I have for you, though I wish I could be of greater help!`;

green.dialogueTwo = `\nHello again, inspector. I hope the investigation is coming along. A real shame what has happened to our friend Mr. Body. It seems like only hours ago we were enjoying a game of snooker in the Billiard Room.`;

white.dialogueOne = `\nInspector, please tell me you'll get to the bottom of all this. My anxiety is at an all-time high knowing we have a killer in our midst! I never did get to speak to Mr. Body at all tonight and it's a shame! He seemed like such an insightful fellow. Mr. Green was just telling me all about how interested Mr. Body was in his artwork. I've never much had an eye for art myself, but I surely have enjoyed walking around his Conservatory and looking at Mr. Green's wonderful plants! I highly suggest you check them out!\n\n*Mr. Green's eyes dart to Mrs. White nervously...*`;

// Beginning of function declarations ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
function takeItem(room, item) {
  if (room.inventory.includes(item)) {
    let takenItem = room.inventory.splice(room.inventory.indexOf(item), 1)
    player.inventory.push(item);
    console.log(`\nYou have picked up a ${item}`)
  } else {
    console.log("The room does not currently have this item");
  }
}

function dropItem(room, item) {
  if (player.inventory.includes(item)) {
    player.inventory = player.inventory.indexOf(item).splice;
    room.inventory.push(item);
    return console.log(`\nYou have dropped ${item}`)
  } else {
    return console.log("You are not currently carrying this item")
  }
}

async function start() {
  const welcomeMessage = `\nWelcome to our Murder Mystery! You are an inspector tasked with solving a murder that occured at a dinner party. The actions you may need to take are: (examine 'item') to look at item, there might be something you have to (move 'item') to reveal a new item, (speak to 'character name') to engage with a character, (take 'item') to take posession of an item, (drop 'item') to drop an item, (use 'item') to use an item, (go to 'room name') to move around the map, (i)nventory and (solve murder) when you have all the evidence you need! If you would like an overview of the room you are in, use the (look around) command and it will give you the room's description and a list of its contents.`;

  console.log(welcomeMessage);
  let getName = await ask(`\nWhat is your name, Inspector? >_`);
  player.name = getName;

  console.log(`\nIt is a dreary Friday evening in November. You're catching up on some paperwork when the phone rings...\n\n"Good evening, Inspector ${player.name}. My name is Mr. Green and I'm afraid I am in need of your services. I've been hosting a dinner party tonight and one of my guests has been murdered. All of the guests are still here and we've vowed that nobody leaves until we find the killer.\n`);

  theTask();

  async function theTask() {
    let initialize = await ask(
      `\nCan you help us?" (y/n) >_`
    );
    if (initialize === "n") {
      process.exit();
    } else if (initialize === "y") {
      player.location = "The Kitchen";
      const arrivalMessage = `\nYou arrive in the kitchen of Mr. Green's mansion to find the body of Mr. Body. Mr. Green looks at your expectantly.`;
      console.log(arrivalMessage);
      playKitchen();
    } else {
      console.log(`Sorry, I don\'t understand your response. Let\'s try again.`);
      theTask();
    }
  }
}

async function playKitchen() {
  let input = await ask("\n>_ ");
  let inputArr = input.toLowerCase().split(" ");

  if (inputArr.includes("examine") && inputArr.includes("body")) {
    console.log(body.desc);
    playKitchen();
  } else if (inputArr.includes("i")) {
    console.log("\nYou are currently in possesion of: " + player.inventory);
    playKitchen();
  } else if (inputArr.includes("move") && inputArr.includes("body")) {
    deadBody.action();
    console.log(body.extraDesc);
    playKitchen();
  } else if (inputArr.includes("speak") && inputArr.includes("green")) {
    console.log(green.dialogueOne);

    if (!player.hasSpokenTo.includes("green")) {
      player.hasSpokenTo.push("green");
    }
    playKitchen();
  } else if (inputArr.includes("take") && inputArr.includes("pan")) {
    takeItem(kitchen,"Frying Pan");
    playKitchen();
  } else if (inputArr.includes("take") && inputArr.includes("notebook")) {
    if (player.hasMoved === true) {
      takeItem(kitchen, "Notebook");
    } else {
      console.log("\nThere is no notebook to be seen.");
    }
    playKitchen();
  } else if (inputArr.includes("examine") && inputArr.includes("notebook")) {
    if (player.inventory.includes("Notebook")) {
      console.log(notebook.desc);
      playKitchen();
    } else {
      console.log("\nYou are not in possesion of a notebook.");
      playKitchen();
    }
  } else if (inputArr.includes("take") && inputArr.includes("key")) {
    takeItem(kitchen, "Key");
    playKitchen();
  } else if (inputArr.includes("use") && inputArr.includes("stove")) {
    stove.action();
    playKitchen();
  } else if (inputArr.includes("drop") && inputArr.includes("pan")) {
    dropItem(kitchen, "Frying Pan");
    playKitchen();
  } else if (inputArr.includes("drop") && inputArr.includes("notebook")) {
    dropItem(kitchen, "Notebook");
    playKitchen();
  } else if (inputArr.includes("drop") && inputArr.includes("key")) {
    dropItem(kitchen, "Key");
    playKitchen();
  } else if (inputArr.includes("go") && inputArr.includes("dining")) {
    player.location = "The Dining Room";
    console.log(diningMessage);
    playDining();
  } else if (inputArr.includes("go") && inputArr.includes("conservatory")) {
    player.location = "The Conservatory";
    console.log(conservatoryMessage);
    playConservatory();
  } else if (inputArr.includes("go") && inputArr.includes("library")) {
    player.location = "The Library";
    console.log(libraryMessage);
    playLibrary();
  } else if (inputArr.includes("go") && inputArr.includes("study")) {
    player.location = "The Study";
    console.log(studyMessage);
    playStudy();
  } else if (inputArr.includes("go") && inputArr.includes("lounge")) {
    player.location = "The Lounge";
    console.log(loungeMessage);
    playLounge();
  } else if (inputArr.includes("go") && inputArr.includes("billiard")) {
    player.location = "The Billiard Room";
    console.log(billiardMessage);
    playBilliardRoom();
  } else if (inputArr.includes("go") && inputArr.includes("ballroom")) {
    player.location = "The Ballroom";
    console.log(ballroomMessage);
    playBallroom();
  } else if (inputArr.includes("look") && inputArr.includes("around")) {
    console.log(kitchen.desc + "\n\nItems include: " + kitchen.inventory);
    playKitchen();
  } else {
    console.log(
      `\nI don't understand what you want and/or you can't do that in this room...`
    );
    playKitchen();
  }
}

async function playDining() {
  let input = await ask("\n>_ ");
  let inputArr = input.toLowerCase().split(" ");

  if (inputArr.includes("speak") && inputArr.includes("cook")) {
    console.log(cook.dialogueOne);
    if (!player.hasSpokenTo.includes("cook")) {
      player.hasSpokenTo.push("cook");
    }
    playDining();
  } else if (inputArr.includes("speak") && inputArr.includes("scarlet")) {
    console.log(scarlet.dialogueOne);
    if (!player.hasSpokenTo.includes("scarlet")) {
      player.hasSpokenTo.push("scarlet");
    }
    playDining();
  } else if (inputArr.includes("i")) {
    console.log("\nYou are currently in possesion of: " + player.inventory);
    playDining();
  } else if (inputArr.includes("look") && inputArr.includes("around")) {
    console.log(diningRoom.desc + "\n\nItems include: " + diningRoom.inventory);
    playDining();
  } else if (inputArr.includes("examine") && inputArr.includes("chair")) {
    console.log(diningChair.action());
    playDining();
  } else if (inputArr.includes("examine") && inputArr.includes("table")) {
    console.log(diningTable.action());
    playDining();
  } else if (inputArr.includes("sit") && inputArr.includes("chair")) {
    diningChair.action();
    playDining();
  } else if (inputArr.includes("take") && inputArr.includes("pan")) {
    takeItem(diningRoom, "Frying Pan");
    playDining();
  } else if (inputArr.includes("take") && inputArr.includes("notebook")) {
    takeItem(diningRoom, "Notebook");
    playDining();
  } else if (inputArr.includes("take") && inputArr.includes("key")) {
    takeItem(diningRoom, "Key");
    playDining();
  } else if (inputArr.includes("drop") && inputArr.includes("pan")) {
    dropItem(diningRoom, "Frying Pan");
    playDining();
  } else if (inputArr.includes("drop") && inputArr.includes("notebook")) {
    dropItem(diningRoom, "Notebook");
    playDining();
  } else if (inputArr.includes("drop") && inputArr.includes("key")) {
    dropItem(diningRoom, "Key");
    playDining();
  } else if (inputArr.includes("go") && inputArr.includes("kitchen")) {
    player.location = "The Kitchen";
    console.log(kitchenMessage);
    playKitchen();
  } else if (inputArr.includes("go") && inputArr.includes("conservatory")) {
    player.location = "The Conservatory";
    console.log(conservatoryMessage);
    playConservatory();
  } else if (inputArr.includes("go") && inputArr.includes("library")) {
    player.location = "The Library";
    console.log(libraryMessage);
    playLibrary();
  } else if (inputArr.includes("go") && inputArr.includes("study")) {
    player.location = "The Study";
    console.log(studyMessage);
    playStudy();
  } else if (inputArr.includes("go") && inputArr.includes("billiard")) {
    player.location = "The Billiard Room";
    console.log(billiardMessage);
    playBilliardRoom();
  } else if (inputArr.includes("go") && inputArr.includes("lounge")) {
    player.location = "The Lounge";
    console.log(loungeMessage);
    playLounge();
  } else {
    console.log(
      `\nI don't understand what you want and/or you can't do that in this room...`
    );
    playDining();
  }
}

async function playLounge() {
  let input = await ask("\n>_ ");
  let inputArr = input.toLowerCase().split(" ");

  if (inputArr.includes("speak") && inputArr.includes("mustard")) {
    console.log(mustard.dialogueOne);
    if (!player.hasSpokenTo.includes("mustard")) {
      player.hasSpokenTo.push("mustard");
    }
    playLounge();
  } else if (inputArr.includes("speak") && inputArr.includes("peacock")) {
    console.log(peacock.dialogueOne);
    if (!player.hasSpokenTo.includes("peacock")) {
      player.hasSpokenTo.push("peacock");
    }
    playLounge();
  } else if (inputArr.includes("i")) {
    console.log("\nYou are currently in possesion of: " + player.inventory);
    playLounge();
  } else if (inputArr.includes("sit") && inputArr.includes("couch")) {
    console.log(loungeChaise.action());
    playLounge();
  } else if (inputArr.includes("use") && inputArr.includes("bar")) {
    console.log(loungeBarCart.action());
    playLounge();
  } else if (inputArr.includes("sit") && inputArr.includes("chair")) {
    console.log(loungeChair.action());
    playLounge();
  } else if (inputArr.includes("look") && inputArr.includes("around")) {
    console.log(lounge.desc + "\n\nItems include: " + lounge.inventory);
    playLounge();
  } else if (inputArr.includes("go") && inputArr.includes("kitchen")) {
    player.location = "The Kitchen";
    console.log(kitchenMessage);
    playKitchen();
  } else if (inputArr.includes("go") && inputArr.includes("conservatory")) {
    player.location = "The Conservatory";
    console.log(conservatoryMessage);
    playConservatory();
  } else if (inputArr.includes("take") && inputArr.includes("pan")) {
    takeItem(lounge, "Frying Pan");
    playLounge();
  } else if (inputArr.includes("take") && inputArr.includes("notebook")) {
    takeItem(lounge, "Notebook");
    playLounge();
  } else if (inputArr.includes("take") && inputArr.includes("key")) {
    takeItem(lounge, "Key");
    playLounge();
  } else if (inputArr.includes("drop") && inputArr.includes("pan")) {
    dropItem(lounge, "Frying Pan");
    playLounge();
  } else if (inputArr.includes("drop") && inputArr.includes("notebook")) {
    dropItem(lounge, "Notebook");
    playLounge();
  } else if (inputArr.includes("drop") && inputArr.includes("key")) {
    dropItem(lounge, "Key");
    playLounge();
  } else if (inputArr.includes("go") && inputArr.includes("library")) {
    player.location = "The Library";
    console.log(libraryMessage);
    playLibrary();
  } else if (inputArr.includes("go") && inputArr.includes("study")) {
    player.location = "The Study";
    console.log(studyMessage);
    playStudy();
  } else if (inputArr.includes("go") && inputArr.includes("billiard")) {
    player.location = "The Billiard Room";
    console.log(billiardMessage);
    playBilliardRoom();
  } else if (inputArr.includes("go") && inputArr.includes("dining")) {
    player.location = "The Dining Room";
    console.log(diningMessage);
    playDining();
  } else {
    console.log(
      `\nI don't understand what you want and/or you can't do that in this room...`
    );
    playLounge();
  }
}

async function playConservatory() {
  let input = await ask("\n>_ ");
  let inputArr = input.toLowerCase().split(" ");

  if (inputArr.includes("use") && inputArr.includes("key")) {
    if (player.inventory.includes("Key")) {
      console.log(
        "\nYou open the cabinet to reveal a collection of stolen artwork and a billiard ball covered in blood. You pick up the billiard ball. You now have the evidence you need to solve the murder."
      );
      player.inventory.push("A bloody billiard ball");
      playConservatory();
    } else {
      console.log("\nYou do not have a key! Maybe it is hidden nearby.");
      playConservatory();
    }
  } else if (inputArr.includes("solve") && inputArr.includes("murder")) {
    if (player.inventory.includes("A bloody billiard ball")) {
      console.log(
        `\nYou gather everyone in the Conservatory to make your final statement. "I conclude that Mr. Green is the murderer, by way of the cook! Mr. Green took a billiard ball from the billiard room and ordered the cook to murder Mr. Body with it because Mr. Body was an investigative journalist working on a story that threatened to expose the fact that Mr. Green is a collector of priceless stolen artwork!\n"`
      );
      process.exit();
    } else {
      console.log("You lack a piece of evidence to solve the murder!");
      playConservatory();
    }
  } else if (inputArr.includes("i")) {
    console.log("\nYou are currently in possesion of: " + player.inventory);
    playConservatory();
  } else if (inputArr.includes("examine") && inputArr.includes("spider")) {
    console.log(spiderPlant.action());
    playConservatory();
  } else if (inputArr.includes("examine") && inputArr.includes("orange")) {
    console.log(orangeTree.action());
    playConservatory();
  } else if (inputArr.includes("examine") && inputArr.includes("palm")) {
    console.log(bambooPalm.action());
    playConservatory();
  } else if (inputArr.includes("examine") && inputArr.includes("cabinet")) {
    console.log(cabinet.action());
    playConservatory();
  } else if (inputArr.includes("look") && inputArr.includes("around")) {
    console.log(
      conservatory.desc + "\n\nItems include: " + conservatory.inventory
    );
    playConservatory();
  } else if (inputArr.includes("take") && inputArr.includes("pan")) {
    takeItem(conservatory, "Frying Pan");
    playConservatory();
  } else if (inputArr.includes("take") && inputArr.includes("notebook")) {
    takeItem(conservatory, "Notebook");
    playConservatory();
  } else if (inputArr.includes("take") && inputArr.includes("key")) {
    takeItem(conservatory, "Key");
    playConservatory();
  } else if (inputArr.includes("drop") && inputArr.includes("pan")) {
    dropItem(conservatory, "Frying Pan");
    playConservatory();
  } else if (inputArr.includes("drop") && inputArr.includes("notebook")) {
    dropItem(conservatory, "Notebook");
    playConservatory();
  } else if (inputArr.includes("drop") && inputArr.includes("key")) {
    dropItem(conservatory, "Key");
    playConservatory();
  } else if (inputArr.includes("go") && inputArr.includes("kitchen")) {
    player.location = "The Kitchen";
    console.log(kitchenMessage);
    playKitchen();
  } else if (inputArr.includes("go") && inputArr.includes("dining")) {
    player.location = "The Dining Room";
    console.log(diningMessage);
    playDining();
  } else if (inputArr.includes("go") && inputArr.includes("library")) {
    player.location = "The Library";
    console.log(libraryMessage);
    playLibrary();
  } else if (inputArr.includes("go") && inputArr.includes("study")) {
    player.location = "The Study";
    console.log(studyMessage);
    playStudy();
  } else if (inputArr.includes("go") && inputArr.includes("billiard")) {
    player.location = "The Billiard Room";
    console.log(billiardMessage);
    playBilliardRoom();
  } else if (inputArr.includes("go") && inputArr.includes("lounge")) {
    player.location = "The Lounge";
    console.log(loungeMessage);
    playLounge();
  } else {
    console.log(
      `\nI don't understand what you want and/or you can't do that in this room...`
    );
    playConservatory();
  }
}

async function playBallroom() {
  let input = await ask("\n>_ ");
  let inputArr = input.toLowerCase().split(" ");

  if (inputArr.includes("i")) {
    console.log("\nYou are currently in possesion of: " + player.inventory);
    playBallroom();
  } else if (inputArr.includes("look") && inputArr.includes("around")) {
    console.log(ballroom.desc + "\n\nItems include: " + ballroom.inventory);
    playBallroom();
  } else if (inputArr.includes("examine") && inputArr.includes("table")) {
    console.log(ballroomTable.action());
    playBallroom();
  } else if (inputArr.includes("examine") && inputArr.includes("chandelier")) {
    console.log(chandelier.action());
    playBallroom();
  } else if (inputArr.includes("examine") && inputArr.includes("column")) {
    console.log(column.action());
    playBallroom();
  } else if (inputArr.includes("go") && inputArr.includes("kitchen")) {
    player.location = "The Kitchen";
    console.log(kitchenMessage);
    playKitchen();
  } else if (inputArr.includes("go") && inputArr.includes("dining")) {
    player.location = "The Dining Room";
    console.log(diningMessage);
    playDining();
  } else if (inputArr.includes("go") && inputArr.includes("library")) {
    player.location = "The Library";
    console.log(libraryMessage);
    playLibrary();
  } else if (inputArr.includes("go") && inputArr.includes("study")) {
    player.location = "The Study";
    console.log(studyMessage);
    playStudy();
  } else if (inputArr.includes("go") && inputArr.includes("billiard")) {
    player.location = "The Billiard Room";
    console.log(billiardMessage);
    playBilliardRoom();
  } else if (inputArr.includes("go") && inputArr.includes("lounge")) {
    player.location = "The Lounge";
    console.log(loungeMessage);
    playLounge();
  } else if (inputArr.includes("go") && inputArr.includes("conservatory")) {
    player.location = "The Conservatory";
    console.log(conservatoryMessage);
    playConservatory();
  } else if (inputArr.includes("take") && inputArr.includes("pan")) {
    takeItem(ballroom, "Frying Pan");
    playBallroom();
  } else if (inputArr.includes("take") && inputArr.includes("notebook")) {
    takeItem(ballroom, "Notebook");
    playBallroom();
  } else if (inputArr.includes("take") && inputArr.includes("key")) {
    takeItem(ballroom, "Key");
    playBallroom();
  } else if (inputArr.includes("drop") && inputArr.includes("pan")) {
    dropItem(ballroom, "Frying Pan");
    playBallroom();
  } else if (inputArr.includes("drop") && inputArr.includes("notebook")) {
    dropItem(ballroom, "Notebook");
    playBallroom();
  } else if (inputArr.includes("drop") && inputArr.includes("key")) {
    dropItem(ballroom, "Key");
    playBallroom();
  } else {
    console.log(
      `\nI don't understand what you want and/or you can't do that in this room...`
    );
    playBallroom();
  }
}

async function playLibrary() {
  let input = await ask("\n>_ ");
  let inputArr = input.toLowerCase().split(" ");

  if (inputArr.includes("speak") && inputArr.includes("plum")) {
    console.log(plum.dialogueOne);
    if (!player.hasSpokenTo.includes("plum")) {
      player.hasSpokenTo.push("plum");
    }
    playLibrary();
  } else if (inputArr.includes("i")) {
    console.log("\nYou are currently in possesion of: " + player.inventory);
    playLibrary();
  } else if (inputArr.includes("look") && inputArr.includes("around")) {
    console.log(library.desc + "\n\nItems include: " + library.inventory);
    playLibrary();
  } else if (
    (inputArr.includes("examine") && inputArr.includes("bookshelf")) ||
    (inputArr.includes("examine") && inputArr.includes("book shelf"))
  ) {
    console.log(libBookshelf.desc);
    playLibrary();
  } else if (
    (inputArr.includes("examine") && inputArr.includes("fireplace")) ||
    (inputArr.includes("examine") && inputArr.includes("fire place"))
  ) {
    console.log(libFireplace.desc);
    playLibrary();
  } else if (inputArr.includes("examine") && inputArr.includes("sofa")) {
    console.log(libSofa.desc);
    playLibrary();
  } else if (
    (inputArr.includes("use") && inputArr.includes("bookshelf")) ||
    (inputArr.includes("examine") && inputArr.includes("book shelf"))
  ) {
    console.log(libBookshelf.action);
    playLibrary();
  } else if (
    (inputArr.includes("use") && inputArr.includes("fireplace")) ||
    (inputArr.includes("examine") && inputArr.includes("fire place"))
  ) {
    console.log(libFireplace.action);
    playLibrary();
  } else if (inputArr.includes("use") && inputArr.includes("sofa")) {
    console.log(libSofa.action);
    playLibrary();
  } else if (inputArr.includes("take") && inputArr.includes("pan")) {
    takeItem(library, "Frying Pan");
    playLibrary();
  } else if (inputArr.includes("take") && inputArr.includes("notebook")) {
    takeItem(library, "Notebook");
    playLibrary();
  } else if (inputArr.includes("take") && inputArr.includes("key")) {
    takeItem(library, "Key");
    playLibrary();
  } else if (inputArr.includes("drop") && inputArr.includes("pan")) {
    dropItem(library, "Frying Pan");
    playLibrary();
  } else if (inputArr.includes("drop") && inputArr.includes("notebook")) {
    dropItem(library, "Notebook");
    playLibrary();
  } else if (inputArr.includes("drop") && inputArr.includes("key")) {
    dropItem(library, "Key");
    playLibrary();
  } else if (inputArr.includes("go") && inputArr.includes("kitchen")) {
    player.location = "The Kitchen";
    console.log(kitchenMessage);
    playKitchen();
  } else if (inputArr.includes("go") && inputArr.includes("dining")) {
    player.location = "The Dining Room";
    console.log(diningMessage);
    playDining();
  } else if (inputArr.includes("go") && inputArr.includes("ballroom")) {
    player.location = "The Ballroom";
    console.log(ballroomMessage);
    playBallroom();
  } else if (inputArr.includes("go") && inputArr.includes("study")) {
    player.location = "The Study";
    console.log(studyMessage);
    playStudy();
  } else if (inputArr.includes("go") && inputArr.includes("billiard")) {
    player.location = "The Billiard Room";
    console.log(billiardMessage);
    playBilliardRoom();
  } else if (inputArr.includes("go") && inputArr.includes("lounge")) {
    player.location = "The Lounge";
    console.log(loungeMessage);
    playLounge();
  } else if (inputArr.includes("go") && inputArr.includes("conservatory")) {
    player.location = "The Conservatory";
    console.log(conservatoryMessage);
    playConservatory();
  } else {
    console.log(
      `\nI don't understand what you want and/or you can't do that in this room...`
    );
    playLibrary();
  }
}

async function playStudy() {
  let input = await ask("\n>_ ");
  let inputArr = input.toLowerCase().split(" ");

  if (inputArr.includes("speak") && inputArr.includes("green")) {
    console.log(green.dialogueTwo);
    playStudy();
  } else if (inputArr.includes("speak") && inputArr.includes("white")) {
    console.log(white.dialogueOne);
    playStudy();
  } else if (inputArr.includes("i")) {
    console.log("\nYou are currently in possesion of: " + player.inventory);
    playStudy();
  } else if (inputArr.includes("take") && inputArr.includes("pan")) {
    takeItem(study, "Frying Pan");
    playStudy();
  } else if (inputArr.includes("take") && inputArr.includes("notebook")) {
    takeItem(study, "Notebook");
    playStudy();
  } else if (inputArr.includes("take") && inputArr.includes("key")) {
    takeItem(study, "Key");
    playStudy();
  } else if (inputArr.includes("drop") && inputArr.includes("pan")) {
    dropItem(study, "Frying Pan");
    playStudy();
  } else if (inputArr.includes("drop") && inputArr.includes("notebook")) {
    dropItem(study, "Notebook");
    playStudy();
  } else if (inputArr.includes("drop") && inputArr.includes("key")) {
    dropItem(study, "Key");
    playStudy();
  } else if (inputArr.includes("examine") && inputArr.includes("desk")) {
    console.log(studyDesk.action);
    playStudy();
  } else if (inputArr.includes("examine") && inputArr.includes("couch")) {
    console.log(studyCouch.action);
    playStudy();
  } else if (inputArr.includes("examine") && inputArr.includes("chair")) {
    console.log(studyChair.action);
    playStudy();
  } else if (inputArr.includes("go") && inputArr.includes("kitchen")) {
    player.location = "The Kitchen";
    console.log(kitchenMessage);
    playKitchen();
  } else if (inputArr.includes("go") && inputArr.includes("dining")) {
    player.location = "The Dining Room";
    console.log(diningMessage);
    playDining();
  } else if (inputArr.includes("go") && inputArr.includes("library")) {
    player.location = "The Library";
    console.log(libraryMessage);
    playLibrary();
  } else if (inputArr.includes("go") && inputArr.includes("ballroom")) {
    player.location = "The Ballroom";
    console.log(ballroomMessage);
    playBallroom();
  } else if (inputArr.includes("go") && inputArr.includes("billiard")) {
    player.location = "The Billiard Room";
    console.log(billiardMessage);
    playBilliardRoom();
  } else if (inputArr.includes("go") && inputArr.includes("lounge")) {
    player.location = "The Lounge";
    console.log(loungeMessage);
    playLounge();
  } else if (inputArr.includes("go") && inputArr.includes("conservatory")) {
    player.location = "The Conservatory";
    console.log(conservatoryMessage);
    playConservatory();
  } else {
    console.log(
      `\nI don't understand what you want and/or you can't do that in this room...`
    );
    playStudy();
  }
}

async function playBilliardRoom() {
  let input = await ask("\n>_ ");
  let inputArr = input.toLowerCase().split(" ");

  if (inputArr.includes("i")) {
    console.log("\nYou are currently in possesion of: " + player.inventory);
    playBilliardRoom();
  } else if (inputArr.includes("look") && inputArr.includes("around")) {
    console.log(
      billiardRoom.desc + "\n\nItems include: " + billiardRoom.inventory
    );
    playBilliardRoom();
  } else if (inputArr.includes("examine") && inputArr.includes("balls")) {
    console.log(billiardBalls.action());
    playBilliardRoom();
  } else if (inputArr.includes("examine") && inputArr.includes("table")) {
    console.log(billiardTable.action());
    playBilliardRoom();
  } else if (inputArr.includes("examine") && inputArr.includes("cue")) {
    console.log(poolCue.action());
    playBilliardRoom();
  } else if (inputArr.includes("take") && inputArr.includes("pan")) {
    takeItem(billiardRoom, "Frying Pan");
    playBilliardRoom();
  } else if (inputArr.includes("take") && inputArr.includes("notebook")) {
    takeItem(billiardRoom, "Notebook");
    playBilliardRoom();
  } else if (inputArr.includes("take") && inputArr.includes("key")) {
    takeItem(billiardRoom, "Key");
    playBilliardRoom();
  } else if (inputArr.includes("drop") && inputArr.includes("pan")) {
    dropItem(billiardRoom, "Frying Pan");
    playBilliardRoom();
  } else if (inputArr.includes("drop") && inputArr.includes("notebook")) {
    dropItem(billiardRoom, "Notebook");
    playBilliardRoom();
  } else if (inputArr.includes("drop") && inputArr.includes("key")) {
    dropItem(billiardRoom, "Key");
    playBilliardRoom();
  } else if (inputArr.includes("go") && inputArr.includes("kitchen")) {
    player.location = "The Kitchen";
    console.log(kitchenMessage);
    playKitchen();
  } else if (inputArr.includes("go") && inputArr.includes("dining")) {
    player.location = "The Dining Room";
    console.log(diningMessage);
    playDining();
  } else if (inputArr.includes("go") && inputArr.includes("library")) {
    player.location = "The Library";
    console.log(libraryMessage);
    playLibrary();
  } else if (inputArr.includes("go") && inputArr.includes("study")) {
    player.location = "The Study";
    console.log(studyMessage);
    playStudy();
  } else if (inputArr.includes("go") && inputArr.includes("ballroom")) {
    player.location = "The Ballroom";
    console.log(ballroomMessage);
    playBallroom();
  } else if (inputArr.includes("go") && inputArr.includes("lounge")) {
    player.location = "The Lounge";
    console.log(loungeMessage);
    playLounge();
  } else if (inputArr.includes("go") && inputArr.includes("conservatory")) {
    player.location = "The Conservatory";
    console.log(conservatoryMessage);
    playConservatory();
  } else {
    console.log(
      `\nI don't understand what you want and/or you can't do that in this room...`
    );
    playBilliardRoom();
  }
}

// Launching game ////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

start();
