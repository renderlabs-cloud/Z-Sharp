type Person = {
	name: byte[]
};

let myName: byte[] = 'Brendan Lucas';

let me: Person = {
	name: myName
};

function greet(person: Person): byte[] {

};

let myGreeting: byte[] = greet(me);

// Console.log(myGreeting);
