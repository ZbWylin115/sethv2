const textEl = document.getElementById("text");
const choicesEl = document.getElementById("choices");
const nameplateEl = document.getElementById("nameplate");
const vibeTextEl = document.getElementById("vibeText");
const restartBtn = document.getElementById("restartBtn");

let state = {};

function resetState() {
  state = {
    chemistry: 0,
    comfort: 0,
    respect: 0,
    boldness: 0,

    madeHimLaugh: false,
    talkedAnimals: false,
    talkedTravel: false,
    talkedBeer: false,
    gotPushy: false
  };
}

function updateVibeText() {
  const total =
    state.chemistry +
    state.comfort +
    state.respect +
    state.boldness;

  if (state.gotPushy) {
    vibeTextEl.textContent = "The vibe is wobbling. Seth is still here, but the game is narrowing its eyes at you.";
    return;
  }

  if (total <= 3) {
    vibeTextEl.textContent = "Polite start. Mild intrigue. No fireworks yet.";
  } else if (total <= 7) {
    vibeTextEl.textContent = "There is momentum here. Seth is engaged, amused, and at least somewhat tempted.";
  } else if (total <= 11) {
    vibeTextEl.textContent = "Oh this is working. There is warmth, tension, and enough mutual interest to get dangerous.";
  } else {
    vibeTextEl.textContent = "Absurdly strong vibe. The air is charged. Someone should probably act normal, but it may be too late.";
  }
}

function setScene({ speaker = "Narrator", text = "", choices = [] }) {
  nameplateEl.textContent = speaker;
  textEl.textContent = text;
  choicesEl.innerHTML = "";
  updateVibeText();

  choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => {
      if (choice.effect) choice.effect();
      if (choice.next) choice.next();
    };
    choicesEl.appendChild(btn);
  });
}

function addStats(changes = {}) {
  Object.keys(changes).forEach((key) => {
    if (typeof state[key] === "number") {
      state[key] += changes[key];
    } else {
      state[key] = changes[key];
    }
  });
}

function startGame() {
  resetState();
  introScene();
}

restartBtn.onclick = startGame;

function introScene() {
  setScene({
    speaker: "Narrator",
    text:
`It is a warm afternoon at the zoo, the kind that makes everyone move a little slower and linger a little longer.

Near a shaded enclosure, a man in a staff shirt is speaking to a family about animal enrichment. He is older, handsome in the lived-in way, and carries himself with the easy confidence of someone who has nothing to prove.

The family leaves. He glances over at you.

His name tag says SETH.

He notices you noticing.`,
    choices: [
      {
        text: `“So... do all zoo employees look this good, or did I arrive on a special day?”`,
        effect: () => addStats({ chemistry: 2, boldness: 1 }),
        next: introReplyFlirty
      },
      {
        text: `“You were good with them. You made that look easy.”`,
        effect: () => addStats({ respect: 2, comfort: 1 }),
        next: introReplyWarm
      },
      {
        text: `“I’m trying to decide whether I’m more interested in the animals or the staff.”`,
        effect: () => {
          addStats({ chemistry: 1, comfort: 1, boldness: 1 });
          state.madeHimLaugh = true;
        },
        next: introReplyCamp
      }
    ]
  });
}

function introReplyFlirty() {
  setScene({
    speaker: "Seth",
    text:
`He gives you a long look, then lets one corner of his mouth curl.

“Wow. Starting strong. Bold. Slightly dangerous. Either charming or catastrophic.”

He folds his arms.

“Lucky for you, I’ve always appreciated commitment to the bit.”`,
    choices: [
      {
        text: "“I can commit harder.”",
        effect: () => addStats({ chemistry: 2, boldness: 1 }),
        next: zooWalkScene
      },
      {
        text: "“I can also be normal. Allegedly.”",
        effect: () => addStats({ comfort: 1, respect: 1 }),
        next: zooWalkScene
      }
    ]
  });
}

