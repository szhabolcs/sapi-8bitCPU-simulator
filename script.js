"use strict";

// Assembler import
import { Assembler } from "./assembler.js";
const assembler = new Assembler();

// Constants

const TXT_RUN_CODE = "Run";
const TXT_STOP_CODE = "Stop";

const SIM_STOPPED = 0;
const SIM_RUNNING = 1;

// DOM variables

let DOMMemory = document.querySelector("#memory > table");
let DOMCodeInput = document.querySelector("#asm-assembled-input");
let DOMRunBtn = document.querySelector("#run-btn");
let DOMResetBtn = document.querySelector("#reset-btn");
let DOMASMInput = document.getElementById("asm-input");
let DOMASMOutput = document.getElementById("asm-output");
let DOMAssembleBtn = document.getElementById("assemble-btn");

// CPU related variables

/** [HEX] values of R0, R1, R2, R3 */
let R = ["00", "00", "00", "00"];

/** [HEX] INP register */
let INP = "00";

/** [DEC] Program counter */
let PC = 0;

/** [HEX] Virtual memory values */
let memory = [];

/** Program speed in seconds */
let tick = 0.5;

/**
 * Simulation related variables.
 */
let simulationState = SIM_STOPPED;


// Helper functions

function initDOMMemory() {
	let address = 0;

	for (let i = 0; i < 16; i++) {
		let memoryRow = `
			<tr>
				<th scope="row">
					${hex(i, "end")}
				</th>
			`;
		for (let j = 0; j < 16; j++) {
			memoryRow += `
				<td>
					<div class="memory-val" id="mem-loc-${address}">00</div>
				</td>
			`;
			address++;
		}
		memoryRow += '</tr>';
		DOMMemory.insertAdjacentHTML('beforeend', memoryRow);
	}
}

function loadCodeToMemory() {
	let [version, operand] = DOMCodeInput.value.split('\n');
	let address = 0;
	let DOMAddress;

	if (version !== "v2.0 raw") {
		alert("Unsopported version. Please compile to v2.0 raw.");
		return;
	}

	operand = operand.split(' ');
	for (let item of operand) {
		DOMAddress = document.querySelector(`#mem-loc-${address}`);
		DOMAddress.innerText = item;

		memory[address] = item;
		address++;
	}
}

function clearDOMMemory() {
	let DOMAddresses = document.querySelectorAll(".memory-val");

	for (let address of DOMAddresses)
		address.innerText = "00";
}

function clearDOMRegisters() {
	let DOMRegisterDECValues = document.querySelectorAll(".reg-val-dec");
	let DOMRegisterHEXValues = document.querySelectorAll(".reg-val-hex");

	for (let register of DOMRegisterDECValues){
		register.value = "0";
		register.dispatchEvent(new Event("input"));
	}

	for (let register of DOMRegisterHEXValues)
		register.innerText = "0x00";
}

/**
 * Updates a registry value in DOM
 * @param {Number} id Register number
 * @param {Number} value [HEX] New value
 */
function updateDOMRegister(id, value) {
	if (isNaN(id))
		document.querySelector(`#reg-inp-div .reg-val-hex`).innerText = "0x" + value;

	document.querySelector(`#reg-${id}-div .reg-val-dec`).value = int(value);
	document.querySelector(`#reg-${id}-div .reg-val-hex`).innerText = "0x" + value;

	resizeInput(document.querySelector(`#reg-${id}-div .reg-val-dec`));
}

/**
 * Updates an address value in DOM
 * @param {Number} id Address number
 * @param {Number} value [HEX] New value
 */
function updateDOMMemory(id, value) {
	document.querySelector(`mem-loc-${id}`).innerText = value;
}

/**
 * Creates a delay in operand execution
 */
const delay = millis => new Promise((resolve, reject) => {
	setTimeout(_ => resolve(), millis)
});

/**
 * Hightlights PC location in DOM
 */
function highlightPC() {
	if (document.querySelector(`.mem-loc-hl`))
		document.querySelector(`.mem-loc-hl`).classList.remove("mem-loc-hl");

	document.querySelector(`#mem-loc-${PC}`).classList.add("mem-loc-hl");
}

