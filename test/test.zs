type Test1 = {
	value: byte
};

type Test2 = {
	value: Test1
};

type Test3 = {
	value: Test2
};

let foo: Test3 = hello;
