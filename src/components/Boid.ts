class Vector {
  x: number;
  y: number;
  constructor(_x: number, _y: number) {
    this.x = _x;
    this.y = _y;
  }
  add(vector: Vector) {
    this.x += vector.x;
    this.y += vector.y;
  }
  sub(vector: Vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }
  div(divs: number) {
    this.x /= divs;
    this.y /= divs;
  }
  mult(num: number) {
    this.x *= num;
    this.y *= num;
  }
  setMag(newMag: number) {
    const mag = Math.sqrt(this.x * this.x + this.y * this.y);
    if (mag > 0) {
      this.x = (this.x * newMag) / mag;
      this.y = (this.y * newMag) / mag;
    }
  }
  limit(newMag: number) {
    const mag = Math.sqrt(this.x * this.x + this.y * this.y);
    if (mag > newMag) {
      this.x = (this.x * newMag) / mag;
      this.y = (this.y * newMag) / mag;
    }
  }
}

function random(max: number) {
  return Math.random() * max;
}

function randomRange(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  const subXs = x2 - x1;
  const subYs = y2 - y1;
  return Math.sqrt(subXs * subXs + subYs * subYs);
}

function vectorSub(v1: Vector, v2: Vector) {
  const tmp = new Vector(0, 0);
  tmp.x = v1.x - v2.x;
  tmp.y = v1.y - v2.y;
  return tmp;
}

export class Boid {
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  maxForce: number;
  maxSpeed: number;
  index: number;
  constructor(i: number) {
    this.position = new Vector(
      random(window.innerWidth),
      random(window.innerHeight)
    );
    this.velocity = new Vector(randomRange(0.1, 2), randomRange(0.1, 2));
    this.velocity.setMag(3);
    this.acceleration = new Vector(0, 0);
    this.maxForce = 0.2;
    this.maxSpeed = 5;
    this.index = i;
  }

  edges() {
    if (this.position.x > window.innerWidth) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = window.innerWidth;
    }
    if (this.position.y > window.innerHeight) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = window.innerHeight;
    }
  }

  align(boids: Array<Boid>) {
    const perceptionRadius = 25;
    const steering = new Vector(0, 0);
    let total = 0;
    for (const other of boids) {
      const d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids: Array<Boid>) {
    const perceptionRadius = 24;
    const steering = new Vector(0, 0);
    let total = 0;
    for (const other of boids) {
      const d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        if (d > 0) {
          const diff = vectorSub(this.position, other.position);
          diff.div(d * d);
          steering.add(diff);
          total++;
        }
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids: Array<Boid>) {
    const perceptionRadius = 50;
    const steering = new Vector(0, 0);
    let total = 0;
    for (const other of boids) {
      const d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids: Array<Boid>) {
    const alignment = this.align(boids);
    const cohesion = this.cohesion(boids);
    const separation = this.separation(boids);

    alignment.mult(1.5);
    cohesion.mult(1);
    separation.mult(3);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }
}