function introReplyWarm() {
  setScene({
    speaker: "Seth",
    text:
`That softens him immediately.

“Thanks. Most people just say ‘wow, cool animal’ and then sprint toward the gift shop.”

He tilts his head.

“You paying attention is... nice. Rare, too.”`,
    choices: [
      {
        text: "“I notice things that seem worth noticing.”",
        effect: () => addStats({ comfort: 2, respect: 1 }),
        next: zooWalkScene
      },
      {
        text: "“You’re making it easy.”",
        effect: () => addStats({ chemistry: 1, comfort: 1 }),
        next: zooWalkScene
      }
    ]
  });
}

function introReplyCamp() {
  setScene({
    speaker: "Seth",
    text:
`He laughs, low and genuine.

“Oh, you’re one of those.”

“One of what?” you ask.

“The kind who says something shameless, then stands there all pleased with himself waiting to see if it lands.”

He pauses.

“For the record, it landed.”`,
    choices: [
      {
        text: "“Good. I hate wasting material.”",
        effect: () => addStats({ chemistry: 1, comfort: 1 }),
        next: zooWalkScene
      },
      {
        text: "“I contain multitudes. Most of them are terrible ideas.”",
        effect: () => {
          addStats({ comfort: 2 });
          state.madeHimLaugh = true;
        },
        next: zooWalkScene
      }
    ]
  });
}

function zooWalkScene() {
  setScene({
    speaker: "Narrator",
    text:
`Seth jerks his head toward the staff path.

“Walk with me,” he says. “I’ve got a few minutes before I have to go be professionally knowledgeable again.”

You fall into step beside him.

The zoo is quieter back here. Less crowd noise. More birds. More sun.

“This is the nice part,” Seth says. “The hidden part. Every place has one.”`,
    choices: [
      {
        text: "Ask what animal he never gets tired of talking about",
        effect: () => {
          addStats({ comfort: 1, respect: 1 });
          state.talkedAnimals = true;
        },
        next: animalTalkScene
      },
      {
        text: "Ask what he does when he’s not at the zoo",
        effect: () => addStats({ comfort: 1, chemistry: 1 }),
        next: lifeTalkScene
      },
      {
        text: "Tell him hidden places sound like his specialty",
        effect: () => addStats({ chemistry: 2, boldness: 1 }),
        next: flirtyPathScene
      }
    ]
  });
}

function animalTalkScene() {
  setScene({
    speaker: "Seth",
    text:
`“Otters are dangerously overpowered in the charisma department,” he says immediately. “Goats are underrated. Big cats are beautiful, but they know it, which I frankly find a little exhausting.”

He glances at you.

“People assume working at a zoo is about spectacle. It’s not. It’s care. Routine. Paying attention. Half of love is maintenance.”`,
    choices: [
      {
        text: "“That’s one of the better things I’ve heard in a while.”",
        effect: () => addStats({ comfort: 2, respect: 1 }),
        next: beerInviteScene
      },
      {
        text: "“You just made animal care sound weirdly sexy.”",
        effect: () => addStats({ chemistry: 2 }),
        next: beerInviteScene
      }
    ]
  });
}

function lifeTalkScene() {
  setScene({
    speaker: "Seth",
    text:
`“Hiking, mostly,” he says. “Beer with friends. Traveling when I can. I like places with uneven roads, good views, and one local bar that everybody swears is the real one.”

He smiles to himself.

“I’m too old for chaos every weekend. But not too old for a little chaos now and then.”`,
    choices: [
      {
        text: "Ask where he’d go tomorrow if he could disappear for a week",
        effect: () => {
          addStats({ comfort: 1, chemistry: 1 });
          state.talkedTravel = true;
        },
        next: travelTalkScene
      },
      {
        text: "Tell him he seems like a man with elite beer opinions",
        effect: () => {
          addStats({ comfort: 1, chemistry: 1 });
          state.talkedBeer = true;
        },
        next: beerTasteScene
      }
    ]
  });
}

function flirtyPathScene() {
  setScene({
    speaker: "Seth",
    text:
`He cuts his eyes at you.

“Careful. You’re drifting into trouble.”

“Good trouble?” you ask.

He takes just long enough to answer that the silence becomes its own answer.

“Potentially.”`,
    choices: [
      {
        text: "Back off slightly and let the tension breathe",
        effect: () => addStats({ chemistry: 1, respect: 1 }),
        next: beerInviteScene
      },
      {
        text: "Press harder: “I can work with potentially.”",
        effect: () => {
          addStats({ chemistry: 2, boldness: 1 });
          state.gotPushy = true;
        },
        next: beerInviteScene
      }
    ]
  });
}