function toggelSimulation() {
	if (simulationState === SIM_STOPPED) {
		DOMRunBtn.classList.add("active-btn");
		DOMRunBtn.value = TXT_STOP_CODE;
		simulationState = SIM_RUNNING;
		loadCodeToMemory();
		simulation();
	}
	else {
		DOMRunBtn.classList.remove("active-btn");
		DOMRunBtn.value = TXT_RUN_CODE;
		simulationState = SIM_STOPPED;
	}

}

function resetSimulation() {
	simulationState = SIM_STOPPED;

	R = [0, 0, 0, 0];
	PC = 0;
	memory = [];

	DOMRunBtn.classList.remove("active-btn");
	DOMRunBtn.value = TXT_RUN_CODE;
	clearDOMMemory();
	clearDOMRegisters();
	if (document.querySelector(`.mem-loc-hl`))
		document.querySelector(`.mem-loc-hl`).classList.remove("mem-loc-hl");
}

/**
 * Converts DEC to HEX
 * @param {Number} value Value to convert
 * @param {String} pad Text padding. Default "start"
 */
function hex(value, pad = "start") {
	return pad === "start" ? value.toString(16).padStart(2, '0') : value.toString(16).padEnd(2, '0');
}

function handleDOMContentEdit(e) {
	let registerId = parseInt(e.target.attributes["data-regid"].value);
	let registerValue = parseInt(e.target.value);

	if (isNaN(registerValue)){
		
		return;		// TODO: make an invalid input error
	}
	
	if (isNaN(registerId))
		INP = hex(registerValue);
	else
		R[registerId] = hex(registerValue);

	updateDOMRegister(registerId, hex(registerValue));
}

function resizeInput(e) {
	if (e.target)
		e.target.style.width = e.target.value.length + "ch";
	else
		e.style.width = e.value.length + "ch";
}

/**
 * Converts HEX to DEC.
 * 
 * Note: can also convert any base to DEC
 * @param {Number} value Value to convert
 * @param {Number} radix Base of the number. Default 16
 */
function int(value, radix = 16) {
	return parseInt(value, radix);
}

// Init function calls

initDOMMemory();
document.querySelectorAll(".editable").forEach(item => {
	resizeInput(item); // immediately call the function
});

function assembleCode() {
	DOMASMOutput.value = assembler.assemble(DOMASMInput.value);
}

// Event handling

DOMRunBtn.onclick = toggelSimulation;
DOMResetBtn.onclick = resetSimulation;
DOMAssembleBtn.onclick = assembleCode;
document.querySelectorAll(".editable").forEach(item => {
	item.addEventListener("input", e => handleDOMContentEdit(e));
	item.addEventListener("input", e => resizeInput(e)); // bind the "resizeInput" callback on "input" event

	// Prevents anything other than numebers, backspace and arrows
	item.addEventListener("keydown", e => {
		if (!(/Digit|Backspace|Arrow|Home|End/.test(e.code))){
			e.preventDefault();
		}
	});
});

/**
 * Simulation
 * 
 * 
 * OP CODES:
	| # | Mnemonics            | Action                     |
	| - | ---------------------| ---------------------------|
	| 0 | AND Ra, Rb           | Ra &= Rb                   |
	| 1 | OR Ra, Rb            | Ra |= Rb                   |
	| 2 | ADD Ra, Rb           | Ra += Rb                   |
	| 3 | SUB Ra, Rb           | Ra -= Rb                   |
	| 4 | LW Ra, (Rb)          | Ra = Mem[Rb]               |
	| 5 | SW Ra, (Rb)          | Mem[Rb] = Ra               |
	| 6 | MOV Ra, Rb           | Ra = Rb                    |
	| 7 | INP Ra               | Ra = Inp                   |
	| 8 | JEQ Ra, value|label  | PC = value|label, Ra == 0  |
	| 9 | JNE Ra, value|label  | PC = value|label, Ra != 0  |
	| a | JGT Ra, value|label  | PC = value|label, Ra > 0   |
	| b | JLT Ra, value|label  | PC = value|label, Ra < 0   |
	| c | LW Ra, value|label   | Ra = Mem[value|label]      |
	| d | SW Ra, value|label   | Mem[value|label] = Ra      |
	| e | LI Ra, value|label   | Ra = value|label           |
	| f | JMP value|label      | PC = value\|label          |
 */

