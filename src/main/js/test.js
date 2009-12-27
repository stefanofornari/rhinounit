function superClass() {

  this.bye = superBye;
  this.hello = superHello;
}

function subClass() {
  this.bye = subBye;
}
subClass.prototype = new superClass;

function superHello() {
  return "Hello from superClass";
}

function superBye() {
  return "Bye from superClass";
}

function subBye() {
  return "Bye from subClass";
}

var newClass = new subClass();
print(newClass.bye()+'\n');
print(newClass.hello()+'\n');