function travelTalkScene() {
  setScene({
    speaker: "Seth",
    text:
`“Honestly? Somewhere green. Somewhere with trails and a little weather and a decent pint at the end of the day.”

He looks over at you.

“The dream trip is always half scenery, half who you’re with. Beautiful places get wasted on bad company.”`,
    choices: [
      {
        text: "“Then I’d better qualify as good company.”",
        effect: () => addStats({ chemistry: 1, comfort: 1 }),
        next: beerInviteScene
      },
      {
        text: "“That depends. Window seat or aisle?”",
        effect: () => {
          addStats({ comfort: 2 });
          state.madeHimLaugh = true;
        },
        next: beerInviteScene
      }
    ]
  });
}

function beerTasteScene() {
  setScene({
    speaker: "Seth",
    text:
`“I do,” he says. “Not in an annoying way. Mostly.”

He names a few styles, talks about clean lagers, good stouts, and the tragedy of overpriced beer that tastes like somebody dry-hopped a candle.

“You?” he asks. “Are you actually into it, or are you trying to flirt through beverage discourse?”`,
    choices: [
      {
        text: "“Both. I believe in layered strategy.”",
        effect: () => {
          addStats({ chemistry: 1, comfort: 1 });
          state.madeHimLaugh = true;
        },
        next: beerInviteScene
      },
      {
        text: "“A little of both, but I can be sincere on request.”",
        effect: () => addStats({ comfort: 1, respect: 1 }),
        next: beerInviteScene
      }
    ]
  });
}

function beerInviteScene() {
  setScene({
    speaker: "Narrator",
    text:
`Your walk slows near a quiet overlook.

Seth rests his forearms on the railing. The late light catches him just enough to feel unfair.

“I get off soon,” he says. “There’s a place nearby with a patio, decent beer, and no screaming children. It’s one of my finer discoveries.”

He looks at you directly.

“You seem promising. Want to keep this going?”`,
    choices: [
      {
        text: "“Yes. Absolutely.”",
        effect: () => addStats({ boldness: 1, chemistry: 1 }),
        next: patioScene
      },
      {
        text: "“Only if you promise to keep being this interesting.”",
        effect: () => addStats({ chemistry: 2, boldness: 1 }),
        next: patioScene
      },
      {
        text: "“Yeah. I’d like that.”",
        effect: () => addStats({ comfort: 2, respect: 1 }),
        next: patioScene
      }
    ]
  });
}

function patioScene() {
  setScene({
    speaker: "Narrator",
    text:
`The patio is strung with warm lights and full of soft conversation.

Seth has changed out of his work shirt. That somehow makes things worse. Or better. Probably both.

You settle in with drinks. He looks relaxed now in a different way—less professional, more personal.

“So,” he says, lifting his glass, “what exactly are your intentions with the handsome zoo man?”`,
    choices: [
      {
        text: "“To flirt irresponsibly and see whether fate rewards me.”",
        effect: () => addStats({ chemistry: 2, boldness: 1 }),
        next: patioReplyScene
      },
      {
        text: "“To find out whether there’s more to you than the very compelling surface evidence.”",
        effect: () => addStats({ comfort: 2, respect: 1 }),
        next: patioReplyScene
      },
      {
        text: "“Honestly? I saw you and wanted one more hour.”",
        effect: () => addStats({ chemistry: 1, comfort: 2 }),
        next: patioReplyScene
      }
    ]
  });
}

