export const closestNumber = (n: number, m: number) => {
	// find the quotient
	let q = Math.floor(n / m);

	let n1 = m * q;

	let n2 = n * m > 0 ? m * (q + 1) : m * (q - 1);

	if (Math.abs(n - n1) < Math.abs(n - n2)) return n1;

	return n2;
};

export const inBoundingbox = (element: DOMRect, box: DOMRect) => {
	return (
		element.left >= box.left &&
		element.right - element.width <= box.right &&
		element.top >= box.top &&
		element.bottom - element.height <= box.bottom
	);
};

export const transformPosition = (element: DOMRect, newParent: DOMRect, oldParent: DOMRect) => {
	let newPos = { x: 0, y: 0 };
	newPos.x = element.left - oldParent.left;
	newPos.y = element.top - oldParent.top;
	return newPos;
};

export const compareObjectsByValues = (obj1: any, obj2: any) => {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
      if (!keys2.includes(key) || !compareObjectsByValues(obj1[key], obj2[key])) return false;
  }

  return true;
};
