function Radiants2Grads(radians) {
    return radians * 180 / Math.PI;
}

function GradsToRadians(grads) {
    return grads * (3.1416 / 180);
}

function RandomCoordinate(){
    var x1 = (Math.random() * 100) / 2;
    var x2 = (Math.random() * 100) / 2;
    return x1 - x2;
}