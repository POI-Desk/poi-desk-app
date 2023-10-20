export type TransformType = {
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
};

export const maxLeftTransform: TransformType = {
	x: Number.MAX_SAFE_INTEGER,
	y: 0,
	width: 0,
	height: 0,
	rotation: 0
};

export const maxTopTransform: TransformType = {
	x: 0,
	y: Number.MAX_SAFE_INTEGER,
	width: 0,
	height: 0,
	rotation: 0
};

export const maxRightTransform: TransformType = {
	x: Number.MIN_SAFE_INTEGER,
	y: 0,
	width: 0,
	height: 0,
	rotation: 0
};

export const maxBottomTransform: TransformType = {
	x: 0,
	y: Number.MIN_SAFE_INTEGER,
	width: 0,
	height: 0,
	rotation: 0
};

export const maxWidthTransform: TransformType = {
	x: 0,
	y: 0,
	width: Number.MAX_SAFE_INTEGER,
	height: 0,
	rotation: 0
};

export const minWidthTransform: TransformType = {
	x: 0,
	y: 0,
	width: Number.MIN_SAFE_INTEGER,
	height: 0,
	rotation: 0
};

export const maxHeightTransform: TransformType = {
	x: 0,
	y: 0,
	width: 0,
	height: Number.MAX_SAFE_INTEGER,
	rotation: 0
};

export const minHeightTransform: TransformType = {
	x: 0,
	y: 0,
	width: 0,
	height: Number.MIN_SAFE_INTEGER,
	rotation: 0
};
