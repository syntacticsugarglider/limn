import { IContent } from '../challenges';
import basicPrimitives from './basic_primitives';
import signedDistanceFields from './signed_distance_fields';

const content: IContent = {
    content: {
        'Basic primitives': basicPrimitives,
        'signed distance fields': signedDistanceFields,
    },
    names: ['Basic primitives', 'signed distance fields'],
};

export default content;
