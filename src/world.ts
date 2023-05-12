export { createWorld, selectRandomlyPathPoints };
import * as Engine from './engine.js';

// Create a 2D array of 0, representing the world
function createMatrix(width: number, height: number): number[][] {
    function createRow(length: number): number[] {
        if (length === 1) return [0];
        return [0].concat(createRow(length - 1));
    }

    if (height === 1) return [createRow(width)];
    return [createRow(width)].concat(createMatrix(width, height - 1));
}

// Create line on a 2D array between 2 points
function createLineBetweenPoints(matrix: number[][], point1: number[], point2: number[], value: number): number[][] {
    const x1 = point1[1];
    const y1 = point1[0];
    const x2 = point2[1];
    const y2 = point2[0];

    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dx === 0 && dy === 0) return matrix;

    if (Math.abs(dy) > Math.abs(dx)) {
        if (dy > 0) {
            matrix[y1 + 1][x1] = value;
            return createLineBetweenPoints(matrix, [y1 + 1, x1], point2, value);
        } else {
            matrix[y1 - 1][x1] = value;
            return createLineBetweenPoints(matrix, [y1 - 1, x1], point2, value);
        }
    } else {
        if (dx > 0) {
            matrix[y1][x1 + 1] = value;
            return createLineBetweenPoints(matrix, [y1, x1 + 1], point2, value);
        } else {
            matrix[y1][x1 - 1] = value;
            return createLineBetweenPoints(matrix, [y1, x1 - 1], point2, value);
        }
    }
}

// Select 4 points randomly where the path will be by giving their coordinates (Source, target and 2 other points)
function selectRandomlyPathPoints(width: number, height: number): number[][] {
    const getRandomInt = (size: number) => Math.floor(Math.random() * size);

    const selectedRows = [0, Math.floor(height / 3), Math.floor((2 * height) / 3), height - 1];
    return selectedRows.map((row) => [row, getRandomInt(width)]);
}

// Create the path between the 4 points
function createPath(matrix: number[][], pathPoints: number[][], value: number): number[][] {
    function createPathBetweenPoints(matrix: number[][], point1: number[], point2: number[]) {
        return createLineBetweenPoints(matrix, point1, point2, value);
    }

    pathPoints.map((point) => matrix[point[0]][point[1]] = Engine.type.end);

    pathPoints.map((point, index) => {
        if (index < pathPoints.length - 1) {
            return createPathBetweenPoints(matrix, point, pathPoints[index + 1]);
        }
        return 0;
    });

    matrix[pathPoints[pathPoints.length - 1][0]][pathPoints[pathPoints.length - 1][1]] = Engine.type.end;

    return matrix;
}

function createRiver(matrix: number[][], pathPoints: number[][], width: number): number[][] {
    const i = Math.floor((pathPoints[1][0] + pathPoints[3][0]) / 2);
    let j = Math.floor((pathPoints[1][1] + pathPoints[3][1]) / 2);
    if (Math.abs(j - pathPoints[2][1]) < width / 4) {
        j = (j + Math.floor(width / 2)) % width;
    }
    const newPoint = [i, j];
    return createPath(matrix, [pathPoints[1], newPoint, pathPoints[3]], Engine.type.river);
}

function markSpawnAndEnd(world: number[][], pathPoints: number[][]) {
    world[pathPoints[0][0]][pathPoints[0][1]] = Engine.type.start;
    world[pathPoints[pathPoints.length - 1][0]][pathPoints[pathPoints.length - 1][1]] = Engine.type.end;
    return world;
}

// Create the world
function createWorld(width: number, height: number, pathPoints: number[][]): number[][] {
    return markSpawnAndEnd(createPath(createRiver(createMatrix(width, height), pathPoints, width), pathPoints, 1), pathPoints);
}