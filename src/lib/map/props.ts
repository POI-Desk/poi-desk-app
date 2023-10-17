import type { PanZoomOptions } from 'panzoom';
import type { TransformType } from '../types/transformType';
import type { MapObjectType } from '$lib/types/mapObjectTypes';

export const deskProps: TransformType = {
	x: 0,
	y: 0,
	width: 100,
	height: 50
};

export const roomProps: TransformType = {
	x: 0,
	y: 0,
	width: 150,
	height: 100
};

export const getTransformFromType = (type: string) => {
	switch (type) {
		case mapObjectType.Desk:
			return deskProps;
		case mapObjectType.Room:
			return roomProps;
		default:
			return deskProps;
	}
};

export const panzoomProps: PanZoomOptions = {
	smoothScroll: false,
	maxZoom: 3,
	minZoom: 0.25,
	initialZoom: 1,
	autocenter: true
};

//TODO: make safer
export const mapObjectType: MapObjectType = {
	Desk: 'Desk',
	Room: 'Room'
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
