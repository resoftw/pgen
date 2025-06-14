const W = 512;
const H = 512;
let fonts=[];
let areas = [];
let pts = [];
function _expand(b,n){
    b.x-=n;
    b.y-=n;
    b.w+=n*2;
    b.h+=n*2;
    return b;
}

function _area(x,y,b,n){
    let a={
        x:b.x+x,
        y:b.y+y,
        w:b.w,
        h:b.h
    }
    switch (n){
        case 1:
            a.x=x+b.h+b.y;
            a.y=y+b.x;
            a.w=b.h;
            a.h=b.w;
            break;
        case 2:
            a.x=x-b.w-b.x;
            a.y=y+b.h+b.y-1;
            a.w=b.w;
            a.h=b.h;
            break;
        case 3:
            a.x=x-b.h;
            a.y=y-b.w-b.x;
            a.w=b.h;
            a.h=b.w;
            break;
    }
    return _expand({...a},2);
}
class Teks {
    constructor(x,y,f,sz,o,t,c)
    {
        this.x=x;
        this.y=y;
        this.f=f;
        this.s=sz;
        let tb = f.textBounds(t,0,0,sz);
        this.b=_expand({...tb},2);
        this.a=_area(x,y,tb,o);
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
        // noFill();
        // stroke('red');
        // rect(this.b.x,this.b.y,this.b.w,this.b.h);
        pop();
        // fill('yellow')
        // circle(this.x,this.y, 4);
        // stroke('blue');
        // noFill();
        // rect(this.a.x,this.a.y,this.a.w,this.a.h);
    }
}
let boxes = [];
function isOverlap(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
}

function findMaxFreeArea(x, y, occupied, canvasWidth, canvasHeight) {
    let maxLeft = x, maxRight = x + 1;
    let maxTop = y, maxBottom = y + 1;
  
    // Helper to test area against all occupied
    function isFreeArea(x, y, w, h) {
      const rect = { x, y, w, h };
      return occupied.every(area => !isOverlap(rect, area));
    }
  
    // Expand left
    while (maxLeft > 0 && isFreeArea(maxLeft - 1, maxTop, maxRight - maxLeft + 1, maxBottom - maxTop)) {
      maxLeft--;
    }
  
    // Expand right
    while (maxRight < canvasWidth && isFreeArea(maxLeft, maxTop, maxRight - maxLeft + 1, maxBottom - maxTop)) {
      maxRight++;
    }
  
    // Expand up
    while (maxTop > 0 && isFreeArea(maxLeft, maxTop - 1, maxRight - maxLeft, maxBottom - maxTop + 1)) {
      maxTop--;
    }
  
    // Expand down
    while (maxBottom < canvasHeight && isFreeArea(maxLeft, maxTop, maxRight - maxLeft, maxBottom - maxTop + 1)) {
      maxBottom++;
    }
  
    return {
      x: maxLeft,
      y: maxTop,
      w: maxRight - maxLeft,
      h: maxBottom - maxTop
    };
}
  

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

let btnsave;

function generatesvg()
{
    let svg = [];
    svg.push(`<?xml version="1.0" encoding="UTF-8"?>`);
    svg.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
    svg.push(`<rect width="100%" height="100%" fill="white"/>`); // background
  
    for (let b of boxes) {
        let fontFamily = b.f.font.names.fontFamily.en || "sans-serif";
        //console.log(b.f.font.names);
        let rotate = b.o * 90;
        let pts = b.f.textToPoints(b.t,b.x,b.y,b.s);
        let pp = pts.map(point => `${point.x},${point.y}`).join(',');
        svg.push(`
            <polygon points="${pp}" fill="black" stroke="none"/>
        `);
    //   svg.push(`
    //     <text x="${b.x}" y="${b.y}" 
    //       font-family="${fontFamily}" 
    //       font-size="${b.s}" 
    //       fill="${b.c}" 
    //       transform="rotate(${rotate} ${b.x} ${b.y})"
    //       dominant-baseline="hanging">
    //       ${b.t}
    //     </text>
    //   `);
    }
  
    svg.push(`</svg>`);
    return svg.join("\n");
}
let tosave=false;
function savesvg()
{
    // let svgString=generatesvg();
    // const blob = new Blob([svgString], {type: "image/svg+xml"});
    // const url = URL.createObjectURL(blob);

    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "output.svg";
    // a.click();

    // URL.revokeObjectURL(url);
    tosave=true;
}

let div;
let st
function setup() {
  createCanvas(W, H,SVG);
  pixelDensity(1);
  areas=[];
  btnsave = createButton('Save SVG');
  btnsave.position(10,10);
  btnsave.mousePressed(savesvg);
  div=createDiv('b:a');
  div.position(W+10,10)
  //randomSeed(1);
  st=millis()
}

let lo = 0
let hasmouse=false;
let mx;
let my;
function mouseClicked()
{
    mx=mouseX;
    my=mouseY;
    console.log(mx,my)
    hasmouse=true;
}

function doit()
{
    background(255);
    if (true)
    {
        let x;
        let y;
        if (hasmouse)
        {
            x=mx;
            y=my;
            hasmouse=false;
        }
        else {
            x = boxes.length<50?round(random(W)/64)*64:random(W);
            y = boxes.length<50?round(random(H)/64)*64:random(H);
        }
        const ar = findMaxFreeArea(x,y,areas,W,H);
        _expand(ar,-2)
        let orient = ar.w>ar.h?random([0,2]):random([1,3]);
        //orient = boxes.length % 4
        if (boxes.length>100){
            switch(orient){
                case 0:
                    x=ar.x
                    y=ar.y+ar.h
                    break;
                case 1:
                    x = ar.x
                    y = ar.y
                    break;
                case 2:
                    x=ar.x+ar.w
                    y=ar.y+2
                    break;
                case 3:
                    x=ar.x+ar.w
                    y= ar.y+ar.h
                    break
            }
        }
        if (!tosave){
            push()
            noFill()
            stroke('red')
            rect(ar.x,ar.y,ar.w,ar.h)
            fill('red')
            noStroke()
            circle(x,y,10)
            pop()
        }
        let sz = 30;//random(80);
        let ok = false;
        let t=null;
        let fnt=random(fonts);
        let txt=random(['RUN','run','Run'])
        div.html(`LOOP: ${lo}<br/>Teks:${boxes.length}<br/>SZ:${sz}<br/>Orient:${orient}`)
        while (!ok){
            t = new Teks(
                x,y,
                fnt,sz,orient,
                txt,'black'
            );
            let ovl=areas.some(a => isOverlap(a, t.a));
            if (!ovl){
                //console.log(t.a);
                ok=true;
                break;
            }
            sz--;
            if (sz<3){
                ok=false;
                break;
            }
            //console.log(sz)
        }
        if (ok){
            //console.log(t)
            boxes.push(t)
            areas.push({...t.a});
            //console.log(areas.length);
        }
    }
    for(let b of boxes){
        b.draw();
    }
    if (tosave){
        save('out.svg');
        tosave=false;
    }
    lo++;

}


function draw() {
    let ct=millis()
    if (ct-st>100){
        doit();
        st=ct;
    }
}