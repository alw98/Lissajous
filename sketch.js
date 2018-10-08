const amt = 10;
const pad = 10;
const step = Math.PI / 200;
const smallSize = 10;
const historyLen = 1000;
let tick = 0;
var histories;
function setup() {
  // put setup code here
    createCanvas(900, 900);
	setupHistories();
}

function setupHistories(){
	histories = new Array(amt);
	for(let i = 0; i < amt; i++){
		histories[i] = new Array(amt);
		for(let j = 0; j < amt; j++){
			histories[i][j] = new Array();
		}
	}
}

function draw() {
	background(0, 0, 0);
	drawGrid();
	let arrs = drawCircles();
	let t = arrs.t;
	let s = arrs.s;
			noFill();
	for(let i = 0; i < amt; i++){
			let l1 = t[i];
		for(let j = 0; j < amt; j++){
			let l2 = s[j];
			let p = l1.intersection(l2);
			let curarr = histories[i][j];
			curarr.push(p);
			if(curarr.length > historyLen)
				curarr.splice(0, 1);
			stroke((50 + i * 10 * amt)%255, (50 + j * 10 * amt)%255, (50 + i * 10 * amt)%255);
			beginShape();
			for(let point of curarr)
				vertex(point.x, point.y);
			endShape();
		}
	}
	
	tick++;
}

function drawGrid(){
	let size = width / (amt + 1);
	stroke(40, 40, 40);
	for(let i = 1; i <= amt; i++){
		line(i * size, 0, i * size, height);
		line(0, i * size, width, i * size);
	}
}

function drawCircles(){
	let size = width / (amt + 1);
	let d = size - pad * 2;
	noFill();
	let topArr = [];
	let sideArr = [];
	for(let i = 1; i <= amt; i++){
		//draw big circles
		let topC = new Point(i * size + size / 2, size / 2);
		let sideC = new Point(size / 2, i * size + size / 2);
		ellipse(topC.x, topC.y, d, d);
		ellipse(sideC.x, sideC.y, d, d);
		
		//draw the small circles around the big ones
		let topSmallC = topC.add(d / 2 * Math.cos(tick * i * step), 
								 d / 2 * Math.sin(tick * i * step));
		ellipse(topSmallC.x, topSmallC.y, smallSize, smallSize);
		topLine = new Line(new Point(topSmallC.x, 0), 
						   new Point(topSmallC.x, height));
		line(topLine.p1.x, topLine.p1.y, topLine.p2.x, topLine.p2.y);
		topArr.push(topLine);
		
		let sideSmallC = sideC.add(d / 2 * Math.cos(tick * i * step), 
								 d / 2 * Math.sin(tick * i * step));
		ellipse(sideSmallC.x, sideSmallC.y, smallSize, smallSize);
		sideLine = new Line(new Point(0, sideSmallC.y), 
							new Point(width, sideSmallC.y));
		line(sideLine.p1.x, sideLine.p1.y, sideLine.p2.x, sideLine.p2.y);
		sideArr.push(sideLine);
	}
	return {t:topArr, s:sideArr};
}

class Point{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	
	add(x, y){
		return new Point(this.x + x, this.y + y);
	}
}

class Line{
	constructor(p1, p2){
		this.p1 = p1;
		this.p2 = p2;
	}

	intersection(line){
		let x1 = this.p1.x;
		let y1 = this.p1.y;
		let x2 = this.p2.x;
		let y2 = this.p2.y;

		let x3 = line.p1.x;
		let y3 = line.p1.y;
		let x4 = line.p2.x;
		let y4 = line.p2.y;
		
		
		let denominator = (y4 - y3)*(x2 - x2) - (x4 - x3)*(y2 - y1);
		let na = (x4 -x3)*(y1 - y3) - (y4 - y3)*(x1 - x3);
		let nb = (x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3);
		
		let ua = na / denominator;
		let ub = nb / denominator;
		
		let x = x1 + ua*(x2 - x1);
		let y = y1 + ua*(y2 - y1);
		
		return new Point(x, y);
	}
}