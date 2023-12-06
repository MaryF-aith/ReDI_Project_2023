
const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')

//With "let state" we keep track of what stash our character has collected throughout the game
let state = {}

//This function is here to start the game and is called at the end of the script. 
//It starts as soon as the page loads and shows the first Text Node
function startGame() {
  //at the beginning of the game the state -of course- is empty
  state = {}
  //and here we make the program show us the very first text node
  showTextNode(1)
}

//This function is for showing the current textNode that we are on
function showTextNode(textNodeIndex) {
  //This will find the current text node we are on
  const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
  //This is for displaying the current text inside the container
  textElement.innerText = textNode.text
  //This while loop removes all of the option buttons 
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
  }
  //Here we are now adding the options we need by looping over all these different options that we got.
  textNode.options.forEach(option => {
    //We are checking if we can show that node/option, because sometimes we will show 
    //options based on the state we have (or not).
    if (showOption(option)) {
      //to do so, we 
      const button = document.createElement('button')
      button.innerText = option.text
      button.classList.add('btn')
      //The Event Listener is listening to the input of the user, means it's listening to the click 
      //and responds accordingly. The function will be called down at the function selectOption, take a look down
      button.addEventListener('click', () => selectOption(option))
      //Now we append the buttons
      optionButtonsElement.appendChild(button)
    }
  })
}

//This function allows us to display which option we are on
function showOption(option) {
  return option.requiredState == null || option.requiredState(state)
}

//This funtion is showing us which option we selected, because we need to know what we have selected. 
function selectOption(option) {
  const nextTextNodeId = option.nextText
  //if our next test node is less or equal to zero, we wanna call restart the game
  if (nextTextNodeId <= 0) {
    return startGame()
  }
  state = Object.assign(state, option.setState)
  showTextNode(nextTextNodeId)
}

