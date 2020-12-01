const gl = $("#mainCanvas")[0].getContext('webgl');

class Particle {
    x = 0;
    y = 0;

    particleTick(deltaTime) {
        x += 0.1;
    }
}

class Emitter {
    particles = [];

    VBO = null;

    updateData() {
        //Create array buffer
const buffer = new ArrayBuffer(20 * vertices.length);
//Fill array buffer
const dv = new DataView(buffer);
    }
    constructor() {
        for(let i = 0; i < 100; i++)
            this.particles.push(new Particle());

        VBO = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
    render() {

    }
}

var emit = new Emitter();

$(document).ready(function(){
    alert("awesome");
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    

    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    requestAnimationFrame(Render);
});

var last = Date.now();
function Render() {
    requestAnimationFrame(Render);
    var deltaTime = Date.now() - last;

    emit.render(deltaTime);

    last = Date.now();
}