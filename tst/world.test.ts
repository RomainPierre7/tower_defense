import * as World from '../src/world';

test('create a 10*10 matrix', () => {
  expect(World.createWorld(10, 10, [[0, 2], [6, 7], [4, 6], [9, 8]])).toStrictEqual(
    [
      [0, 0, -2, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 2, 2, 2, 2, 1, 1, 0, 0],
      [0, 0, 2, 2, 2, 2, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, -1, 0]
    ]
  );
});

test('select 4 randomly points', () => {
  const width = 10;
  const height = 10;
  const points = World.selectRandomlyPathPoints(width, height);

  expect(points).toHaveLength(4);

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    expect(point).toHaveLength(2);
    expect(point[0]).toBeGreaterThanOrEqual(0);
    expect(point[0]).toBeLessThanOrEqual(width - 1);
    expect(point[1]).toBeGreaterThanOrEqual(0);
    expect(point[1]).toBeLessThanOrEqual(height - 1);
  }
});
