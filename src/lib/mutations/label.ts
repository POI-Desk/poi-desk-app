import { graphql } from '$houdini';

export const updateLabelsOnMap = graphql(`
    mutation UpdateLabelsOnMap($mapId: ID!, $labelInputs: [UpdateLabelInput!]!) {
        updateLabelsOnMap(mapId: $mapId, labelInputs: $labelInputs) {
            pk_labelId
        }
    }
`);

export const deleteLabels = graphql(`
    mutation DeleteLabels($labelIds: [ID!]!) {
        deleteLabels(labelIds: $labelIds) {
            pk_labelId
        }
    }
`);
