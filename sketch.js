let objects = [];
let stars = [];
let font;

const fps = 60;
const secondsPerFrame = 1 / fps;
const bpm = 90;
// 90beats_minute / 60seconds_minute = 1.5beats_second
// 60frames_second / 1.5beats_second = 40 frames_beat
const framesPerBeat = 60 / (bpm / 60);

/* offset all orbits, change in setup() */
let orbitOffsetX;
let orbitOffsetY;

/* fullscreen */
let w = window.innerWidth;
let h = window.innerHeight; 

/* Media Wall Full Res*/
// let w = 1920;
// let h = 1200; 

function setup() {
    createCanvas(w, h);
    frameRate(fps);
    angleMode(RADIANS);
    font = loadFont('fonts/BigBlueTerminal/BigBlueTerm437NerdFontMono-Regular.ttf');
    
    const halfw = width/2;
    const halfh = height/2;
    
    /* offset all orbits, within setup to enable width & height math */
    orbitOffsetX = 0;
    orbitOffsetY = 0;

    // "...,you must first create the universe."
    // name, color, size, orbitW, orbitH, offsetX, offsetY, orbitSpeed
    objects.push(new Body('Sol', color(255), 294.118, 0, 0, 0, 0, 0));
    /* Create objects - Inner System */
    objects.push(new Body('Mercury', color(200), 1, halfw * 0.05, halfh * 0.05, 0, 0, 1));
    objects.push(new Body('Venus', color(200), 2.529, halfw * 0.075, halfh * 0.075, 0, 0, 2.5));
    objects.push(new Body('Earth', color(200), 2.676, halfw * 0.1, halfh * 0.1, 0, 0, 4));
    objects.push(new Body('Mars', color(200), 1.412, halfw * 0.125, halfh * 0.125, 0, 0, 7.75));
    /* Create Planets - Asteroid Belt */
    objects.push(new Body('4 Vesta', color(200), 0.108, halfw * 0.3, halfh * 0.3, 0, 0, 15));
    objects.push(new Body('Ceres', color(200), 0.471, halfw * 0.325, halfh * 0.325, 0, 0, 19));
    /* Create Planets - Outer System */
    objects.push(new Body('Jupiter', color(200), 29.412, halfw * 0.45, halfh * 0.45, 0, 0, 47));
    objects.push(new Body('Saturn', color(200), 24.706, halfw * 0.55, halfh * 0.55, 0, 0, 123));
    objects.push(new Body('Uranus', color(200), 10, halfw * 0.65, halfh * 0.65, 0, 0, 351));
    objects.push(new Body('Neptune', color(200), 9.1, halfw * 0.77, halfh * 0.77, 0, 0, 684));
    /* Create Planets - Kuiper Belt */
    objects.push(new Body('Pluto', color(200), 0.487, halfw * 0.95, halfh * 0.95, 0, 0, 1032.75));
}

function draw() {

    // background(0,0,0,50); // streak
    background(0,0,0); // no streak
    stroke(255,55);

    /* p5 capture settings, uncomment in index.html to enable */
    // @30fps - 1080frames:36sec, 10800:6minutes, 21600:12
    // if (frameCount === 1) {
    //     const capture = P5Capture.getInstance();
    //     capture.start({
    //         format: "mp4",
    //         frameRate: 30,
    //         duration: 21600,
    //     });
    // }

    /* Terminator line */
    // push();
    // translate(width/2,height/2);
    // stroke(255);
    // line(orbitOffsetX,orbitOffsetY,width,orbitOffsetY);
    // pop();

    /* apply updates to all planets */
    objects.forEach(planet => { // Render objects
        planet.display_orbit();
        // if (random() > 0.7 )
            planet.display();
        planet.display_text();
        planet.update();
    });

    /* Halt animation after num of frames */
    // if (frameCount >= 10)
    //     noLoop();
}

/* name    | Orbital Period n:Mercury | Diameter M | Distance M | Diameter Scale n:Mercury
   Sun     | 0                        | 1          | 0          | 294.118
   Mercury | 1                        | 0.0034     | 42         | 1
   Venus   | 2.5                      | 0.0086     | 75         | 2.529
   Earth   | 4                        | 0.0091     | 110        | 2.676
   Mars    | 7.75                     | 0.0048     | 165        | 1.412
   4 Vesta | 15                       | tiny       | 247.8      | 0.108
   Ceres   | 19                       | tiny       | 290.85     | 0.471
   Jupiter | 47                       | 0.1        | 560        | 29.412
   Saturn  | 123                      | 0.084      | 1000       | 24.706
   Uranus  | 351                      | 0.034      | 2000       | 10
   Neptune | 684                      | 0.033      | 3000       | 9.1
   Pluto   | 1032.75                  |            | 4345       | 0.487 
*/

