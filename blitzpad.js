

class BlitzPad{
	constructor(){
		//var gamepad;
		//var chromepad;
		this.chromeIndex = -1;

		this.lastBtnValues = {};
		this.direction = {val: -1, prev: -1, time: 0};

		this.commandStr = "";
		
		this.onList = [];
		
		this.commandStrTimeout = 0;
	}
	
	setEventListeners(){
		window.addEventListener("gamepadconnected", function(e) {
			console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
			e.gamepad.index, e.gamepad.id,
			e.gamepad.buttons.length, e.gamepad.axes.length);
			
			this.gamepad = e.gamepad;
		});
		
		window.addEventListener("gamepaddisconnected", function(e) {
			console.log("Gamepad disconnected from index %d: %s",
			e.gamepad.index, e.gamepad.id);
		});
	}
	
	pollChromePad(){
		this.chromepad = navigator.getGamepads()[0];
		if(this.chromeIndex >= 0) this.chromepad = navigator.getGamepads()[this.chromeIndex];
		else{
			for(var i = 0; i < navigator.getGamepads().length; i++){
				if(navigator.getGamepads()[i] !== undefined){
					if(navigator.getGamepads()[i].buttons[0].pressed){
						this.chromeIndex = i;
					}
				}
			}
		}
	}

	isButtonDown(num){
		if(this.chromepad !== undefined){
			if(this.chromepad.buttons[num].pressed) return true;
			else if(this.chromepad.buttons[num].value == 1) return true;
		}
		
		if(this.gamepad !== undefined){
			if(this.gamepad.buttons[num].pressed) return true;
			else if(this.gamepad.buttons[num].value == 1) return true;
		}
		
		return false;
	}
	
	buttonDown(num){
		if(this.chromepad !== undefined){
			if(this.chromepad.buttons[num].pressed || (this.chromepad.buttons[num].value > 0)){
				this.lastBtnValues[num]++;
			}
			
			if(this.chromepad.buttons[num].pressed) return true;
			else if(this.chromepad.buttons[num].value == 1) return true;
		}
		
		if(this.gamepad !== undefined){
			if(this.gamepad.buttons[num].pressed || (this.gamepad.buttons[num].value > 0)){
				this.lastBtnValues[num]++;
			}
			if(this.gamepad.buttons[num].pressed) return true;
			else if(this.gamepad.buttons[num].value == 1) return true;
		}
		
		this.lastBtnValues[num] = 0;
		return false;
	}

	buttonPressed(num){
		//console.log(num);
		//console.log(lastBtnValues);
		if(!this.lastBtnValues[num]) {
			this.buttonDown(num);
		}
		
		if(this.lastBtnValues[num] == 1){
			return true;
		}

		
		return false;
	}

	pressedDirection(){
		if(this.buttonPressed(12)){
			if(this.buttonDown(14)) return 7;
			if(this.buttonDown(15)) return 9;
			return 8;
		} 
		
		if(this.buttonPressed(13)){
			if(this.buttonDown(14)) return 1;
			if(this.buttonDown(15)) return 3;
			return 2;
		} 
		
		if(this.buttonPressed(14)){
			if(this.buttonDown(12)) return 7;
			if(this.buttonDown(13)) return 1;
			return 4;
		} 
		
		if(this.buttonPressed(15)){
			if(this.buttonDown(12)) return 9;
			if(this.buttonDown(13)) return 3;
			return 6;
		} 
		
		return 5;
	}

	directionDown(){
		if(this.buttonDown(12)){
			if(this.buttonDown(14)) return 7;
			if(this.buttonDown(15)) return 9;
			return 8;
		} 
		
		if(this.buttonDown(13)){
			if(this.buttonDown(14)) return 1;
			if(this.buttonDown(15)) return 3;
			return 2;
		} 
		
		if(this.buttonDown(14)){
			if(this.buttonDown(12)) return 7;
			if(this.buttonDown(13)) return 1;
			return 4;
		} 
		
		if(this.buttonDown(15)){
			if(this.buttonDown(12)) return 9;
			if(this.buttonDown(13)) return 3;
			return 6;
		} 
		
		return 5;
	}

	directionToBtn(dir){
		if(dir == 8) return [12, -1];
		if(dir == 2) return [13, -1];
		if(dir == 4) return [14, -1];
		if(dir == 6) return [15, -1];
		
		if(dir == 7) return [12, 14];
		if(dir == 9) return [12, 15];
		if(dir == 1) return [13, 14];
		if(dir == 3) return [13, 15];
		
		return [-1, -1];
	}

	commandInput(){
		var num = -1;
		if((num = this.directionDown()) != 5){

			this.direction.prev = this.direction.val;
			this.direction.val = num;
			
			/*
			var btns = directionToBtn(direction.val);
			var btnUp = true;
			for(var i = 0; i < 2; i++){
				//console.log(btns[i]);
				if(btns[i] != -1){
					if(buttonDown(btns[i])) btnUp = false;
				} 
			}
			*/
			if(this.direction.prev == this.direction.val/* && !btnUp*/) this.direction.time++;
			else this.direction.time = 0;
			
			
			
			if(this.direction.time < 1){
				this.commandStr += num;
				this.commandStrTimeout = 0;
			}
		}
		
		else if(this.directionDown() == 5){
			
			this.direction.prev = this.direction.val;
			this.direction.val = 5;
			this.direction.time = 0;
		}
		
		//console.log("command log: " + this.commandStr);
	}
	
	commandInputPoll(timeoutLimit){
		this.commandInput();
		if(this.commandStr != ""){
			this.commandStrTimeout++;
			
			if(this.commandStrTimeout > timeoutLimit){
				console.log("commandStr timeout");
				this.commandStr = "";
				this.commandStrTimeout = 0;
			}
		}
	}
	
	commandEndPressPoll(num, str){
		if(this.buttonDown(num)){
			if(this.buttonPressed(num)){
				this.commandStr += str;
				console.log(num + " pressed! " + this.commandStr);
				
				for(var i = 0; i < this.onList.length; i++){
					if(this.onList[i].cmd === this.commandStr){
						this.onList[i].exec(this.onList[i].data);
					}
				}
				
				this.commandStr = "";
				this.commandStrTimeout = 0;
			}
		}
	}
	
	addOnListItem(str, data, func){
		this.onList.push({cmd: str, data: data, exec: func});
	}
	
	/*on(str, data, func){
		if(commandStr == str) func(data);
	}*/
}