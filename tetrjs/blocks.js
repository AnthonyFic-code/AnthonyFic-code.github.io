class Polymino {
    constructor(grid) {
        this.standard = grid;
    }
    
    // Rotates the polymino 90 degrees to the left {ind} amount of times.
    rot(ind) {
        if(ind < 0) {
            ind = -(-(ind)%4) + 4;
        }

        // The mess with JSON copies the 2d array without causing pointer conflict.
        var temp = JSON.parse(JSON.stringify(this.standard));
        var temp2 = JSON.parse(JSON.stringify(this.standard));
        for(var i = 0; i < (ind%4); i++) {
            for(var x = 0; x < temp.length; x++) {
                for(var y = 0; y < temp[x].length; y++) {
                    temp[x][y] = temp2[y][x]
                }
            }
            for(var x = 0; x < temp.length; x++) {
                temp[x] = temp[x].reverse();
            }
            temp2 = JSON.parse(JSON.stringify(temp));
        }
        return temp;
    }
    
    return() {
        this.standard;
    }
}

export const blocks = {
    "z": new Polymino([
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]),
    "s": new Polymino([
        [0, 2, 2],
        [2, 2, 0],
        [0, 0, 0]
    ]),
    "l": new Polymino([
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ]),
    "j": new Polymino([
        [4, 0, 0],
        [4, 4, 4],
        [0, 0, 0]
    ]),
    "t": new Polymino([
        [0, 5, 0],
        [5, 5, 5],
        [0, 0, 0]
    ]),
    "i": new Polymino([
        [0, 0, 0, 0],
        [6, 6, 6, 6],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]),
    "o": new Polymino([
        [7, 7],
        [7, 7]
    ]),
    " ": new Polymino([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ])
};