# Cir8
> A programming model which accomodates three software development properties: Modular, Asynchronous and Reactive programming (MAR).

## M.A.R Programming Model
> This is a new type of programming model in which we define our program in terms of flows chart or circuitry.
> In this new paradigm, a programmer will not only be a programmer but also be circuit planner.
> The logic/function of this type of computer program mainly comes from how a programmers design their circuits from basic components.

## Advantages
> This kind will allow a program to have: Modular property (lego like), Multi-ordered parallel processing and synchronization, reactive behavior (domino effect).

## General steps of creating a M.A.R program
1. Define component(s).
	a. Define Input(s).
	b. Define component logic.
2. Fabricate/instantiate components instances.
3. Connect components to create program's circuit.
4. Send intial inputs to boot the flow.

## Cir8 - A javascript library support M.A.R Model

### Node JS installation
> npm install cir8 --save

### Dependencies
0. Ctrl8

### Symbols and Defintions
0. Circuit/Flow chart
> A collection of Modules/Packs connected to each other by conduits/media.

1. Module/Pack/component
>A unit belongs to a circuit. Its main job is to take in inputs and produce outputs.

2. Conduit/Medium
>A unit belongs to a circuit. Its main job is to propagate information from one module to another module.

3. Port
>Belongs to a module, has collection of input and output gates which allow signal/data to flow in and out module.

4. Module logic
>Programmer defined logic of how to produce outputs from input gates.

### Visualization 

0. Example of Circuit
```
						   		.-------------.
						   		| CONSOLE LOG |
						   		'-------IN----'
				    		 .--+---------.          |
				            .----|IN|  POW(2) |----W4----'
		 .---+--------------.	    |    '--+---------'
	W1--->---+IN1|          .---|       |     .------------.
	         |   |  ADDCHIP |OUT+--W3---+-->--+IN|  PRINT  |
	W2--->---+IN2|	        '---|             '------------'
		 `---+--------------'

	W1,W2,W3 are conduits which connects module


```           
1. Example of module
```
        	.------+------------+-------.
		|  IN  | PROGRAMMER |  OUT  |
		| PORTS| DEFINED    | PORTS |
		|      | LOGIC	    |       |
		'------+------------+-------'
```

### Cir8 programming component
#### CPack - for creating module
1. FX: a function which define module behavior
2. Ins: An array of port names
```javascript
	
	/*Create a that adds 1 to input and send to output*/
	var Add1Module = new CPack({
		"Ins":["MYINPUT"], //Define input port name MYINPUT
		"FX":function() {
			var Ports = this.Ports;
			var O = Ports.MYINPUT + 1;
			Ports.MYOUT = O; //Send to port named MYOUT
		}
	})	

	/*Create a module that adds 2 inputs*/

	function AddLogic(){
		var Ports = this.Ports;		
		Ports.MY_OUTPUT = Ports.INONE + Ports.INTWO;
	}

	var AddChip = new CPack({
		"Ins":["INONE","INTWO"],
		"FX":AddLogic
	});

	/*Create a module which return divison of 2 inputs and remainder*/
	var Def = {
		"FX":function(){
			var Ports = this.Ports;		
			Ports.MY_RESULT = Math.floor(Ports.INONE / Ports.INTWO);
			Ports.MY_REMAIN = Ports.INONE % Ports.INTWO;
		},
		"Ins":["INONE","INTWO"]
	}

	var NoNameChip = new CPack(Def);

	/*Create A printout module*/
	var PrintModule = new CPack({
		"Ins":["IN"],
		"FX":function(){
			console.log(this.Ports.IN);
		}
	})

```
#### CConduit - for connecting component
1. CConduit.Connect(CComp A,string Contact)
2. CConduit.Signal = ? // Send information through conduit
```javascript
	/*Creating a wire that connects 2 of the modules above*/
	

	var W1 = new CConduit();
	W1.Connect(Add1Module,"MYINPUT");
	var W2 = new CConduit();
	W2.Connect(PrintModule,"IN");
	W2.Connect(Add1Module,"MYOUT");

	W1.Signal = 2; //Transmit 2 through Wire W1

	/*Create a circuit that computes 2 number and outputs to print module*/
	var WA = Cir8.Link(AddChip,"MY_OUTPUT","IN",PrintModule); //Link 2 contacts
	var IW1 = new CConduit();
	IW1.Connect(AddChip,"INONE");
	var IW2 = new CConduit();
	IW2.Connect(AddChip,"INTWO");

	IW1.Signal = 5;
	IW2.Signal = 3;

```
#### C1Way - a module for allowing only 1 way flow
0. Only have 2 inputs: IN and OUT
```javascript
	var W1 = new CConduit();
	var W2 = new CConduit();
	var OneWay1 = new C1Way();

	W1.Connect(OneWay1,"IN");
	W2.Connect(OneWay1,"OUT");

	//Only allow signal to propagate in direction: W1 -> W2 but not W2 -> W1;
	
```

#### Cir8 - Utility for construction of circuit
1. Cir8.Wire(name) - returns an instance of CConduit();
2. Cir8.Link(ComponentA, ContactOfA,ContactOfB,ComponentB) - returns an instance of Conduit
3. Cir8.MultiLink(Component1, ContactOf1, Component2, ContactOf2,....) - returns an instance of Conduit


## ROAD MAP
[ ]. Circuit description
> Where programmers describe a circuit in string variable. And have a factory to generate circuit.
```html
	Vision Draft 
	Wire: ----->---W1-----  
	C1Way: -----<]----- , -----[>-----
	Component: ---W1-->---(PORT1){OptionalCustomPackage}/CompName/[Namespace.Logic](Port2)-----<---W2----

```

```javascript
	/* DESCRIPTION OF CIRCUIT
        W1---->--(N1)Adder
        W2---->---(I)Clock1---(N2)Adder---<]----W3-->--(I)ACCChip(O)--->--W4--(I)DispChip
        W3---->---(I)Clock2(O)-->---(T2)TimeChart(T1)--<--W6---(O)Clock1
    */
	var MAP = "W1---->--(N1)Adder\n" +
        "W2---->---(I)Clock1---(N2)Adder---<]----W3-->--(I)ACCChip(O)--->--W4--(I)DispChip\n" +
        "W3---->---(I)Clock2(O)-->---(T2)TimeChart(T1)--<--W6---(O)Clock1";

	var CircuitBoard = Cir8.ComposeCircuit(MAP,ComponentInfo);

```




## AUTHOR
>Manh Le

## CONTRIBUTION
>Is Welcome

## LICENSE
>Free to use on any project, any type of project. Have fun : )