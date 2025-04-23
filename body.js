// Sphere class to represent sol and any orbiting body
class Body {
    constructor(name, col, size, a, b, cx = 0, cy = 0, orbitSpeed = 0) {
        this.name = name;
        this.col = col; // color
        this.size = log(size + 2) * 3.5; // body diameter
        this.a = a * 0.8; // width radius
        // this.a = b * 1.50;
        this.b = b * 0.9; // height radius
        this.cx = cx; // center of orbit
        this.cy = cy; // center of orbit
        this.orbitSpeed = TWO_PI/(orbitSpeed * framesPerBeat); // degrees of rotation each frame
        this.angle = 0; // cumulative angle change
        this.orbitCount = 0;
        this.angle = random(TWO_PI); //TODO TESTING
    }

    update() {
        if (min(this.a, this.b) > 0){
            let newAngle = this.angle + this.orbitSpeed;
            if (newAngle >= TWO_PI)
                this.orbitCount = this.orbitCount + 1;
            this.angle = newAngle % TWO_PI;
        }
    }

    display_orbit() {
        push();
        translate(width/2, height/2); // center screen
        fill(255, 0);
        if (this.orbitCount > 0)
            fill(255, map(this.angle, 0, TWO_PI, 55, 0));
            // fill(255, map(this.angle, 0, TWO_PI, 15, 0));
        // stroke(255,20);
        stroke(255,75);
        // noStroke();
        ellipse(this.cx, this.cy, this.a * 2, this.b * 2);
        pop();
    }

    display_text() {
        push();
        let textX = 50;
        let textY = 0;
        switch(this.name){
            case 'Sol': textY = 15;
                break;
            case 'Mercury': textY = 25;
                break;
            case 'Venus': textY = 35;
                break;
            case 'Earth': textY = 45;
                break;
            case 'Mars': textY = 55;
                break;
            case '4 Vesta': textY = 65;
                break;
            case 'Ceres': textY = 75;
                break;
            case 'Jupiter': textY = 85;
                break;
            case 'Saturn': textY = 95;
                break;
            case 'Neptune': textY = 105;
                break;
            case 'Uranus': textY = 115;
                break;
            case 'Pluto': textY = 125;
                break;
            default: textY = height + 100; // offscreen anything else
        }
        fill(0);
        rect(0,0,50,100); //flat background, reduce text blur
        fill(255);
    
        text('Name: ' + this.name + ', Orbit Count: ' + this.orbitCount, textX, textY);
        pop();
    }

    display() {
        push();
        translate(width/2, height/2); // center screen
        let x = this.cx + this.a * cos(this.angle);
        let y = this.cy + this.b * sin(this.angle);
        noStroke();
        fill(this.col);
        circle(x, y, this.size);
        pop();
    }
}


/* Maths
Parametric equation of an ellipse

x = cx + a * cos(t)
y = cy + b * sin(t)

t = angle parameter, from 0 to Tau (2 PI)
cos(t) = x component
sin(t) = y component
a & b = scale value for eccentricity
cx & cy = offset for center point

Source: https://www.mathopenref.com/coordparamellipse.html

*/