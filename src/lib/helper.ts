export const closestNumber = (n: number, m: number) => {
	// find the quotient
	let q = Math.floor(n / m);

	let n1 = m * q;

	let n2 = n * m > 0 ? m * (q + 1) : m * (q - 1);

	if (Math.abs(n - n1) < Math.abs(n - n2)) return n1;

	return n2;
};

export const inBoundingbox = (x: number, y: number, box: DOMRect, scale: number) => {
	return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
};

export const transformPosition = (element: DOMRect, oldParent: DOMRect) => {
	let newPos = { x: 0, y: 0 };
	newPos.x = element.left - oldParent.left;
	newPos.y = element.top - oldParent.top;
	return newPos;
};
