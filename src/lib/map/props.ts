import type { PanZoomOptions } from 'panzoom';
import type { TransformType } from '../types/transformType';
import type { MapObject, MapObjectType } from '$lib/types/mapObjectTypes';
import type { UpdateDeskInput, UpdateRoomInput, UpdateWallInput, UpdateDoorInput } from '$houdini';

//TODO: make wallthinkness not part of the tarnsform
export const wallThickness = 6;

export const deskProps: TransformType = {
	x: 0,
	y: 0,
	width: 100,
	height: 50,
	rotation: 0
};

export const roomProps: TransformType = {
	x: 0,
	y: 0,
	width: 100,
	height: 100,
	rotation: 0
};

export const wallProps: TransformType = {
	x: 0,
	y: 0,
	width: 200,
	height: wallThickness,
	rotation: 0
};

export const doorProps: TransformType = {
	x: 0,
	y: 0,
	width: 50,
	height: wallThickness * 3,
	rotation: 0
};

export const labelProps: TransformType = {
	x: 0,
	y: 0,
	width: 75,
	height: 25,
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
		case mapObjectType.Label:
			return labelProps;
		default:
			throw new Error(`Invalid type ${type}`);
	}
};

export const getInputTypeFromMapObject = (mapObject: MapObject) => {
	switch (mapObject.type) {
		case mapObjectType.Desk:
			return {
				pk_deskid: mapObject.dbID,
				desknum: mapObject.id,
				x: mapObject.transform.x,
				y: mapObject.transform.y,
				userId: mapObject.userId,
				localId: mapObject.id,
			} as UpdateDeskInput;
		case mapObjectType.Room:
			return {
				pk_roomId: mapObject.dbID,
				x: mapObject.transform.x,
				y: mapObject.transform.y,
				width: mapObject.transform.width,
				height: mapObject.transform.height,
				localId: mapObject.id,
			} as UpdateRoomInput;
		case mapObjectType.Wall:
			return {
				pk_wallId: mapObject.dbID,
				rotation: mapObject.transform.rotation,
				width: mapObject.transform.width,
				x: mapObject.transform.x,
				y: mapObject.transform.y,
				localId: mapObject.id,
			} as UpdateWallInput;
		case mapObjectType.Door:
			return {
				pk_doorId: mapObject.dbID,
				rotation: mapObject.transform.rotation,
				width: mapObject.transform.width,
				x: mapObject.transform.x,
				y: mapObject.transform.y,
				localId: mapObject.id,
			} as UpdateDoorInput;
		case mapObjectType.Label:
			return {
				pk_labelId: mapObject.dbID,
				rotation: mapObject.transform.rotation,
				text: mapObject.text,
				width: mapObject.transform.width,
				height: mapObject.transform.height,
				x: mapObject.transform.x,
				y: mapObject.transform.y,
				localId: mapObject.id
			};
		default:
			throw new Error(`Invalid type ${mapObject.type}`);
	}
};

export const panzoomProps: PanZoomOptions = {
	smoothScroll: false,
	maxZoom: 3,
	minZoom: 0.25,
	initialZoom: 1,
	autocenter: false,
	onTouch: (e) => {
		// if e.touches[0].target is object SVGPolygonElement then dont preventdefault
		if (
			e.touches[0].target instanceof SVGPolygonElement ||
			e.touches[0].target instanceof SVGTextElement
		) {
			console.log('test');
			// don't prevent default
		} else {
			e.preventDefault();
		}
		console.log(e);
	},
	onClick: (e) => {
		e.preventDefault();
		e.stopPropagation();
	}
};

export const mapObjectType: MapObjectType = {
	Desk: 'Desk',
	Room: 'Room',
	Wall: 'Wall',
	Door: 'Door',
	Label: 'Label'
};

//values to represent the default values for the map
export const defaultMapProps = {
	//width in px, dividable by 25
	width: 750 + wallThickness,
	//height in px, dividable by 25
	height: 750 + wallThickness,
	//min space on desk place between desks and border of the map in px, dividable by 25
	border: 50,
	//max distance from origin before recentering in px, dividable by 25
	maxHorizontalDist: 750,
	//max distance from origin before recentering in px, dividable by 25
	maxVerticalDist: 750
};
