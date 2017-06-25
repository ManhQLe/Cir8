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
```html
															.-------------.
															| CONSOLE LOG |
														    '-------IN----'
											 .--+---------.          |
										.----|IN|  POW(2) |----W4----'
	         .---+--------------.		|    '--+---------'
	W1--->---+IN1|          .---|       |     .------------.
	         |   |  ADDCHIP |OUT+--W3---+-->--+IN|  PRINT  |
	W2--->---+IN2|	        '---|             '------------'
			 `---+--------------'

	W1,W2,W3 are conduits which connects module


```           
1. Example of module
```html
        .------+------------+-------.
		|  IN  | PROGRAMMER	|  OUT  |
		| PORTS| DEFINED	| PORTS |
		|      | LOGIC		|       |
		'------+------------+-------'
```

### Cir8 programming component







## AUTHOR
>Manh Le

## CONTRIBUTION
>Is Welcome

## LICENSE
>Free to use on any project, any type of project. Have fun : )