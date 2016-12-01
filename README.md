# blitzpad

### initialize the BlitzPad object.
```javascript
//initialize the blitzPad object.
var blitzPad = new BlitzPad();
```

### Add your command strings to BlitzPad.
```javascript
//if the commandStr equals "46463214C" after a confirmed commandEndPressPoll pass execicute the function below.
blitzPad.addOnListItem(
	"46463214C",
	"test data",
	function(data){
		console.log(data);
		//fire a Gamma Ray.
	}
);

function hadoken(data){
	//fire a hadoken.
}

//if the commandStr equals "236C" after a confirmed commandEndPressPoll pass execicute the function called hadoken. Pass 0 to data because it's not used.
blitzPad.addOnListItem("236C", 0, hadoken);
```

### setup the event listeners.

You'll want to call rhis inside '$( document ).ready(function(){ /*HERE*/ });'

```javascript
//setup the event listeners.
blitzPad.setEventListeners();
```

### Poll for updates.

You'll want to call rhis inside your 'requestAnimationFrame' loop.

```javascript
//use this to poll the gamepad in Google Chrome.
blitzPad.pollChromePad();

//check if we even have a gamepad.
if(blitzPad.gamepad || blitzPad.chromepad){
	//PROTIP: Use isButtonDown to check if button is down without changing the lastBtnValues of the button.
	if(!blitzPad.isButtonDown(4)){
		if (blitzPad.buttonDown(12)) {
			//move up
		}
		
		if (blitzPad.buttonDown(13)) {
			//move down
		}
		
		if (blitzPad.buttonDown(14)) {
			//move left
		}
		
		if (blitzPad.buttonDown(15)) {
			//move right
		}
	}
	
	//reset commandStr after 30 frames without input.
	blitzPad.commandInputPoll(30);
	
	//add "C" to command string and perform command if any strings match. set string to "" afterward.
	blitzPad.commandEndPressPoll(3, "C");
	
	//add "break" to command string and perform command if any strings match. set string to "" afterward.
	blitzPad.commandEndPressPoll(4, "break");
}
```