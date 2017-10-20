/**
 * Created by lav010 on 20.10.2017.
 */
 var Creature = function (sex)
 {
 this.sex = sex;
 }
 Creature.prototype.sexit = function () {
	
    console.log("пол ", this.sex|| "middle");
};
 

var Human = function (sex,age) {

	Creature.apply(this, arguments);
	console.log("arg ",arguments);
	this.age = age;
};
Human.prototype = Creature.prototype;
Human.prototype.sayAge = function () {
	
    console.log("возраст", this.age|| 1000);
};

var person, anotheePerson;

var Person= function (sex,age,name) {
    Human.apply(this,arguments);
    this.name = name;
};

Person.prototype = Human.prototype;
Person.prototype.constructor = function (name) {
    this.name = name;
};

Person.prototype.greet = function () {

    console.log("hello " + this.name);
};
console.log(Person.prototype);
person = new Person("female",12,"Joane");
person.greet();
person.sayAge();
person.sexit();