function patioReplyScene() {
  let extra = "";

  if (state.talkedAnimals) {
    extra += `\n\nHe studies you over the rim of his glass. “You actually listened earlier. Most people hear ‘zoo’ and stop at trivia.”`;
  }

  if (state.talkedTravel) {
    extra += `\n\n“You also asked good travel questions,” he adds. “That matters more than people think.”`;
  }

  if (state.talkedBeer) {
    extra += `\n\n“And your beer angle wasn’t terrible,” he says. “That alone puts you above a distressing number of men.”`;
  }

  setScene({
    speaker: "Seth",
    text:
`He laughs softly, but there is something more deliberate underneath it now.

“Well. Those are all better answers than I usually get.”${extra}

He leans back in his chair.

“You know what I like so far? You’re not rushing to perform. Even when you are performing, you at least make it entertaining.”`,
    choices: [
      {
        text: "Touch his hand for just a moment",
        effect: () => addStats({ chemistry: 2, boldness: 1 }),
        next: finalMomentScene
      },
      {
        text: "Hold eye contact and let the silence do the work",
        effect: () => addStats({ chemistry: 1, comfort: 1, respect: 1 }),
        next: finalMomentScene
      },
      {
        text: "Make him laugh again before things get too serious",
        effect: () => {
          addStats({ comfort: 2 });
          state.madeHimLaugh = true;
        },
        next: finalMomentScene
      }
    ]
  });
}

function finalMomentScene() {
  setScene({
    speaker: "Narrator",
    text:
`The evening deepens.

The patio lights glow. Your drinks are nearly gone. Seth is looking at you now in that unmistakable way people do when the night has narrowed down to a real possibility.

No orchestra swells. No fireworks. Just warmth, tension, and the quiet awareness that this goes somewhere or it doesn’t.

This is the moment where charm becomes action. Or doesn’t.`,
    choices: [
      {
        text: "Tell him you want to see him again, properly",
        effect: () => addStats({ comfort: 2, respect: 2 }),
        next: endingScene
      },
      {
        text: "Tell him you have wanted to kiss him for the last half hour",
        effect: () => addStats({ chemistry: 3, boldness: 2 }),
        next: endingScene
      },
      {
        text: "Tease: “You’re being looked at in a way that should probably concern you.”",
        effect: () => addStats({ chemistry: 2, comfort: 1 }),
        next: endingScene
      }
    ]
  });
}

function endingScene() {
  const total = state.chemistry + state.comfort + state.respect + state.boldness;

  let endingTitle = "";
  let endingText = "";

  if (state.gotPushy && state.respect <= 2) {
    endingTitle = "Seth";
    endingText =
`He smiles, but gently, and with distance now.

“You’re fun,” he says. “But fun and good for me are not always the same thing.”

He finishes his drink, warm but decided.

You absolutely had a shot here. Then you leaned too hard on the bit.

Ending: Too Much, Too Soon`;
  } else if (state.chemistry >= 7 && state.boldness >= 4) {
    endingTitle = "Seth";
    endingText =
`He goes still for half a second, then smiles like he has finally stopped pretending not to notice.

“Yeah,” he says quietly. “I was wondering when you were going to do something about this.”

The night ends very close, very charged, and with the distinct sense that this is not a one-off.

Ending: Patio Heat`;
  } else if (state.comfort >= 6 && state.respect >= 5) {
    endingTitle = "Seth";
    endingText =
`He looks at you with open warmth.

“I’d like to do this again,” he says. “Not the accidental zoo ambush part. The part where I like talking to you.”

It is not explosive. It is better than that. It feels like the start of something that could actually hold.

Ending: The Real Thing`;
  } else if (total >= 10) {
    endingTitle = "Seth";
    endingText =
`He laughs, shakes his head, and points at you with his glass.

“You are trouble,” he says. “Manageable trouble. Probably.”

He gives you his number.

The chemistry is there. The curiosity is there. The verdict: extremely promising.

Ending: Promising Trouble`;
  } else if (state.madeHimLaugh) {
    endingTitle = "Seth";
    endingText =
`“You’re charming,” Seth says, standing to leave. “And, against my better judgment, very funny.”

He doesn’t close the door entirely. Neither does he throw it wide open.

Sometimes a first meeting is less about conquest and more about leaving the right impression.

Ending: He’d Take Another Drink With You`;
  } else {
    endingTitle = "Narrator";
    endingText =
`Well. Nobody died. That is not nothing.

You had a decent evening, a few good lines, and one or two missed opportunities. Seth leaves with a polite smile and the sense that, in another universe, maybe you timed it better.

Ending: Nice Try, Zookeeper Romeo`;
  }

  setScene({
    speaker: endingTitle,
    text: endingText,
    choices: [
      {
        text: "Play Again",
        next: startGame
      }
    ]
  });
}

startGame();
