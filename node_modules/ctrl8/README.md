# Ctrl8

# Installation
>npm install ctrl8 --save

## Usage
>Mainly used for creating custom component.

### Inheritance
```javascript
      function Toy(init) {
			Toy.baseConstructor.call(this,init);
	  }
	  Ctrl8.ExtendsTo(Toy)
```

### Define custom properties

```javascript
	  
	function Specification(init){
		Specification.baseConstructor.call(this,init);
		this.Prop("BaseHeight",1);
		this.Prop("Width",1);
		this.Prop("Length",1);
		this.Prop("WheelCount",2);
		this.CalcProp("Volume",function(){
			return this.Width*this.BaseHeight*this.Length;
		})
	}
	
	Ctrl8.ExtendsTo(Specification)

	function Toy(init) {
		Toy.baseConstructor.call(this,init);
		this.Prop("Name","My Default Name");
		this.CalcProp("Specs",function(name,store){
			return new Specification(store[name]||(store[name]={}))
		},null,1); //Configurable
	}
	Ctrl8.ExtendsTo(CustomComponent1)

	function ControlUnit(init){
		ControlUnit.baseConstructor.call(this,init);
		this.Prop("Memory",3000000000); //3GBs
		this.Prop("Speed",45000000000); //4.5GHz;
	}

	Ctrl8.ExtendsTo(ControlUnit)

	function ASpec(init){
		ASpec.baseConstructor.CalcProp(this,init);
		this.Prop("RequiredPower",1.3) // Default 1.3 volts;
		this.Prop("WireCount",3) //Default WireCount: 3
		this.CalcProp("CPU",function(name,store){
			return new ControlUnit(store[name]||(store[name]={}))
		});
	}

	Specification.ExtendsTo(ASpec)


	function Robot(init){
		Robot.baseConstructor.call(this.init);
		this.Prop("SerialNumber","0000-0000-0000");
		this.CalcProp("Specs",function(name,store){
			return new ASpec(store[name]||(store[name]={}))
		},null,1) //Override Specs
	}

	Toy.ExtendsTo(Robot);


	var Comp1 = new Toy({
		"Name":"Toy1", // Set initial name
		"Specs": {
			"BaseHeight": 2,
			"Width":12,
			"Length":20,
			"WheelCount":4
		}
	})

	console.log(Comp1.Name);
	console.log("Toy Length: " , Comp1.Specs.Length);
	console.log("Volume: ", Comp1.Specs.Volume);

	var Android1 = new Robot({
		"Name":"Made Of Steel",
		"Specs": {
			"BaseHeight": 10,
			"Width":2,
			"Length":2,
			"WheelCount":8,
			"RequiredPower":9,
			"WireCount":125,
			"CPU":{
				"Memory":8000000000 //8GBs
			}
		}
	})

	console.log("Robot name: ",Android1.Name);
	console.log("Brain Speed: ",Android1.Specs.CPU.Speed);
	Android1.Specs.CPU.Speed+=2000; //Add more speed;

	console.log("New Brain Speed: ",Android1.Specs.CPU.Speed);

```