async function simulation() {
	/** [DEC] OPCODE operand */
	let operand;

	/** [DEC] Register value */
	let RaValue;

	/** [DEC] Register value */
	let RbValue;

	/** [DEC] Register index in R array */
	let a;

	/** [DEC] Register index in R array */
	let b;

	while (simulationState === SIM_RUNNING) {
		await delay(tick * 1000);
		highlightPC();

		operand = int(memory[PC][1]);

		switch (memory[PC][0]) {
			case '0':	// AND Ra, Rb	|	Ra &= Rb
				a = Math.floor(operand / 4);
				b = operand % 4;
				RaValue = int(R[a]);
				RbValue = int(R[b]);
				RaValue &= RbValue;

				R[a] = hex(RaValue);
				updateDOMRegister(a, R[a]);
				PC++;

				break;
			case '1':	// OR Ra, Rb	|	Ra |= Rb
				a = Math.floor(operand / 4);
				b = operand % 4;
				RaValue = int(R[a]);
				RbValue = int(R[b]);
				RaValue |= RbValue;

				R[a] = hex(RaValue);
				updateDOMRegister(a, R[a]);
				PC++;

				break;
			case '2':	// ADD Ra, Rb	|	Ra += Rb
				a = Math.floor(operand / 4);
				b = operand % 4;
				RaValue = int(R[a]);
				RbValue = int(R[b]);
				RaValue += RbValue;

				R[a] = hex(RaValue);
				updateDOMRegister(a, R[a]);
				PC++;

				break;
			case '3':	// SUB Ra, Rb	|	Ra -= Rb
				a = Math.floor(operand / 4);
				b = operand % 4;
				RaValue = int(R[a]);
				RbValue = int(R[b]);
				RaValue -= RbValue;

				R[a] = hex(RaValue);
				updateDOMRegister(a, R[a]);
				PC++;

				break;
			case '4':	// LW Ra, (Rb)	|	Ra = Mem[Rb]
				a = Math.floor(operand / 4);
				b = operand % 4;
				RbValue = int(R[b]);

				R[a] = memory[RbValue];
				updateDOMRegister(a, R[a]);
				PC++;

				break;
			case '5':	// SW Ra, (Rb)	|	Mem[Rb] = Ra
				a = Math.floor(operand / 4);
				b = operand % 4;
				RbValue = int(R[b]);

				memory[RbValue] = R[a];
				updateDOMMemory(RbValue, R[a]);
				PC++;

				break;
			case '6':	// MOV Ra, Rb	|	Ra = Rb
				a = Math.floor(operand / 4);
				b = operand % 4;

				R[a] = R[b];
				updateDOMRegister(a, R[b]);
				PC++;

				break;
			case '7':	// INP Ra	|	Ra = Inp
				a = operand / 4;

				R[a] = INP;

				break;
			case '8':	// 8 | JEQ Ra, value|label	|	PC = value|label, Ra == 0
				a = operand / 4;

				if (R[a] == 0)
					PC = int(memory[PC + 1]);

				break;
			case '9':	// JNE Ra, value|label	|	PC = value|label, Ra != 0
				a = operand / 4;

				if (R[a] != 0)
					PC = int(memory[PC + 1]);

				break;
			case 'a':	// JGT Ra, value|label	|	PC = value|label, Ra > 0
				a = operand / 4;

				if (R[a] > 0)
					PC = int(memory[PC + 1]);

				break;
			case 'b':	// JLT Ra, value|label	|	PC = value|label, Ra < 0
				a = operand / 4;

				if (R[a] < 0)
					PC = int(memory[PC + 1]);

				break;

			case 'c':	// LW Ra, value|label	|	Ra = Mem[value|label]
				a = operand / 4;

				R[a] = memory[memory[PC + 1]];
				updateDOMRegister(a, R[a]);
				PC+=2;

				break;

			case 'd':	// SW Ra, value|label	|	Mem[value|label] = Ra
				a = operand / 4;

				memory[memory[PC + 1]] = R[a];
				updateDOMMemory(a,R[a]);
				PC+=2;

				break;
			case 'e':	// LI Ra, value|label	|	Ra = value|label
				a = operand / 4;

				R[a] = memory[PC + 1];
				updateDOMRegister(a, R[a]);
				PC+=2;

				break;
			case 'f':	// JMP value|label	|	PC = value\|label
				PC = int(memory[PC + 1]);

				break;
			default:
				alert("Unsopported OP Code of: " + memory[PC]);
		}
		console.log(PC);
	}
}