import { readonly } from 'svelte/store';
import type { TransformType } from './transformType';

export type MapObjectType = {
	readonly Desk: string;
	readonly Room: string;
  readonly Wall: string;
  readonly Door: string;
};

export type MapObject = {
	id: string;
	type: string;
	transform: TransformType;
};
