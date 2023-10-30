import type { PanZoomOptions } from 'panzoom';
import type { TransformType } from '../types/transformType';
import type { MapObjectType } from '$lib/types/mapObjectTypes';

export const deskProps: TransformType = {
	x: 0,
	y: 0,
	width: 100 + 6, // + x is the border (wallProps.height)
	height: 50,
	rotation: 0
};

export const roomProps: TransformType = {
	x: 0,
	y: 0,
	width: 100 + 6,  // + x is the border (wallProps.height)
	height: 100 + 6, // + x is the border (wallProps.height)
	rotation: 0
};

export const wallProps: TransformType = {
  x: 0,
  y: 0,
  width: 200 + 6,
  height: 6,  //INFO: do not make an odd number
  rotation: 0
};

export const doorProps: TransformType = {
  x: 0,
  y: 0,
  width: 50 + 6,  // + x is the border (wallProps.height)
  height: 20 ,
  rotation: 0
};

export const mapMagnetSteps = 25;

export const getTransformFromType = (type: string) => {
	switch (type) {
		case mapObjectType.Desk:
			return deskProps;
		case mapObjectType.Room:
			return roomProps;
    case mapObjectType.Wall:
      return wallProps;
    case mapObjectType.Door:
      return doorProps;
		default:
			throw new Error(`Invalid type ${type}`);
	}
};

export const panzoomProps: PanZoomOptions = {
	smoothScroll: false,
	maxZoom: 3,
	minZoom: 0.25,
	initialZoom: 1,
};

export const mapObjectType: MapObjectType = {
	Desk: 'Desk',
	Room: 'Room',
  Wall: 'Wall',
  Door: 'Door'
};

//values to represent the default values for the map
export const defaultMapProps = {
	//width in px, dividable by 25
	width: 750,
	//height in px, dividable by 25
	height: 750,
	//min space on desk place between desks and border of the map in px, dividable by 25
	border: 50,
	//max distance from origin before recentering in px, dividable by 25
	maxHorizontalDist: 750,
	//max distance from origin before recentering in px, dividable by 25
	maxVerticalDist: 750
};
