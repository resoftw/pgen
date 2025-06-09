let fonts=[];

function _expand(b,n){
    //console.log(b,n);
    b.x-=n;
    b.y-=n;
    b.w+=n*2;
    b.h+=n*2;
    //console.log(b);
    return b;
}

function _rotate(b,n){
    return b;
}
class Teks {
    constructor(x,y,f,sz,o,t,c)
    {
        this.x=x;
        this.y=y;
        this.f=f;
        this.s=sz;
        this.b=_expand(f.textBounds(t,0,0,sz),4);
        this.b=_rotate(this.b,this.o);
        this.o=o;
        this.t=t;
        this.c=c;
    }
    draw()
    {
        push();
        textFont(this.f);
        translate(this.x,this.y);
        switch(this.o)
        {
            case 1:rotate(radians(90));break;
            case 2:rotate(radians(180));break;
            case 3:rotate(radians(270));break;
        }
        textSize(this.s);
        fill(this.c)
        text(this.t,0,0);
        noFill();
        stroke('red');
        rect(this.b.x,this.b.y,this.b.w,this.b.h);
        pop();
        fill('yellow')
        circle(this.x,this.y, 10);
    }
}
let boxes = [];

function preload() {
    let fns = [
        './assets/fonts/AlumniSansSC-Bold.ttf',
        './assets/fonts/Oswald-Regular.ttf',
        './assets/fonts/Quicksand-Bold.ttf',
        './assets/fonts/Quicksand-Regular.ttf',
        './assets/fonts/RobotoSlab-Regular.ttf',
        './assets/fonts/WDXLLubrifontTC-Regular.ttf',
    ];
    for (let i=0;i<6;i++){
        fonts[i]=loadFont(fns[i])
    }
}


function setup() {
  createCanvas(600, 600);
//   boxes.push(new Teks(300,300,fonts[0],50,0,'RUN','black'));
//   boxes.push(new Teks(300,300,fonts[1],25,1,'RUN','gray'));
//   boxes.push(new Teks(300,300,fonts[2],25,2,'RUN','green'));
//   boxes.push(new Teks(300,300,fonts[3],25,3,'RUN','blue'));
}


function draw() {
    background(210);
    if (boxes.length<100)
    boxes.push(
        new Teks(
            random(0,600),random(0,600),
            random(fonts),random(8,50),round(random(0,4)),
            random(['RUN','run','Run']),'grey'
        )
    )
    for(let b in boxes){
        boxes[b].draw();
    }
}