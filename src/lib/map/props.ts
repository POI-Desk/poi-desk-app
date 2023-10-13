import type { PanZoomOptions } from 'panzoom';
import type { TransformType } from '../types/transformType';

export const deskProps: TransformType = {
	width: 100,
	height: 50
};

export const panzoomProps: PanZoomOptions = {
	smoothScroll: false,
	maxZoom: 3,
	minZoom: 0.25,
	initialZoom: 1,
	autocenter: true
};

//values to represent the default values for the map
export const defaultMapScale = {
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