const textNodes = [
  {
    //This is the first text node, which is displayed at the beginning of the game
    id: 1,
    text: "It's a lazy Saturday evening. You wake up on the sofa. Your movie is still playing, but it's too loud. You see the remote control but it's out of reach...well, at least without moving.",
    //Here are the  options of what our character can do
    options: [
      {
        text: 'Take the remote control',
        //if our character takes the remote control, we have to set the state to true, 
        //because now our character has a remote control.
        //Taking the remote control will lead to more options than without the remote control
        setState: { remoteControl: true },
        nextText: 2
      },
      {
        text: 'Leave it and ignore the volume',
        //The next text node will be id 2. Different choices can have different options
        nextText: 2
      }
    ]
  },

  {
    id: 2,
    text: 'Suddenly your movie gets interrupted by some breaking news. You stare into the TV, trying to make sense out of the News. They are talking about people going crazy, biting and killing each other. Some disturbing pictures and clips are shown. You feel sick by looking at them.',
    options: [
      {
        text: 'Turn off the TV',
        //This option is only shown when we took the remote control earlier in the game, 
        //because of the current state. The required state checks if we have the remote control
        //we took the remote control, so the state is true
        //and we only can turn of the TV when we have the remote control
        requiredState: (currentState) => currentState.remoteControl,
        setState: { remoteControl: true },
        nextText: 3
      },
      {
        text: 'Keep watching',
        requiredState: (currentState) => currentState.remoteControl,
        setState: { remoteControl: true },
        nextText: 3
      },
      {
        text: 'Ignore the further news and go to the kitchen',
        //This option has no requiredState, we chose to not take the remote control. 
        //This means the other two options are not shown in the game. We only can press this one button.
        nextText: 3
      }
    ]
  },
  {
    id: 3,
    text: "You went into the kitchen to get yourself a drink, that's badly needed after watching that clips of humans slaying humans.",
    options: [
      {
        text: 'Open the fridge and get yourself a nice cold can',
        nextText: 4
      },
      {
        text: 'Get some Whiskey from the shelf',
        nextText: 5
      },
      {
        text: 'Have a refreshing glass of water from the tap',
        nextText: 6
      }
    ]
  },
  {
    id: 4,
    text: 'After drinking the can you feel refreshed and ready to take on any monster. But first you need to...',
    options: [
      {
        text: 'Go to the bathroom',
        nextText: 7
      }
    ]
  },
  {
    id: 5,
    text: 'The Whiskey calms you down and makes you feel tired. You go back into the living room and fall asleep on the sofa. Unfortunately some Zombies are breaking into your house and you get killed in your sleep.',
    options: [
      {
        text: 'You are dead. Wanna try again?',
        nextText: -1
      }
    ]
  },
  {
    id: 6,
    text: 'After drinking the water you feel fit and hydrated. Your mind is clear and you are ready to take on any monster challenge. But first you need to...',
    options: [
      {
        text: 'Go to the bathroom',
        nextText: 7
      }
    ]
  },
  {
    id: 7,
    text: 'On your way to the bathroom you have to cross the entrance hall. Something is banging and bumping on your door. Before you know the door is falling towards you and a Zombie is crashing into the hall. In panic you search for something to defend yourself. You realize that you still got the remote control in your pocket and throw it with all your power against the Zombie. It hits the Zombie hard and bursts into pieces. The Zombie is tumbling backwards against the drawer. A lot of things are falling to the ground.',
    options: [
      {
        text: 'Grab the umbrella',
        requiredState: (currentState) => currentState.remoteControl,
        //Here we are "trading" the remote control for an umbrella, 
        //which means that we no longer have the remote control. 
        //So the remote control in our setState is no longer true.
        setState: { remoteControl: false, umbrella: true },
        nextText: 8
      },
      {
        text: 'Take the keys',
        requiredState: (currentState) => currentState.remoteControl,
        //If we trade the remote control for something, the next option will only show three options.
        //The ones without required states and the one where it says true.
        //Try it yourself. If you select the keys, you will see all options from id 8, except the one that says
        //"Hide behind the umbrella", because you have no umbrella.
        //It's the other way around if you grab the umbrella.
        setState: { remoteControl: false, keys: true },
        nextText: 8
      },
      {
        text: 'Just run',
        requiredState: (currentState) => currentState.remoteControl,
        setState: { remoteControl: false },
        nextText: 13
      }
    ]
  },
  {
    id: 8,
    text: 'You gather all your courage and fight the Zombie in the entrance hall',
    options: [
      {
        text: 'You use your bare hands to fight',
        nextText: 9
      },
      {
        text: 'Attack it with the keys',
        requiredState: (currentState) => currentState.keys,
        nextText: 10
      },
      {
        text: 'Hide behind the umbrella',
        requiredState: (currentState) => currentState.umbrella,
        nextText: 11
      },
      {
        text: 'Scream as loud as you can',
        nextText: 12
      }
    ]
  },
  {
    id: 9,
    text: 'What a stupid idea. The Zombie ate your hands first and then rest of you.',
    options: [
      {
        text: 'You are dead. Wanna try again?',
        nextText: -1
      }
    ]
  },
  {
    id: 10,
    text: 'You fool thought this Zombie could be slain with keys?',
    options: [
      {
        text: 'You are dead. Wanna try again?',
        //This option ends the game and calls the function above, because the next Text is less than zero.
        //this makes the game restart.
        nextText: -1
      }
    ]
  },
  {
    id: 11,
    text: 'The Zombie had problems to get you behind the umbrella. Well, at first. After a few attempts the umbrella broke and the Zombie ate you.',
    options: [
      {
        text: 'You are dead. Wanna try again?',
        nextText: -1
      }
    ]
  },
  {
    id: 12,
    text: "You are scared to death and scream as loud as you can. The high sound that is coming from your mouth is out of this world. Crystal is bursting. You see the Zombie's head swelling. It gets bigger and bigger - and finally explodes. What a mess.",
    options: [
      {
        text: 'Congratulations. You fought the Zombie and are save...for now. Wanna play again?',
        nextText: -1
      }
    ]
  },
  {
    id: 13,
    text: 'While the Zombie is still trying to get back in balance you turn around and run upstairs. You stumble and fall, you get up and run. As you reach the sleeping room, you can hear the Zombie growling behind you. Facing the window in front of you, the bed to your right, the wardrobe to your left and the Zombie behind you, you are trapped! What do you do?',
    options: [
      {
        text: 'Stay in front of the window and in the last second jump to the side',
        nextText: 14
     },
     {
        text: 'Hide under the bed',
        nextText: 15
     },
     {
        text: 'Hide in the wardrobe',
        nextText: 16
     }
    ]
   },
   {
    id: 14,
    text: "Every second feels like forever as you watch the Zombie approaching you. You wait for the exact right moment and then you jump aside. The Zombie can't stop in it's tracks and falls right through the window. You watch the dead body from above with relief as you suddenly hear a death rattle coming out of the dark behind you. The front door!!! It was open the whole time! That's your last thought as the new Zombie is digging it's theeth into your throat.",
    options: [
      {
        text: 'You are dead. Wanna try again?',
        nextText: -1
      }
    ]
  },
  {
    id: 15,
    text: "You quickly slip under the bed. The Zombie is trying to grab you, but can't get under the bed. For the moment you are safe, but trapped under the bed. You start searching around in the dark until your hands touch something. You grab it. It's a slingshot! Hooray! You are able to shot the Zombie right into it's ugly head.  ",
    options: [
      {
        text: 'Congratulations. You fought the Zombie and are save...for now. Wanna play again?',
        nextText: -1
      }
    ]
  },
  {
    id: 16,
    text: "You jump into the wardrobe and close the doors. The Zombie angrily riots around and is able to push in the doors. You are dinner.",
    options: [
      {
        text: 'You are dead. Wanna try again?',
        nextText: -1
      }
    ]
  },
]

startGame()

//Not sure if I explained/commented everything well, guess i'm not a good teacher. 
//I still hope this is enough.