/* (Stellar) Body class to represent sol, the planets, and orbiting objects */
class Body {
    constructor(name, col, size, a, b, cx = 0, cy = 0, orbitSpeed = 0) {
        this.name = name;
        this.col = col; // color
        this.size = log(size + 2) * 3.5; // body diameter

        this.a = a * 0.8; // width radius
        // this.a = b * 1.50;
        this.b = b * 0.9; // height radius
        this.cx = cx + orbitOffsetX; // center of orbit
        this.cy = cy + orbitOffsetY; // center of orbit

        this.orbitSpeed = TWO_PI/(orbitSpeed * framesPerBeat); // degrees of rotation each frame
        this.angle = 0; // cumulative angle change
        this.angle = random(TWO_PI); //TODO TESTING

        this.orbitCount = 0;
        this.totalTimeSeconds = this.calc_total_time_seconds();
        this.remainingTimeSeconds = 0;
    }

    /* length of orbit in seconds */
    calc_total_time_seconds() {
        const framesPerOrbit = TWO_PI / this.orbitSpeed;
        return secondsPerFrame * framesPerOrbit;
    }

    /* total orbit - elapsed orbit in seconds */
    calc_remaining_time_seconds() {
        const elapsedTimeSeconds = secondsPerFrame * (this.angle % TWO_PI / this.orbitSpeed);
        this.remainingTimeSeconds = this.totalTimeSeconds - elapsedTimeSeconds;
    }

    /* progress along orbit, update angle and time remaining */
    update() {
        if (min(this.a, this.b) > 0){
            let newAngle = this.angle + this.orbitSpeed;
            if (newAngle >= TWO_PI)
                this.orbitCount = this.orbitCount + 1;
            this.angle = newAngle % TWO_PI;
            this.calc_remaining_time_seconds();
        }
    }

    /* display elliptical orbit, fill when body completes orbit */
    display_orbit() {
        push();
        translate(width/2, height/2); // center screen
        noFill();
        /* noFill until first full orbit */
        if (this.orbitCount > 0)
            fill(255, map(this.angle, 0, TWO_PI, 55, 0)); //no streak
            // fill(255, map(this.angle, 0, TWO_PI, 15, 0)); // streak
        stroke(255,75); // no streak
        // stroke(255,20); //streak
        ellipse(this.cx, this.cy, this.a * 2, this.b * 2);
        pop();
    }

    display_text() {
        push();
        let textX = 35;
        let textY = 0;
        switch(this.name){
            case 'Mercury': textY = 37;
                break;
            case 'Venus': textY = 49;
                break;
            case 'Earth': textY = 61;
                break;
            case 'Mars': textY = 73;
                break;
            case '4 Vesta': textY = 85;
                break;
            case 'Ceres': textY = 97;
                break;
            case 'Jupiter': textY = 109;
                break;
            case 'Saturn': textY = 121;
                break;
            case 'Uranus': textY = 133;
                break;
            case 'Neptune': textY = 145;
                break;
            case 'Pluto': textY = 157;
                break;
            default: textY = height + 100; // offscreen anything else
        }

        fill(185); //TODO TEST
        textFont(font); //TODO TEST
        textSize(13); //TODO TEST

        let nameText = '> ' + this.name + '';
        nameText = nameText.padEnd(11, ' ');

        /* dislpay orbit count, 5 digits with leading zeroes */
        let leadingZeroes = '';
        if (this.orbitCount < 10000) {
            leadingZeroes = '0';
        } if (this.orbitCount < 1000) {
            leadingZeroes = '00';
        } if (this.orbitCount < 100) {
            leadingZeroes = '000';
        } if (this.orbitCount < 10) {
            leadingZeroes = '0000';
        }
        let orbitText = 'Orbits: ' + leadingZeroes + this.orbitCount;

        /* display percentage of orbit completed, 2 digits with leading zero */
        let percentOfOrbit = Math.floor((this.angle/TWO_PI) * 100);
        leadingZeroes = '';
        if (percentOfOrbit < 10)
            leadingZeroes = '0';
        let progressText = 'Progress: ' + leadingZeroes + percentOfOrbit  + '%';

        /* display time in seconds remaining of orbit, 3.2 digits with leading zero(es) */
        leadingZeroes = '';
        if (this.remainingTimeSeconds < 100) {
            leadingZeroes = '0';
        } if (this.remainingTimeSeconds < 10) {
            leadingZeroes = '00';
        }
        let timeText = 'Countdown: ' + leadingZeroes + this.remainingTimeSeconds.toFixed(2); //TODO

        text(nameText + timeText, textX, textY); // top left
        textY = textY + height * 0.775;
        text(nameText + orbitText, textX, textY); // bottom left
        textX = width * 0.825;
        text(nameText + progressText, textX, textY); // bottom right
        pop();
    }

    /* display body along orbit */
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

  /* "Film Grain" */
    // push();
    // fill(255);
    // stroke(255,130);
    // strokeWeight(2);
    // for (let i = 0; i < 4; i++)
    //     point(random(width),random(height));
    // textSize(1);
    // text('Science Rules',random(width),random(height));
    // text('Papo Pepo',random(width),random(height));
    // pop();
